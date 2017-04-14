import { listenForEvent } from '../event/EventListeners';
import {
    addClass,
    hasClass,
    removeClass
} from './ClassList';
import {
    hideImage,
    showImage
} from './Image';
import { isWrapperExpanded } from './Wrapper';
import { ZoomElements } from './ZoomElements';

export const CLASS: string = 'zoom__clone';
export const VISIBLE_CLASS: string = `${CLASS}--visible`;
export const LOADED_CLASS: string = `${CLASS}--loaded`;

export function createClone(src: string): HTMLImageElement {
    let clone: HTMLImageElement = document.createElement('img');
    clone.className = CLASS;
    clone.src = src;
    listenForEvent(clone, 'load', () => addClass(clone, LOADED_CLASS));
    return clone;
}

export function showCloneOnceLoaded(elements: ZoomElements): EventListener {
    return (): void => {
        if (elements.clone !== undefined && isWrapperExpanded(elements.wrapper) && !isCloneVisible(elements.clone)) {
            replaceImageWithClone(elements.image, elements.clone);
        }
    };
}

export function showClone(clone: HTMLImageElement): void {
    addClass(clone, VISIBLE_CLASS);
}

export function hideClone(clone: HTMLImageElement): void {
    removeClass(clone, VISIBLE_CLASS);
}

export function isCloneVisible(clone: HTMLImageElement): boolean {
    return hasClass(clone, VISIBLE_CLASS);
}

export function isCloneLoaded(clone: HTMLImageElement): boolean {
    return hasClass(clone, LOADED_CLASS);
}

export function replaceImageWithClone(image: HTMLImageElement, clone: HTMLImageElement): void {
    showClone(clone);
    hideImage(image);
}

export function replaceCloneWithImage(image: HTMLImageElement, clone: HTMLImageElement): void {
    showImage(image);
    hideClone(clone);
}
