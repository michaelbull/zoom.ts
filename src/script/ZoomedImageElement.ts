import { FULL_SRC_KEY } from './Attributes';
import { ZoomedElement } from './ZoomedElement';

export class ZoomedImageElement extends ZoomedElement {
    zoomedIn(): void {
        const image: HTMLImageElement = document.createElement('img');

        image.onload = (): any => {
            this.loaded(image.width, image.height);
            this._element.removeAttribute(FULL_SRC_KEY);
        };

        image.src = this._fullSrc;
    }

    disposed(): void {
        /* empty */
    }

    width(): number {
        return this._element.width;
    }
}
