import { Clone } from './clone';
import { Container } from './container';
import { Image } from './image';
import { Overlay } from './overlay';
import { Wrapper } from './wrapper';
export declare class ZoomDOM {
    static useExisting(element: HTMLImageElement, parent: HTMLElement, grandparent: HTMLElement): ZoomDOM;
    static create(element: HTMLImageElement): ZoomDOM;
    readonly overlay: Overlay;
    readonly wrapper: Wrapper;
    readonly container: Container;
    readonly image: Image;
    readonly clone?: Clone;
    constructor(overlay: Overlay, wrapper: Wrapper, container: Container, image: Image, clone?: Clone);
    appendContainerToWrapper(): void;
    replaceImageWithWrapper(): void;
    appendImageToContainer(): void;
    appendCloneToContainer(): void;
    replaceImageWithClone(): void;
    replaceCloneWithImage(): void;
    fixWrapperHeight(): void;
    collapsed(): void;
    /**
     * Called at the end of an expansion to check if the clone loaded before our expansion finished. If it did, and is
     * still not visible, we can now show it to the client.
     */
    showCloneIfLoaded(): void;
}
