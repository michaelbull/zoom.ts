import {
    FULL_SRC_KEY,
    ZOOM_FUNCTION_KEY,
    ZOOM_IN_VALUE,
    ZOOM_OUT_VALUE
} from './Attributes';
import { OVERLAY_OPEN_CLASS } from './Classes';
import { Zoomable } from './Zoomable';
import { ZoomedElement } from './ZoomedElement';
import { ZoomedImageElement } from './ZoomedImageElement';
import { ZoomedVideoElement } from './ZoomedVideoElement';

const ESCAPE_KEY_CODE: number = 27;

/* pixels required to scroll vertically with a mouse/keyboard for a zoomed image to be dismissed */
const SCROLL_Y_DELTA: number = 70;

/* pixels required to scroll vertically with a touch screen for a zoomed image to be dismissed  */
const TOUCH_Y_DELTA: number = 30;

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
    private _initialScrollPosition: number;
    private _initialTouchPosition: number;

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
        });
    }

    private zoom(event: MouseEvent): void {
        event.stopPropagation();

        if (document.body.classList.contains(OVERLAY_OPEN_CLASS)) {
            return;
        }

        const target: Zoomable = event.target as Zoomable;

        if (event.metaKey || event.ctrlKey) {
            const url: string = target.getAttribute(FULL_SRC_KEY) || target.currentSrc || target.src;
            window.open(url, '_blank');
            return;
        }

        if (target.width >= window.innerWidth) {
            return;
        }

        this.dispose();

        if (target.tagName === 'IMG' || target.tagName === 'PICTURE') {
            this._current = new ZoomedImageElement(target);
        } else { /* target.tagName === 'VIDEO */
            this._current = new ZoomedVideoElement(target);
        }

        this._current.zoom();
        this.addCloseListeners();
        this._initialScrollPosition = window.scrollY;
    }

    private close(): void {
        if (this._current) {
            this._current.close();
            this.removeCloseListeners();
            this._current = undefined;
        }
    }

    private dispose(): void {
        if (this._current) {
            this._current.dispose();
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
        if (Math.abs(this._initialScrollPosition - window.scrollY) >= SCROLL_Y_DELTA) {
            this.close();
        }
    };

    private keyboardListener: EventListener = (event: KeyboardEvent) => {
        if (event.keyCode === ESCAPE_KEY_CODE) {
            this.close();
        }
    };

    private touchStartListener: EventListener = (event: TouchEvent) => {
        this._initialTouchPosition = event.touches[0].pageY;
        event.target.addEventListener('touchmove', this.touchMoveListener);
    };

    private touchMoveListener: EventListener = (event: TouchEvent) => {
        if (Math.abs(event.touches[0].pageY - this._initialTouchPosition) > TOUCH_Y_DELTA) {
            this.close();
            event.target.removeEventListener('touchmove', this.touchMoveListener);
        }
    };
}
