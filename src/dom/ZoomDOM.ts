import { Config } from '../config';
import { Features } from '../style';
import { Clone } from './Clone';
import { Container } from './Container';
import { Image } from './Image';
import { Overlay } from './Overlay';
import { Wrapper } from './Wrapper';

export class ZoomDOM {
    static useExisting(element: HTMLImageElement, config: Config, features: Features, parent: HTMLElement, grandparent: HTMLElement): ZoomDOM {
        let overlay = Overlay.create(config.overlay);
        let wrapper = new Wrapper(grandparent, config.wrapper);
        let container = new Container(parent, features);
        let image = new Image(element, config.image);
        let requiresClone = image.fullSrc() !== element.src;
        let clone = requiresClone ? new Clone(container.clone(), config.clone) : undefined;
        return new ZoomDOM(overlay, wrapper, container, image, clone);
    }

    static create(element: HTMLImageElement, config: Config, features: Features): ZoomDOM {
        let overlay = Overlay.create(config.overlay);
        let wrapper = Wrapper.create(config.wrapper);
        let container = Container.create(config.container, features);
        let image = new Image(element, config.image);
        let fullSrc = image.fullSrc();
        let requiresClone = fullSrc !== element.src;
        let clone = requiresClone ? Clone.create(config.clone, fullSrc) : undefined;
        return new ZoomDOM(overlay, wrapper, container, image, clone);
    }

    readonly overlay: Overlay;
    readonly wrapper: Wrapper;
    readonly container: Container;
    readonly image: Image;
    readonly clone?: Clone;

    constructor(overlay: Overlay, wrapper: Wrapper, container: Container, image: Image, clone?: Clone) {
        this.overlay = overlay;
        this.wrapper = wrapper;
        this.container = container;
        this.image = image;
        this.clone = clone;
    }

    appendContainerToWrapper(): void {
        this.wrapper.element.appendChild(this.container.element);
    }

    replaceImageWithWrapper(): void {
        this.image.replaceWith(this.wrapper.element);
    }

    appendImageToContainer(): void {
        this.image.appendTo(this.container.element);
    }

    appendCloneToContainer(): void {
        this.clone?.appendTo(this.container.element);
    }

    replaceImageWithClone(): void {
        if (this.clone !== undefined) {
            this.clone.show();
            this.image.hide();
        }
    }

    replaceCloneWithImage(): void {
        if (this.clone !== undefined) {
            this.image.show();
            this.clone.hide();
        }
    }

    fixWrapperHeight(): void {
        this.wrapper.element.style.height = this.image.height();
    }

    collapsed(): void {
        this.overlay.removeFrom(document.body);
        this.image.deactivate();
        this.wrapper.finishCollapsing();
    }

    /**
     * Called at the end of an expansion to check if the clone loaded before our expansion finished. If it did, and is
     * still not visible, we can now show it to the client.
     */
    showCloneIfLoaded(): void {
        if (this.clone !== undefined && this.clone.isLoaded() && this.clone.isHidden()) {
            this.replaceImageWithClone();
        }
    }
}
