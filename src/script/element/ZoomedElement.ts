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

export abstract class ZoomedElement {
    private static addTransitionEndListener(element: HTMLElement, listener: EventListener): void {
        if ('transition' in document.body.style) {
            element.addEventListener('transitionend', listener);
            element.addEventListener('webkitTransitionEnd', listener);
        } else {
            listener(undefined);
        }
    }

    private static removeTransitionEndListener(element: HTMLElement, listener: EventListener): void {
        element.removeEventListener('transitionend', listener);
        element.removeEventListener('webkitTransitionEnd', listener);
    }

    protected _fullSrc: string;
    private _element: Zoomable;

    constructor(element: Zoomable) {
        this._fullSrc = element.getAttribute(FULL_SRC_KEY) || element.currentSrc || element.src;
        this._element = element;
    }

    open(): void {
        document.body.classList.add(OVERLAY_LOADING_CLASS);

        this.zoomedIn();
        this._element.src = this._fullSrc;

        ZoomedElement.addTransitionEndListener(this._element, this.openedListener);
    }

    close(): void {
        const bodyClassList: DOMTokenList = document.body.classList;
        bodyClassList.remove(OVERLAY_OPEN_CLASS);
        bodyClassList.add(OVERLAY_TRANSITIONING_CLASS);

        Style.transform(this._element, '');
        Style.transform(wrap, '');
        ZoomedElement.addTransitionEndListener(this._element, this.closedListener);
    }

    protected abstract zoomedIn(): void;

    protected abstract disposed(): void;

    protected abstract width(): number;

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

    private repaint(): void {
        /* tslint:disable */
        this._element.offsetWidth;
        /* tslint:enable */
    }

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

    private opened(): void {
        ZoomedElement.removeTransitionEndListener(this._element, this.openedListener);
        document.body.classList.remove(OVERLAY_TRANSITIONING_CLASS);
    }

    private closed(): void {
        ZoomedElement.removeTransitionEndListener(this._element, this.closedListener);

        if (wrap.parentNode) {
            this._element.setAttribute(ZOOM_FUNCTION_KEY, ZOOM_IN_VALUE);
            wrap.parentNode.replaceChild(this._element, wrap);
            document.body.classList.remove(OVERLAY_TRANSITIONING_CLASS);
            this.disposed();
        }
    }

    private openedListener: EventListener = () => {
        this.opened();
    };

    private closedListener: EventListener = () => {
        this.closed();
    };
}
