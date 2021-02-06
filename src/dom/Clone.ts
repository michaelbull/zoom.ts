import { CloneConfig } from '../config';
import { AddClassListener } from '../event';

export class Clone {
    static create(config: CloneConfig, src: string): Clone {
        let element = document.createElement('img');
        element.className = config.classNames.base;
        element.src = src;
        element.addEventListener('load', new AddClassListener(element, 'load', config.classNames.loaded));
        return new Clone(element, config);
    }

    readonly element: HTMLImageElement;
    private readonly config: CloneConfig;

    constructor(element: HTMLImageElement, config: CloneConfig) {
        this.element = element;
        this.config = config;
    }

    show(): void {
        this.element.classList.add(this.config.classNames.visible);
    }

    hide(): void {
        this.element.classList.remove(this.config.classNames.visible);
    }

    isVisible(): boolean {
        return this.element.classList.contains(this.config.classNames.visible);
    }

    isHidden(): boolean {
        return !this.isVisible();
    }

    loaded(): void {
        this.element.classList.add(this.config.classNames.loaded);
    }

    isLoaded(): boolean {
        return this.element.classList.contains(this.config.classNames.loaded);
    }

    isLoading(): boolean {
        return !this.isLoaded();
    }
}
