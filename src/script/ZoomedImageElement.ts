import { FULL_SRC_KEY } from './Attributes';
import { ZoomedElement } from './ZoomedElement';

export class ZoomedImageElement extends ZoomedElement {
    zoomedIn(src: string): void {
        const image: HTMLImageElement = document.createElement('img');

        image.onload = (): any => {
            this.zoomOriginal(image.width, image.height);
            this._element.removeAttribute(FULL_SRC_KEY);
        };

        image.src = src;
    }

    disposed(): void {
        /* empty */
    }

    width(): number {
        return this._element.width;
    }
}
