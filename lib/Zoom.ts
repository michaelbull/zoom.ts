import { createZoomInListener } from './event/EventListeners';
import {
    addEventListener,
    removeEventListener
} from './event/Events';

const SCROLL_Y_DELTA: number = 50;

let zoomInListener: EventListener;

export function addZoomListener(window: Window): void {
    zoomInListener = createZoomInListener(window, SCROLL_Y_DELTA);
    addEventListener(window.document.body, 'click', zoomInListener);
}

export function removeZoomListener(window: Window): void {
    removeEventListener(window.document.body, 'click', zoomInListener);
}
