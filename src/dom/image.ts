import {
    Bounds,
    Vector2
} from '../math';

export class Image {
    static readonly CLASS = 'zoom__image';
    static readonly HIDDEN_CLASS = 'zoom__image--hidden';
    static readonly ACTIVE_CLASS = 'zoom__image--active';

    readonly element: HTMLImageElement;

    constructor(element: HTMLImageElement) {
        this.element = element;
    }

    bounds(): Bounds {
        return Bounds.of(this.element);
    }

    hide(): void {
        this.element.classList.add(Image.HIDDEN_CLASS);
    }

    show(): void {
        this.element.classList.remove(Image.HIDDEN_CLASS);
    }

    isHidden(): boolean {
        return this.element.classList.contains(Image.HIDDEN_CLASS);
    }

    activate(): void {
        this.element.classList.add(Image.ACTIVE_CLASS);
    }

    deactivate(): void {
        this.element.classList.remove(Image.ACTIVE_CLASS);
    }

    targetSize(): Vector2 {
        return Vector2.fromTargetSize(this.element);
    }

    clearFixedSizes(): void {
        this.element.removeAttribute('width');
        this.element.removeAttribute('height');
    }
}
