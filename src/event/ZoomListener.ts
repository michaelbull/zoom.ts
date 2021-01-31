import {
    Container,
    Image,
    Wrapper,
    ZoomDOM
} from '../dom';
import { fullSrc } from '../dom/element';

/**
 * An {@link EventListenerObject} that will invoke a {@link callback} when the
 * {@link MouseEvent#target} is a {@link HTMLImageElement} to be zoomed.
 */
export class ZoomListener implements EventListenerObject {
    private readonly callback: (dom: ZoomDOM) => void;

    constructor(callback: (dom: ZoomDOM) => void) {
        this.callback = callback;
    }

    handleEvent(evt: MouseEvent): void {
        let image = evt.target;

        if (image instanceof HTMLImageElement && image.classList.contains(Image.CLASS)) {
            if (evt.metaKey || evt.ctrlKey) {
                evt.preventDefault();
                evt.stopPropagation();
                window.open(fullSrc(image), '_blank');
            } else if (image.parentElement !== null && image.parentElement.parentElement !== null) {
                let parent = image.parentElement;
                let grandparent = image.parentElement.parentElement;

                let dom: ZoomDOM;
                if (parent.classList.contains(Container.CLASS) && grandparent.classList.contains(Wrapper.CLASS)) {
                    dom = ZoomDOM.useExisting(image, parent, grandparent);
                } else {
                    dom = ZoomDOM.create(image);
                    dom.appendContainerToWrapper();
                    dom.replaceImageWithWrapper();
                    dom.appendImageToContainer();
                    dom.appendCloneToContainer();
                }

                if (!dom.wrapper.isTransitioning() && !dom.wrapper.isExpanded()) {
                    evt.preventDefault();
                    evt.stopPropagation();
                    this.callback(dom);
                }
            }
        }
    }
}
