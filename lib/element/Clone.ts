import {
    addEventListener,
    removeEventListener
} from '../event/Events';
import {
    addClass,
    hasClass,
    removeClass
} from './ClassList';

export const CLASS: string = 'zoom__clone';
export const VISIBLE_CLASS: string = `${CLASS}--visible`;
export const LOADED_CLASS: string = `${CLASS}--loaded`;

export function createClone(document: Document, src: string): HTMLImageElement {
    let clone: HTMLImageElement = document.createElement('img');
    clone.className = CLASS;
    clone.src = src;

    let loaded: EventListener = (): void => {
        removeEventListener(clone, 'load', loaded);
        setCloneLoaded(clone);
    };

    addEventListener(clone, 'load', loaded);
    return clone;
}

export function setCloneVisible(clone: HTMLImageElement): void {
    addClass(clone, VISIBLE_CLASS);
}

export function unsetCloneVisible(clone: HTMLImageElement): void {
    removeClass(clone, VISIBLE_CLASS);
}

export function isCloneVisible(clone: HTMLImageElement): boolean {
    return hasClass(clone, VISIBLE_CLASS);
}

export function setCloneLoaded(clone: HTMLImageElement): void {
    addClass(clone, LOADED_CLASS);
}

export function isCloneLoaded(clone: HTMLImageElement): boolean {
    return hasClass(clone, LOADED_CLASS);
}
