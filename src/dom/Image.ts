import { ImageConfig } from '../config';
import { Vector2 } from '../math';
import { fullSrc } from './element';
import { targetSize } from './element/targetSize';

export class Image {
    readonly element: HTMLImageElement;
    private readonly config: ImageConfig;

    constructor(element: HTMLImageElement, config: ImageConfig) {
        this.element = element;
        this.config = config;
    }

    hide(): void {
        this.element.classList.add(this.config.classNames.hidden);
    }

    show(): void {
        this.element.classList.remove(this.config.classNames.hidden);
    }

    isHidden(): boolean {
        return this.element.classList.contains(this.config.classNames.hidden);
    }

    activate(): void {
        this.element.classList.add(this.config.classNames.active);
    }

    deactivate(): void {
        this.element.classList.remove(this.config.classNames.active);
    }

    clearFixedSizes(): void {
        this.element.removeAttribute('width');
        this.element.removeAttribute('height');
    }

    targetSize(): Vector2 {
        let attributeNames = this.config.attributeNames;
        return targetSize(this.element, attributeNames.width, attributeNames.height);
    }

    fullSrc(): string {
        return fullSrc(this.element, this.config.attributeNames.src);
    }
}
