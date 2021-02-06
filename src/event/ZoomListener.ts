import { Config } from '../config';
import { ZoomDOM } from '../dom';
import { fullSrc } from '../dom/element';
import { Features } from '../style';

/**
 * An {@link EventListenerObject} that will invoke a {@link callback} when the
 * {@link MouseEvent#target} is a {@link HTMLImageElement} to be zoomed.
 */
export class ZoomListener implements EventListenerObject {
    private readonly config: Config;
    private readonly features: Features;
    private readonly callback: (dom: ZoomDOM) => void;

    constructor(config: Config, features: Features, callback: (dom: ZoomDOM) => void) {
        this.config = config;
        this.features = features;
        this.callback = callback;
    }

    handleEvent(evt: MouseEvent): void {
        let image = evt.target;

        if (image instanceof HTMLImageElement && image.classList.contains(this.config.image.classNames.base)) {
            if (evt.metaKey || evt.ctrlKey) {
                this.openInNewTab(evt, image);
            } else {
                this.zoom(evt, image);
            }
        }
    }

    private openInNewTab(evt: MouseEvent, image: HTMLImageElement) {
        evt.preventDefault();
        evt.stopPropagation();

        let src = fullSrc(image, this.config.image.attributeNames.src);
        window.open(src, '_blank');
    }

    private zoom(evt: MouseEvent, image: HTMLImageElement) {
        if (image.parentElement === null || image.parentElement.parentElement === null) {
            return;
        }

        let parent = image.parentElement;
        let grandparent = image.parentElement.parentElement;

        let parentIsContainer = parent.classList.contains(this.config.container.classNames.base);
        let grandparentIsWrapper = grandparent.classList.contains(this.config.wrapper.classNames.base);

        let dom: ZoomDOM;
        if (parentIsContainer && grandparentIsWrapper) {
            dom = ZoomDOM.useExisting(image, this.config, this.features, parent, grandparent);
        } else {
            dom = ZoomDOM.create(image, this.config, this.features);
            dom.appendContainerToWrapper();
            dom.replaceImageWithWrapper();
            dom.appendImageToContainer();
            dom.appendCloneToContainer();
        }

        let collapsed = !dom.wrapper.isTransitioning() && !dom.wrapper.isExpanded();
        if (collapsed) {
            evt.preventDefault();
            evt.stopPropagation();
            this.callback(dom);
        }
    }
}
