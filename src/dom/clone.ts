export class Clone {
    static readonly CLASS = 'zoom__clone';
    static readonly VISIBLE_CLASS = 'zoom__clone--visible';
    static readonly LOADED_CLASS = 'zoom__clone--loaded';

    static create(src: string): Clone {
        let element = document.createElement('img');
        element.className = Clone.CLASS;
        element.src = src;
        element.addEventListener('load', () => element.classList.add(Clone.LOADED_CLASS));
        return new Clone(element);
    }

    readonly element: HTMLImageElement;

    constructor(element: HTMLImageElement) {
        this.element = element;
    }

    show(): void {
        this.element.classList.add(Clone.VISIBLE_CLASS);
    }

    isVisible(): boolean {
        return this.element.classList.contains(Clone.VISIBLE_CLASS);
    }

    hide(): void {
        this.element.classList.remove(Clone.VISIBLE_CLASS);
    }

    isHidden(): boolean {
        return !this.isVisible();
    }

    loaded(): void {
        this.element.classList.add(Clone.LOADED_CLASS);
    }

    isLoading(): boolean {
        return !this.isLoaded();
    }

    isLoaded(): boolean {
        return this.element.classList.contains(Clone.LOADED_CLASS);
    }
}
