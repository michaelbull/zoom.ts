import {
    addClass,
    hasClass,
    removeClass
} from './Element';

export function setImageHidden(image: HTMLImageElement): void {
    addClass(image, 'zoom__element--hidden');
}

export function unsetImageHidden(image: HTMLImageElement): void {
    removeClass(image, 'zoom__element--hidden');
}

export function isImageHidden(image: HTMLImageElement): boolean {
    return hasClass(image, 'zoom__element--hidden');
}

export function setImageActive(image: HTMLImageElement): void {
    addClass(image, 'zoom__element--active');
}

export function unsetImageActive(image: HTMLImageElement): void {
    removeClass(image, 'zoom__element--active');
}

export function isImageActive(image: HTMLImageElement): boolean {
    return hasClass(image, 'zoom__element--active');
}

export function isZoomable(target: EventTarget): boolean {
    return target instanceof HTMLImageElement && hasClass(target, 'zoom__element');
}
