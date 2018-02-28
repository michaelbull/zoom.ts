import { Config } from '../Config';
import { hasClass } from './ClassList';
import {
    hasGrandParent,
    hasParent
} from './Element';

export function isZoomable(config: Config, target: EventTarget): boolean {
    return target instanceof HTMLImageElement
        && hasParent(target)
        && hasGrandParent(target)
        && hasClass(target, config.imageClass);
}

export function fullSrc(wrapper: HTMLElement, image: HTMLImageElement): string {
    let fullSrc = wrapper.getAttribute('data-src');

    if (fullSrc === null) {
        return image.src;
    } else {
        return fullSrc;
    }
}
