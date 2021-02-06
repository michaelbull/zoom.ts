import { Config } from '../config';
import { ZoomDOM } from '../dom';
import { fullSrc } from '../dom/element';

/**
 * An {@link EventListenerObject} that will invoke a {@link callback} when the
 * {@link MouseEvent#target} is a {@link HTMLImageElement} to be zoomed.
 */
export class ZoomListener implements EventListenerObject {
    private readonly config: Config;
    private readonly callback: (dom: ZoomDOM) => void;

    constructor(config: Config, callback: (dom: ZoomDOM) => void) {
        this.config = config;
        this.callback = callback;
    }

    handleEvent(evt: MouseEvent): void {
        let image = evt.target;

        if (image instanceof HTMLImageElement && image.classList.contains(this.config.image.classNames.base)) {
            if (evt.metaKey || evt.ctrlKey) {
                evt.preventDefault();
                evt.stopPropagation();

                let src = fullSrc(image, this.config.image.attributeNames.src);
                window.open(src, '_blank');
            } else if (image.parentElement !== null && image.parentElement.parentElement !== null) {
                let parent = image.parentElement;
                let grandparent = image.parentElement.parentElement;

                let parentIsContainer = parent.classList.contains(this.config.container.classNames.base);
                let grandparentIsWrapper = grandparent.classList.contains(this.config.wrapper.classNames.base);

                let dom: ZoomDOM;
                if (parentIsContainer && grandparentIsWrapper) {
                    dom = ZoomDOM.useExisting(image, this.config, parent, grandparent);
                } else {
                    dom = ZoomDOM.create(image, this.config);
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
