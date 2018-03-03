import {
    parsePadding,
    resetStyle
} from '../element/elements';
import { Vector2 } from '../math/vector2';

export class Wrapper {
    static readonly CLASS = 'zoom';
    static readonly EXPANDING_CLASS = 'zoom--expanding';
    static readonly EXPANDED_CLASS = 'zoom--expanded';
    static readonly COLLAPSING_CLASS = 'zoom--collapsing';

    readonly element: HTMLElement;

    constructor(element: HTMLElement) {
        this.element = element;
    }

    startExpanding(): void {
        this.element.classList.add(Wrapper.EXPANDING_CLASS);
    }

    isExpanding(): boolean {
        return this.element.classList.contains(Wrapper.EXPANDING_CLASS);
    }

    finishExpanding(): void {
        this.element.classList.remove(Wrapper.EXPANDING_CLASS);
    }

    startCollapsing() {
        this.element.classList.add(Wrapper.COLLAPSING_CLASS);
    }

    isCollapsing(): boolean {
        return this.element.classList.contains(Wrapper.COLLAPSING_CLASS);
    }

    finishCollapsing(): void {
        this.element.classList.remove(Wrapper.COLLAPSING_CLASS);
        resetStyle(this.element.style, 'height');
    }

    isTransitioning(): boolean {
        return this.isExpanding() || this.isCollapsing();
    }

    collapsed(): void {
        this.element.classList.remove(Wrapper.EXPANDED_CLASS);
    }

    expanded(): void {
        this.element.classList.add(Wrapper.EXPANDED_CLASS);
    }

    isExpanded(): boolean {
        return this.element.classList.contains(Wrapper.EXPANDED_CLASS);
    }

    srcOf(element: HTMLImageElement): string {
        let fullSrc = this.element.getAttribute('data-src');

        if (fullSrc === null) {
            return element.src;
        } else {
            return fullSrc;
        }
    }

    position(): Vector2 {
        let rect = this.element.getBoundingClientRect();
        let style = getComputedStyle(this.element);

        // if the wrapper has an explicit padding in the normal page flow,
        // we must disregard it when calculating the wrapper's true position
        let paddingTop = parsePadding(style, 'top');
        let paddingLeft = parsePadding(style, 'left');

        return new Vector2(rect.left + paddingLeft, rect.top + paddingTop);
    }

    targetSize(): Vector2 {
        return Vector2.targetSizeOf(this.element);
    }
}
