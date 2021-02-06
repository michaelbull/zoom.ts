import { ImageConfig } from '../config';
import {
    Bounds,
    pixels,
    Vector2
} from '../math';
import {
    boundsOf,
    fullSrc
} from './element';
import { targetSize } from './element/targetSize';

export class Image {
    private readonly element: HTMLImageElement;
    private readonly config: ImageConfig;

    constructor(element: HTMLImageElement, config: ImageConfig) {
        this.element = element;
        this.config = config;
    }

    appendTo<T extends Node>(parent: T): void {
        parent.appendChild(this.element);
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

    height(): string {
        return pixels(this.element.height);
    }

    replaceWith(node: Node): void {
        let parent = this.element.parentElement as HTMLElement;
        parent.replaceChild(node, this.element);
    }

    bounds(): Bounds {
        return boundsOf(this.element);
    }
}
