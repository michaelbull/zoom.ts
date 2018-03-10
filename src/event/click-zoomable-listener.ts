import { Container } from '../dom/container';
import { Image } from '../dom/image';
import { Wrapper } from '../dom/wrapper';
import { ZoomDOM } from '../dom/zoom-dom';
import { fullSrc } from '../element/element';

export class ClickZoomableListener implements EventListenerObject {
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

                if (parent.classList.contains(Container.CLASS) && grandparent.classList.contains(Wrapper.CLASS)) {
                    let dom = ZoomDOM.useExisting(image, parent, grandparent);

                    if (!dom.wrapper.isTransitioning() && !dom.wrapper.isExpanded()) {
                        evt.preventDefault();
                        evt.stopPropagation();
                        this.callback(dom);
                    }
                } else {
                    let dom = ZoomDOM.create(image);

                    dom.appendContainerToWrapper();
                    dom.replaceImageWithWrapper();
                    dom.appendImageToContainer();
                    dom.appendCloneToContainer();

                    evt.preventDefault();
                    evt.stopPropagation();
                    this.callback(dom);
                }
            }
        }
    }
}
