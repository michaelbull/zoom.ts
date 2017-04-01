import {
    addClass,
    hasClass,
    removeClass
} from './ClassList';

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
    return target instanceof HTMLImageElement && target.parentElement !== null && hasClass(target, CLASS);
}
