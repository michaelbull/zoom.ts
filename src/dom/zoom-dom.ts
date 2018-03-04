import { fullSrc } from '../element/element';
import { pixels } from '../math/unit';
import { Clone } from './clone';
import { Container } from './container';
import { Image } from './image';
import { Overlay } from './overlay';
import { Wrapper } from './wrapper';

export class ZoomDOM {
    static useExisting(element: HTMLImageElement, parent: HTMLElement, grandparent: HTMLElement): ZoomDOM {
        let overlay = Overlay.create();
        let container = new Container(parent);
        let wrapper = new Wrapper(grandparent);
        let image = new Image(element);
        let src = fullSrc(element);

        if (src === element.src) {
            return new ZoomDOM(overlay, wrapper, container, image);
        } else {
            return new ZoomDOM(overlay, wrapper, container, image, new Clone(container.clone()));
        }
    }

    static create(element: HTMLImageElement): ZoomDOM {
        let overlay = Overlay.create();
        let container = Container.create();
        let wrapper = Wrapper.create();
        let image = new Image(element);
        let src = fullSrc(element);

        if (src === element.src) {
            return new ZoomDOM(overlay, wrapper, container, image);
        } else {
            return new ZoomDOM(overlay, wrapper, container, image, Clone.create(src));
        }
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
        let parent = this.image.element.parentElement as HTMLElement;
        parent.replaceChild(this.wrapper.element, this.image.element);
    }

    appendImageToContainer(): void {
        this.container.element.appendChild(this.image.element);
    }

    appendCloneToContainer(): void {
        if (this.clone !== undefined) {
            this.container.element.appendChild(this.clone.element);
        }
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
        this.wrapper.element.style.height = pixels(this.image.element.height);
    }

    /**
     * Creates an {@link EventListener] that is called when the clone's 'load' event has fired. It checks to see if the
     * clone has not yet been made visible, and ensures that we only show the clone if the image is fully expanded to
     * avoid the image dimensions breaking mid-expansion.
     */
    createCloneLoadedListener(): EventListener {
        return (): void => {
            if (this.clone !== undefined && this.clone.isHidden() && this.wrapper.isExpanded()) {
                this.replaceImageWithClone();
            }
        };
    }

    /**
     * Removes the {@link #createCloneLoadedListener} attached to the 'load' event of a clone if the expansion of an
     * image was cancelled before the 'load' event had time to finish and fire the event. As the image was collapsed we
     * no longer care about showing it when it's loaded, and can wait for the next expansion to show the clone.
     */
    removeCloneLoadedListener(listener: EventListener | undefined): void {
        if (this.clone !== undefined && listener !== undefined) {
            if (this.clone.isLoading()) {
                this.clone.element.removeEventListener('load', listener);
            }
        }
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
