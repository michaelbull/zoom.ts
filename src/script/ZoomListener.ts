import { Zoomable } from './Zoomable';
import { ZoomedElement } from './element/ZoomedElement';
import { ZoomedImageElement } from './element/ZoomedImageElement';
import { ZoomedVideoElement } from './element/ZoomedVideoElement';
import {
    FULL_SRC_KEY,
    ZOOM_FUNCTION_KEY,
    ZOOM_IN_VALUE,
    ZOOM_OUT_VALUE
} from './util/Attributes';
import {
    OVERLAY_CLASS,
    OVERLAY_LOADING_CLASS,
    OVERLAY_OPEN_CLASS
} from './util/Classes';
import { Dimensions } from './util/Dimensions';

/**
 * The key code for the Esc key.
 */
const ESCAPE_KEY_CODE: number = 27;

/**
 * The amount of pixels required to scroll vertically with a scroll wheel or keyboard to dismiss a zoomed element.
 */
const SCROLL_Y_DELTA: number = 70;

/**
 * The amount of pixels required to scroll vertically with a touch screen to dismiss a zoomed element.
 */
const TOUCH_Y_DELTA: number = 30;

/**
 * The overlay element.
 */
const overlay: HTMLDivElement = document.createElement('div');
overlay.className = OVERLAY_CLASS;

/**
 * Entry point to the library that can will listen for click events on zoomable elements.
 */
export class ZoomListener {

    /**
     * Executes a function when the DOM is fully loaded.
     * @param fn The function to execute.
     * @see http://youmightnotneedjquery.com/#ready
     */
    private static ready(fn: Function): void {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                fn();
            });
        } else {
            fn();
        }
    }

    /**
     * The current {@link ZoomedElement}.
     */
    private _current: ZoomedElement;

    /**
     * The value calculated from {@link Dimensions.scrollY} when a {@link ZoomedElement} is first opened.
     */
    private _initialScrollY: number;

    /**
     * The Y value of a touch event when a {@link ZoomedElement} is first opened.
     */
    private _initialTouchY: number;

    /**
     * Listens for click events on {@link Zoomable} elements and appends the {@link overlay} to the document.
     */
    listen(): void {
        ZoomListener.ready(() => {
            document.body.addEventListener('click', (event: MouseEvent) => {
                const target: Zoomable = event.target as Zoomable;

                if (target.getAttribute(ZOOM_FUNCTION_KEY) === ZOOM_IN_VALUE) {
                    this.zoom(event);
                } else if (target.getAttribute(ZOOM_FUNCTION_KEY) === ZOOM_OUT_VALUE) {
                    this.close();
                }
            });

            document.body.appendChild(overlay);
        });
    }

    /**
     * Zooms in on an element.
     * @param event The click event that occurred when interacting with the element.
     */
    private zoom(event: MouseEvent): void {
        event.stopPropagation();

        const bodyClassList: DOMTokenList = document.body.classList;
        if (bodyClassList.contains(OVERLAY_OPEN_CLASS) || bodyClassList.contains(OVERLAY_LOADING_CLASS)) {
            return;
        }

        const target: Zoomable = event.target as Zoomable;

        if (event.metaKey || event.ctrlKey) {
            const url: string = target.getAttribute(FULL_SRC_KEY) || target.currentSrc || target.src;
            window.open(url, '_blank');
            return;
        }

        if (target.width >= window.innerWidth) {
            // target is already as big (or bigger), therefore we gain nothing from zooming in on it
            return;
        }

        if (target.tagName === 'IMG' || target.tagName === 'PICTURE') {
            this._current = new ZoomedImageElement(target);
        } else { /* target.tagName === 'VIDEO */
            this._current = new ZoomedVideoElement(target);
        }

        this._current.open();
        this.addCloseListeners();
        this._initialScrollY = Dimensions.scrollY();
    }

    /**
     * Closes {@link _current}.
     */
    private close(): void {
        if (this._current) {
            this._current.close();
            this.removeCloseListeners();
            this._current = undefined;
        }
    }

    /**
     * Adds event listeners to the page to listen for element dismissal.
     */
    private addCloseListeners(): void {
        window.addEventListener('scroll', this.scrollListener);
        document.addEventListener('keyup', this.keyboardListener);
        document.addEventListener('touchstart', this.touchStartListener);
    }

    /**
     * Removes the event listeners that were listening for element dismissal.
     */
    private removeCloseListeners(): void {
        window.removeEventListener('scroll', this.scrollListener);
        document.removeEventListener('keyup', this.keyboardListener);
        document.removeEventListener('touchstart', this.touchStartListener);
    }

    /**
     * An event listener that calls {@link close} if the difference between the {@link _initialScrollY} and
     * {@link Dimensions.scrollY} is more than {@link SCROLL_Y_DELTA}.
     */
    private scrollListener: EventListener = () => {
        if (Math.abs(this._initialScrollY - Dimensions.scrollY()) > SCROLL_Y_DELTA) {
            this.close();
        }
    };

    /**
     * An event listener that calls {@link close} if the event's key code was the {@link ESCAPE_KEY_CODE}.
     * @param event The keyboard event.
     */
    private keyboardListener: EventListener = (event: KeyboardEvent) => {
        if (event.keyCode === ESCAPE_KEY_CODE) {
            this.close();
        }
    };

    /**
     * An event listener that records the event's {@link _initialTouchY} and then adds {@link touchMoveListener}.
     * @param event The touch start event.
     */
    private touchStartListener: EventListener = (event: TouchEvent) => {
        this._initialTouchY = event.touches[0].pageY;
        event.target.addEventListener('touchmove', this.touchMoveListener);
    };

    /**
     * An event listener that calls {@link close} and removes itself if the difference between
     * {@link _initialTouchY} and the current touch Y position is more than {@link TOUCH_Y_DELTA}.
     * @param event The touch movement event.
     */
    private touchMoveListener: EventListener = (event: TouchEvent) => {
        if (Math.abs(event.touches[0].pageY - this._initialTouchY) > TOUCH_Y_DELTA) {
            this.close();
            event.target.removeEventListener('touchmove', this.touchMoveListener);
        }
    };
}
