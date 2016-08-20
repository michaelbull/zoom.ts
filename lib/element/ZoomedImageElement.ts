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
     */
    constructor(element: Zoomable) {
        super(element);
        this._image = element as HTMLImageElement;
    }

    /**
     * @inheritDoc
     */
    zoomedIn(): void {
        const image: HTMLImageElement = document.createElement('img');

        image.onload = (): any => {
            this.loaded(image.width, image.height);
            this._image.removeAttribute(FULL_SRC_KEY);
        };

        image.src = this._fullSrc;
    }

    /**
     * @inheritDoc
     */
    zoomedOut(): void {
        /* empty */
    }

    /**
     * @inheritDoc
     */
    width(): number {
        return this._image.width;
    }
}
