import { Vector2 } from '../math';
import {
    parsePadding,
    resetStyle
} from '../style';

export class Wrapper {
    static readonly CLASS = 'zoom';
    static readonly EXPANDING_CLASS = 'zoom--expanding';
    static readonly EXPANDED_CLASS = 'zoom--expanded';
    static readonly COLLAPSING_CLASS = 'zoom--collapsing';

    static create(): Wrapper {
        let element = document.createElement('div');
        element.className = Wrapper.CLASS;
        return new Wrapper(element);
    }

    readonly element: HTMLElement;

    constructor(element: HTMLElement) {
        this.element = element;
    }

    startExpanding(): void {
        this.element.classList.add(Wrapper.EXPANDING_CLASS);
    }

    finishExpanding(): void {
        this.element.classList.remove(Wrapper.EXPANDING_CLASS);
    }

    isExpanding(): boolean {
        return this.element.classList.contains(Wrapper.EXPANDING_CLASS);
    }

    startCollapsing() {
        this.element.classList.add(Wrapper.COLLAPSING_CLASS);
    }

    finishCollapsing(): void {
        this.element.classList.remove(Wrapper.COLLAPSING_CLASS);
        resetStyle(this.element.style, 'height');
    }

    isCollapsing(): boolean {
        return this.element.classList.contains(Wrapper.COLLAPSING_CLASS);
    }

    isTransitioning(): boolean {
        return this.isExpanding() || this.isCollapsing();
    }

    expanded(): void {
        this.element.classList.add(Wrapper.EXPANDED_CLASS);
    }

    collapse(): void {
        this.element.classList.remove(Wrapper.EXPANDED_CLASS);
    }

    isExpanded(): boolean {
        return this.element.classList.contains(Wrapper.EXPANDED_CLASS);
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
}
