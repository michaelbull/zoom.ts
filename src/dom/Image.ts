export class Image {
    static readonly CLASS = 'zoom__image';
    static readonly HIDDEN_CLASS = 'zoom__image--hidden';
    static readonly ACTIVE_CLASS = 'zoom__image--active';

    readonly element: HTMLImageElement;

    constructor(element: HTMLImageElement) {
        this.element = element;
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

    clearFixedSizes(): void {
        this.element.removeAttribute('width');
        this.element.removeAttribute('height');
    }
}
