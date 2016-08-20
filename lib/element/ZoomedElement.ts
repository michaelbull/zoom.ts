import { Zoomable } from '../Zoomable';
import {
    FULL_SRC_KEY,
    ZOOM_FUNCTION_KEY,
    ZOOM_IN_VALUE,
    ZOOM_OUT_VALUE
} from '../util/Attributes';
import {
    OVERLAY_LOADING_CLASS,
    OVERLAY_OPEN_CLASS,
    OVERLAY_TRANSITIONING_CLASS,
    WRAP_CLASS
} from '../util/Classes';
import { Dimensions } from '../util/Dimensions';
import { Style } from '../util/Style';

const wrap: HTMLDivElement = document.createElement('div');
wrap.className = WRAP_CLASS;

/**
 * Represents a {@link Zoomable} element that may be opened or closed.
 */
export abstract class ZoomedElement {

    /**
     * Adds an event listener that is called on the end of a transition.
     * @param element The element whose events should be listened to.
     * @param listener The listener to call once an event is received.
     */
    private static addTransitionEndListener(element: HTMLElement, listener: EventListener): void {
        if ('transition' in document.body.style) {
            element.addEventListener('transitionend', listener);
            element.addEventListener('webkitTransitionEnd', listener);
        } else {
            listener(undefined);
        }
    }

    /**
     * Removes an event listener that is called on the end of a transition.
     * @param element The element whose events should no longer be listened to.
     * @param listener The listener to remove.
     */
    private static removeTransitionEndListener(element: HTMLElement, listener: EventListener): void {
        element.removeEventListener('transitionend', listener);
        element.removeEventListener('webkitTransitionEnd', listener);
    }

    /**
     * The full src of the element.
     */
    protected _fullSrc: string;

    /**
     * The underlying HTMLElement.
     */
    private _element: Zoomable;

    /**
     * Creates a new {@link ZoomedElement}
     * @param element The underlying HTMLElement.
     */
    constructor(element: Zoomable) {
        this._fullSrc = element.getAttribute(FULL_SRC_KEY) || element.currentSrc || element.src;
        this._element = element;
    }

    /**
     * Opens the zoomed view.
     */
    open(): void {
        document.body.classList.add(OVERLAY_LOADING_CLASS);

        this.zoomedIn();
        this._element.src = this._fullSrc;

        ZoomedElement.addTransitionEndListener(this._element, this.openedListener);
    }

    /**
     * Closes the zoomed view.
     */
    close(): void {
        const bodyClassList: DOMTokenList = document.body.classList;
        bodyClassList.remove(OVERLAY_OPEN_CLASS);
        bodyClassList.add(OVERLAY_TRANSITIONING_CLASS);

        Style.transform(this._element, '');
        Style.transform(wrap, '');
        ZoomedElement.addTransitionEndListener(this._element, this.closedListener);
    }

    /**
     * Called when the zoomed view is opened.
     */
    protected abstract zoomedIn(): void;

    /**
     * Called when the zoomed view is closed.
     */
    protected abstract zoomedOut(): void;

    /**
     * Calculates the actual width of the {@link _element}
     */
    protected abstract width(): number;

    /**
     * Called once the {@link _fullSrc} src of the {@link _element} is loaded.
     * @param width The width of the {@link _element}.
     * @param height The height of the {@link _element}.
     */
    protected loaded(width: number, height: number): void {
        const bodyClassList: DOMTokenList = document.body.classList;
        bodyClassList.remove(OVERLAY_LOADING_CLASS);
        bodyClassList.add(OVERLAY_TRANSITIONING_CLASS);
        bodyClassList.add(OVERLAY_OPEN_CLASS);

        this._element.parentNode.insertBefore(wrap, this._element);
        wrap.appendChild(this._element);

        this._element.setAttribute(ZOOM_FUNCTION_KEY, ZOOM_OUT_VALUE);

        this.scaleElement(width, height);
        this.translateWrap();
    }

    /**
     * Forces the {@link _element} to repaint on the canvas.
     */
    private repaint(): void {
        /* tslint:disable */
        this._element.offsetWidth;
        /* tslint:enable */
    }

    /**
     * Scales the {@link _element} to fill the dimensions of the viewport.
     * @param width The width of the {@link _element}.
     * @param height The height of the {@link _element}.
     */
    private scaleElement(width: number, height: number): void {
        this.repaint();

        const viewportWidth: number = Dimensions.viewportWidth();
        const viewportHeight: number = Dimensions.viewportHeight();

        const viewportAspectRatio: number = viewportWidth / viewportHeight;

        const maxScaleFactor: number = width / this.width();
        const aspectRatio: number = width / height;

        let scaleFactor: number;

        if (width < viewportWidth && height < viewportHeight) {
            scaleFactor = maxScaleFactor;
        } else if (aspectRatio < viewportAspectRatio) {
            scaleFactor = (viewportHeight / height) * maxScaleFactor;
        } else {
            scaleFactor = (viewportWidth / width) * maxScaleFactor;
        }

        Style.transform(this._element, 'scale(' + scaleFactor + ')');
    }

    /**
     * Translates the coordinates of the {@link wrap} to offset the {@link _element} to the center of the page.
     */
    private translateWrap(): void {
        this.repaint();

        const scrollX: number = Dimensions.scrollX();
        const scrollY: number = Dimensions.scrollY();

        const viewportWidth: number = Dimensions.viewportWidth();
        const viewportHeight: number = Dimensions.viewportHeight();

        const viewportX: number = viewportWidth / 2;
        const viewportY: number = scrollY + (viewportHeight / 2);

        const element: Zoomable = this._element;
        const rect: ClientRect = element.getBoundingClientRect();
        const centerX: number = rect.left + scrollX + ((element.width || element.offsetWidth) / 2);
        const centerY: number = rect.top + scrollY + ((element.height || element.offsetHeight) / 2);

        const x: number = Math.round(viewportX - centerX);
        const y: number = Math.round(viewportY - centerY);

        Style.transform(wrap, 'translate(' + x + 'px, ' + y + 'px) translateZ(0)');
    }

    /**
     * An event lister that adds the {@link OVERLAY_TRANSITIONING_CLASS} to the document body.
     */
    private openedListener: EventListener = () => {
        ZoomedElement.removeTransitionEndListener(this._element, this.openedListener);
        document.body.classList.remove(OVERLAY_TRANSITIONING_CLASS);
    };

    /**
     * An event listener that closes the zoomed view.
     */
    private closedListener: EventListener = () => {
        ZoomedElement.removeTransitionEndListener(this._element, this.closedListener);

        if (wrap.parentNode) {
            this._element.setAttribute(ZOOM_FUNCTION_KEY, ZOOM_IN_VALUE);
            wrap.parentNode.replaceChild(this._element, wrap);
            document.body.classList.remove(OVERLAY_TRANSITIONING_CLASS);
            this.zoomedOut();
        }
    };
}
