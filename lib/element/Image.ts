import {
    addClass,
    hasClass,
    removeClass
} from './ClassList';

const CLASS: string = 'zoom__element';
const HIDDEN_CLASS: string = `${CLASS}--hidden`;
const ACTIVE_CLASS: string = `${CLASS}--active`;

export function setImageHidden(image: HTMLImageElement): void {
    addClass(image, HIDDEN_CLASS);
}

export function unsetImageHidden(image: HTMLImageElement): void {
    removeClass(image, HIDDEN_CLASS);
}

export function isImageHidden(image: HTMLImageElement): boolean {
    return hasClass(image, HIDDEN_CLASS);
}

export function setImageActive(image: HTMLImageElement): void {
    addClass(image, ACTIVE_CLASS);
}

export function unsetImageActive(image: HTMLImageElement): void {
    removeClass(image, ACTIVE_CLASS);
}

export function isImageActive(image: HTMLImageElement): boolean {
    return hasClass(image, ACTIVE_CLASS);
}

export function isZoomable(target: EventTarget): boolean {
    return target instanceof HTMLImageElement && hasClass(target, CLASS);
}
