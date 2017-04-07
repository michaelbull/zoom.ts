import {
    addClass,
    hasClass,
    removeClass
} from './ClassList';
import {
    hasGrandParent,
    hasParent
} from './Element';

export const CLASS: string = 'zoom__element';
export const HIDDEN_CLASS: string = `${CLASS}--hidden`;
export const ACTIVE_CLASS: string = `${CLASS}--active`;

export function hideImage(image: HTMLImageElement): void {
    addClass(image, HIDDEN_CLASS);
}

export function showImage(image: HTMLImageElement): void {
    removeClass(image, HIDDEN_CLASS);
}

export function isImageHidden(image: HTMLImageElement): boolean {
    return hasClass(image, HIDDEN_CLASS);
}

export function activateImage(image: HTMLImageElement): void {
    addClass(image, ACTIVE_CLASS);
}

export function deactivateImage(image: HTMLImageElement): void {
    removeClass(image, ACTIVE_CLASS);
}

export function isImageActive(image: HTMLImageElement): boolean {
    return hasClass(image, ACTIVE_CLASS);
}

export function isZoomable(target: EventTarget): boolean {
    return target instanceof HTMLImageElement
        && hasParent(target)
        && hasGrandParent(target)
        && hasClass(target, CLASS);
}

export function fullSrc(wrapper: HTMLElement, image: HTMLImageElement): string {
    let fullSrc: string | null = wrapper.getAttribute('data-src');
    return fullSrc === null ? image.src : fullSrc;
}
