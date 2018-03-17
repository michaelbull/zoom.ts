import { ZoomDOM } from '../dom/zoom-dom';
/**
 * An {@link EventListenerObject} that will invoke a {@link callback} when the
 * {@link MouseEvent#target} is a {@link HTMLImageElement} to be zoomed.
 */
export declare class ZoomListener implements EventListenerObject {
    private readonly callback;
    constructor(callback: (dom: ZoomDOM) => void);
    handleEvent(evt: MouseEvent): void;
}
