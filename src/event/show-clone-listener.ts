import { ZoomDOM } from '../dom/zoom-dom';

/**
 * An {@link EventListenerObject} that is called when the clone's 'load' event has fired. It checks to see if the
 * clone has not yet been made visible, and ensures that we only show the clone if the image is fully expanded to
 * avoid the image dimensions breaking mid-expansion.
 */
export class ShowCloneListener implements EventListenerObject {
    private dom: ZoomDOM;

    constructor(dom: ZoomDOM) {
        this.dom = dom;
    }

    handleEvent(evt: Event): void {
        let clone = this.dom.clone;

        if (clone !== undefined) {
            clone.element.removeEventListener('load', this);

            let wrapper = this.dom.wrapper;

            if (clone.isHidden() && wrapper.isExpanded()) {
                this.dom.replaceImageWithClone();
            }
        }
    }
}
