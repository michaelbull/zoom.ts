import { Overlay } from '../Overlay';
import { Zoomable } from '../Zoomable';
import { FULL_SRC_KEY, ZOOM_FUNCTION_KEY, ZOOM_IN_VALUE, ZOOM_OUT_VALUE } from '../util/Attributes';
import { Elements } from '../util/Elements';

/**
 * Represents a {@link Zoomable} element that may be opened or closed.
 */
export abstract class ZoomedElement {

    /**
     * The full src of the element.
     */
    protected _fullSrc: string;

    /**
     * The underlying HTMLElement.
     */
    private _element: Zoomable;

    /**
     * The {@link Overlay}.
     */
    private _overlay: Overlay;

    /**
     * Creates a new {@link ZoomedElement}
     * @param element The underlying HTMLElement.
     * @param overlay The {@link Overlay}.
     */
    constructor(element: Zoomable, overlay: Overlay) {
        this._fullSrc = element.getAttribute(FULL_SRC_KEY) || element.currentSrc || element.src;
        this._element = element;
        this._overlay = overlay;
    }

    /**
     * Opens the zoomed view.
     * @param loaded A function to call once the {@link _element}'s {@link _fullSrc} has loaded.
     */
    open(loaded: Function): void {
        this._overlay.state = 'loading';

        this.zoomedIn(loaded);
        this._element.src = this._fullSrc;

        Elements.addTransitionEndListener(this._element, this.openedListener);
    }

    /**
     * Closes the zoomed view.
     */
    close(): void {
        this._overlay.state = 'closing';

        window.requestAnimationFrame(() => {
            Elements.removeTransform(this._element);
            Elements.addTransitionEndListener(this._element, this.closedListener);
        });
    }

    /**
     * Called when the zoomed view is opened.
     * @param callback A function to call once the {@link _element}'s {@link _fullSrc} has loaded.
     */
    protected abstract zoomedIn(callback: Function): void;

    /**
     * Called when the zoomed view is closed.
     */
    protected abstract zoomedOut(): void;

    /**
     * Calculates the actual width of the {@link _element}.
     */
    protected abstract width(): number;

    /**
     * Called once the {@link _fullSrc} of the {@link _element} is loaded.
     * @param width The width of the {@link _fullSrc} element.
     * @param height The height of the {@link _fullSrc} element.
     */
    protected loaded(width: number, height: number): void {
        this._overlay.state = 'opening';
        this._element.setAttribute(ZOOM_FUNCTION_KEY, ZOOM_OUT_VALUE);

        let translation: string = Elements.translateToCenter(this._element);
        let scale: string = Elements.scaleToViewport(this.width(), width, height);

        window.requestAnimationFrame(() => {
            Elements.transform(this._element, translation + ' ' + scale);
        });
    }

    /**
     * An event lister that sets the {@link Overlay}'s {@link State} to open.
     */
    private openedListener: EventListener = () => {
        Elements.removeTransitionEndListener(this._element, this.openedListener);
        this._overlay.state = 'open';
    };

    /**
     * An event listener that sets the {@link Overlay}'s {@link State} to hidden and sets the {@link _element}'s
     * {@link ZOOM_FUNCTION_KEY} attribute to {@link ZOOM_IN_VALUE}.
     */
    private closedListener: EventListener = () => {
        Elements.removeTransitionEndListener(this._element, this.closedListener);

        this._overlay.state = 'hidden';
        this._element.setAttribute(ZOOM_FUNCTION_KEY, ZOOM_IN_VALUE);
        this.zoomedOut();
    };
}
