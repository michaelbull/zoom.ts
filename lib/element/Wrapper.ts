import {
    addClass,
    hasClass,
    removeClass
} from './ClassList';

export const CLASS: string = 'zoom';
export const EXPANDING_CLASS: string = `${CLASS}--expanding`;
export const EXPANDED_CLASS: string = `${CLASS}--expanded`;
export const COLLAPSING_CLASS: string = `${CLASS}--collapsing`;

export function isWrapper(element: HTMLElement): boolean {
    return hasClass(element, CLASS);
}

export function setWrapper(element: HTMLElement): void {
    addClass(element, CLASS);
}

export function isWrapperExpanding(wrapper: HTMLElement): boolean {
    return hasClass(wrapper, EXPANDING_CLASS);
}

export function startExpandingWrapper(wrapper: HTMLElement): void {
    addClass(wrapper, EXPANDING_CLASS);
}

export function stopExpandingWrapper(wrapper: HTMLElement): void {
    removeClass(wrapper, EXPANDING_CLASS);
}

export function isWrapperExpanded(wrapper: HTMLElement): boolean {
    return hasClass(wrapper, EXPANDED_CLASS);
}

export function setWrapperExpanded(wrapper: HTMLElement): void {
    addClass(wrapper, EXPANDED_CLASS);
}

export function unsetWrapperExpanded(wrapper: HTMLElement): void {
    removeClass(wrapper, EXPANDED_CLASS);
}

export function isWrapperCollapsing(wrapper: HTMLElement): boolean {
    return hasClass(wrapper, COLLAPSING_CLASS);
}

export function startCollapsingWrapper(wrapper: HTMLElement): void {
    addClass(wrapper, COLLAPSING_CLASS);
}

export function stopCollapsingWrapper(wrapper: HTMLElement): void {
    removeClass(wrapper, COLLAPSING_CLASS);
}

export function isWrapperTransitioning(wrapper: HTMLElement): boolean {
    return isWrapperExpanding(wrapper) || isWrapperCollapsing(wrapper);
}
