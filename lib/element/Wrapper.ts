import {
    addClass,
    hasClass,
    removeClass
} from './ClassList';
import {
    setHeightPx,
    unsetHeight
} from './Style';

export const CLASS: string = 'zoom';
export const EXPANDING_CLASS: string = `${CLASS}--expanding`;
export const EXPANDED_CLASS: string = `${CLASS}--expanded`;
export const COLLAPSING_CLASS: string = `${CLASS}--collapsing`;

export function resolveSrc(wrapper: HTMLElement, image: HTMLImageElement): string {
    let attribute: string | null = wrapper.getAttribute('data-src');

    if (attribute !== null) {
        return attribute;
    }

    return image.src as string;
}

export function isWrapperExpanding(wrapper: HTMLElement): boolean {
    return hasClass(wrapper, EXPANDING_CLASS);
}

export function isWrapperExpanded(wrapper: HTMLElement): boolean {
    return hasClass(wrapper, EXPANDED_CLASS);
}

export function isWrapperCollapsing(wrapper: HTMLElement): boolean {
    return hasClass(wrapper, COLLAPSING_CLASS);
}

export function isWrapperTransitioning(wrapper: HTMLElement): boolean {
    return isWrapperExpanding(wrapper) || isWrapperCollapsing(wrapper);
}

export function expandWrapper(wrapper: HTMLElement, toHeight: number): void {
    addClass(wrapper, EXPANDING_CLASS);
    setHeightPx(wrapper.style, toHeight);
}

export function stopExpandingWrapper(wrapper: HTMLElement): void {
    removeClass(wrapper, EXPANDING_CLASS);
}

export function finishExpandingWrapper(wrapper: HTMLElement): void {
    stopExpandingWrapper(wrapper);
    addClass(wrapper, EXPANDED_CLASS);
}

export function collapseWrapper(wrapper: HTMLElement): void {
    removeClass(wrapper, EXPANDED_CLASS);
    addClass(wrapper, COLLAPSING_CLASS);
}

export function finishCollapsingWrapper(wrapper: HTMLElement): void {
    removeClass(wrapper, COLLAPSING_CLASS);
    unsetHeight(wrapper.style);
}
