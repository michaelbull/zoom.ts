import { pixels } from '../math/Unit';
import { Vector2 } from '../math/Vector2';
import { Container } from './Container';
import {
    resetStyle,
    targetDimension
} from '../element/Element';
import { Image } from './Image';

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
        resetStyle(this.element, 'height');
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

    srcOf(image: HTMLImageElement): string {
        let fullSrc = this.element.getAttribute('data-src');

        if (fullSrc === null) {
            return image.src;
        } else {
            return fullSrc;
        }
    }

    position(): Vector2 {
        let rect = this.element.getBoundingClientRect();
        return Vector2.fromPosition(rect);
    }

    fixHeightTo(image: Image): void {
        this.element.style.height = pixels(image.height());
    }

    targetSize(): Vector2 {
        return Vector2.targetSizeOf(this.element);
    }
}
