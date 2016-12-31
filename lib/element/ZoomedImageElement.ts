import { Overlay } from '../Overlay';
import { Zoomable } from '../Zoomable';
import { FULL_SRC_KEY } from '../util/Attributes';
import { ZoomedElement } from './ZoomedElement';

/**
 * Represents a {@link ZoomedElement} whose underlying element is an HTMLImageElement.
 */
export class ZoomedImageElement extends ZoomedElement {

    /**
     * The underlying image element.
     */
    private _image: HTMLImageElement;

    /**
     * Creates a new {@link ZoomedImageElement}.
     * @param element The underlying image element.
     * @param overlay The {@link Overlay}.
     */
    constructor(element: Zoomable, overlay: Overlay) {
        super(element, overlay);
        this._image = element as HTMLImageElement;
    }

    zoomedIn(loaded: Function): void {
        let image: HTMLImageElement = document.createElement('img');

        image.onload = (): any => {
            this.loaded(image.width, image.height);
            this._image.removeAttribute(FULL_SRC_KEY);
            loaded();
        };

        image.src = this._fullSrc;
    }

    zoomedOut(): void {
        /* empty */
    }

    width(): number {
        return this._image.width;
    }
}
