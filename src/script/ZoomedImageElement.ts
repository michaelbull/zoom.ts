import { FULL_SRC_KEY } from './Attributes';
import { Zoomable } from './Zoomable';
import { ZoomedElement } from './ZoomedElement';

export class ZoomedImageElement extends ZoomedElement {
    private _image: HTMLImageElement;

    constructor(element: Zoomable) {
        super(element);
        this._image = element as HTMLImageElement;
    }

    zoomedIn(): void {
        const image: HTMLImageElement = document.createElement('img');

        image.onload = (): any => {
            this.loaded(image.width, image.height);
            this._image.removeAttribute(FULL_SRC_KEY);
        };

        image.src = this._fullSrc;
    }

    disposed(): void {
        /* empty */
    }

    width(): number {
        return this._image.width;
    }
}
