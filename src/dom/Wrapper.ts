import { WrapperConfig } from '../config';
import { Vector2 } from '../math';
import {
    parsePadding,
    resetStyle
} from '../style';
import { Container } from './Container';
import { Image } from './Image';

export class Wrapper {
    static create(config: WrapperConfig): Wrapper {
        let element = document.createElement('div');
        element.className = config.classNames.base;
        return new Wrapper(element, config);
    }

    private readonly element: HTMLElement;
    private readonly config: WrapperConfig;

    constructor(element: HTMLElement, config: WrapperConfig) {
        this.element = element;
        this.config = config;
    }

    appendContainer(container: Container): void {
        container.appendTo(this.element);
    }

    replaceImage(image: Image): void {
        image.replaceWith(this.element);
    }

    startExpanding(): void {
        this.element.classList.add(this.config.classNames.expanding);
    }

    finishExpanding(): void {
        this.element.classList.remove(this.config.classNames.expanding);
    }

    isExpanding(): boolean {
        return this.element.classList.contains(this.config.classNames.expanding);
    }

    startCollapsing() {
        this.element.classList.add(this.config.classNames.collapsing);
    }

    finishCollapsing(): void {
        this.element.classList.remove(this.config.classNames.collapsing);
        resetStyle(this.element.style, 'height');
    }

    isCollapsing(): boolean {
        return this.element.classList.contains(this.config.classNames.collapsing);
    }

    isTransitioning(): boolean {
        return this.isExpanding() || this.isCollapsing();
    }

    expanded(): void {
        this.element.classList.add(this.config.classNames.expanded);
    }

    collapse(): void {
        this.element.classList.remove(this.config.classNames.expanded);
    }

    isExpanded(): boolean {
        return this.element.classList.contains(this.config.classNames.expanded);
    }

    position(): Vector2 {
        let rect = this.element.getBoundingClientRect();
        let style = window.getComputedStyle(this.element);

        // if the wrapper has an explicit padding in the normal page flow,
        // we must disregard it when calculating the wrapper's true position
        let paddingTop = parsePadding(style, 'top');
        let paddingLeft = parsePadding(style, 'left');

        return {
            x: rect.left + paddingLeft,
            y: rect.top + paddingTop
        };
    }

    set height(value: string) {
        this.element.style.height = value;
    }
}
