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
    let fullSrc: string | null = wrapper.getAttribute('data-src');
    return fullSrc === null ? image.src : fullSrc;
}
