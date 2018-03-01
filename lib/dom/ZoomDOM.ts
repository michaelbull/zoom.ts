import { Clone } from './Clone';
import { Container } from './Container';
import { Image } from './Image';
import { Overlay } from './Overlay';
import { Wrapper } from './Wrapper';

export class ZoomDOM {
    static fromExisting(imageElement: HTMLImageElement): ZoomDOM {
        let overlay = Overlay.create();
        let container = new Container(imageElement.parentElement as HTMLElement);
        let wrapper = new Wrapper(container.parent());
        let image = new Image(imageElement);
        let src = wrapper.srcOf(imageElement);

        if (src === imageElement.src) {
            return new ZoomDOM(overlay, wrapper, container, image);
        } else {
            return new ZoomDOM(overlay, wrapper, container, image, new Clone(container.clone()));
        }
    }

    static fromFresh(imageElement: HTMLImageElement): ZoomDOM {
        let overlay = Overlay.create();
        let container = Container.create();
        let wrapper = new Wrapper(imageElement.parentElement as HTMLElement);
        let image = new Image(imageElement);
        let src = wrapper.srcOf(imageElement);

        if (src === imageElement.src) {
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

    replaceContainerWithImage(): void {
        this.wrapper.element.replaceChild(this.container.element, this.image.element);
    }

    appendImageToContainer(): void {
        this.container.element.appendChild(this.image.element);
    }

    appendCloneToContainer(): void {
        if (this.clone !== undefined) {
            this.container.element.appendChild(this.clone.element);
        }
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
