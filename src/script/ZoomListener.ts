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

const ESCAPE_KEY_CODE: number = 27;

/* pixels required to scroll vertically with a mouse/keyboard for a zoomed image to be dismissed */
const SCROLL_Y_DELTA: number = 70;

/* pixels required to scroll vertically with a touch screen for a zoomed image to be dismissed  */
const TOUCH_Y_DELTA: number = 30;

const overlay: HTMLDivElement = document.createElement('div');
overlay.className = OVERLAY_CLASS;

export class ZoomListener {

    /*!
     * http://youmightnotneedjquery.com/#ready
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

    private _current: ZoomedElement;
    private _initialScrollY: number;
    private _initialTouchY: number;

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

    private close(): void {
        if (this._current) {
            this._current.close();
            this.removeCloseListeners();
            this._current = undefined;
        }
    }

    private addCloseListeners(): void {
        window.addEventListener('scroll', this.scrollListener);
        document.addEventListener('keyup', this.keyboardListener);
        document.addEventListener('touchstart', this.touchStartListener);
    }

    private removeCloseListeners(): void {
        window.removeEventListener('scroll', this.scrollListener);
        document.removeEventListener('keyup', this.keyboardListener);
        document.removeEventListener('touchstart', this.touchStartListener);
    }

    private scrollListener: EventListener = () => {
        if (Math.abs(this._initialScrollY - Dimensions.scrollY()) >= SCROLL_Y_DELTA) {
            this.close();
        }
    };

    private keyboardListener: EventListener = (event: KeyboardEvent) => {
        if (event.keyCode === ESCAPE_KEY_CODE) {
            this.close();
        }
    };

    private touchStartListener: EventListener = (event: TouchEvent) => {
        this._initialTouchY = event.touches[0].pageY;
        event.target.addEventListener('touchmove', this.touchMoveListener);
    };

    private touchMoveListener: EventListener = (event: TouchEvent) => {
        if (Math.abs(event.touches[0].pageY - this._initialTouchY) > TOUCH_Y_DELTA) {
            this.close();
            event.target.removeEventListener('touchmove', this.touchMoveListener);
        }
    };
}
