import {
    addClass,
    hasClass,
    removeClass
} from './Element';

export function resolveSrc(wrapper: HTMLElement, image: HTMLImageElement): string {
    let attribute: string | null = wrapper.getAttribute('data-src');

    if (attribute !== null) {
        return attribute;
    }

    return image.src as string;
}

export function setWrapperExpanded(wrapper: HTMLElement): void {
    addClass(wrapper, 'zoom--expanded');
}

export function unsetWrapperExpanded(wrapper: HTMLElement): void {
    removeClass(wrapper, 'zoom--expanded');
}

export function isWrapperExpanded(wrapper: HTMLElement): boolean {
    return hasClass(wrapper, 'zoom--expanded');
}

export function setWrapperExpanding(wrapper: HTMLElement): void {
    addClass(wrapper, 'zoom--expanding');
}

export function unsetWrapperExpanding(wrapper: HTMLElement): void {
    removeClass(wrapper, 'zoom--expanding');
}

export function isWrapperExpanding(wrapper: HTMLElement): boolean {
    return hasClass(wrapper, 'zoom--expanding');
}

export function setWrapperCollapsing(wrapper: HTMLElement): void {
    addClass(wrapper, 'zoom--collapsing');
}

export function unsetWrapperCollapsing(wrapper: HTMLElement): void {
    removeClass(wrapper, 'zoom--collapsing');
}

export function isWrapperCollapsing(wrapper: HTMLElement): boolean {
    return hasClass(wrapper, 'zoom--collapsing');
}

export function isWrapperTransitioning(wrapper: HTMLElement): boolean {
    return isWrapperExpanding(wrapper) || isWrapperCollapsing(wrapper);
}
