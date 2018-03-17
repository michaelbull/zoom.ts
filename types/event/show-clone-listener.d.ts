import { ZoomDOM } from '../dom/zoom-dom';
/**
 * An {@link EventListenerObject} that is called when the clone's 'load' event has fired. It checks to see if the clone
 * has not yet been made visible, and ensures that we only show the clone if the image is fully expanded to avoid the
 * image dimensions breaking mid-expansion.
 */
export declare class ShowCloneListener implements EventListenerObject {
    private dom;
    constructor(dom: ZoomDOM);
    handleEvent(evt: Event): void;
}
