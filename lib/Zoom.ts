import { createZoomListener } from './event/EventListeners';
import { addEventListener } from './event/Events';

const DEFAULT_SCROLL_DELTA: number = 50;

export function addZoomListener(window: Window, scrollDelta: number = DEFAULT_SCROLL_DELTA): void {
    addEventListener(window.document.body, 'click', createZoomListener(window, scrollDelta));
}
