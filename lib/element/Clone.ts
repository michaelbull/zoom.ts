import {
    addEventListener,
    removeEventListener
} from '../event/Events';
import {
    addClass,
    hasClass,
    removeClass
} from './ClassList';

export function createClone(document: Document, src: string): HTMLImageElement {
    let clone: HTMLImageElement = document.createElement('img');
    clone.className = 'zoom__clone';
    clone.src = src;

    let loaded: EventListener = (): void => {
        removeEventListener(clone, 'load', loaded);
        setCloneLoaded(clone);
    };

    addEventListener(clone, 'load', loaded);
    return clone;
}

export function setCloneVisible(clone: HTMLImageElement): void {
    addClass(clone, 'zoom__clone--visible');
}

export function unsetCloneVisible(clone: HTMLImageElement): void {
    removeClass(clone, 'zoom__clone--visible');
}

export function isCloneVisible(clone: HTMLImageElement): boolean {
    return hasClass(clone, 'zoom__clone--visible');
}

export function setCloneLoaded(clone: HTMLImageElement): void {
    addClass(clone, 'zoom__clone--loaded');
}

export function isCloneLoaded(clone: HTMLImageElement): boolean {
    return hasClass(clone, 'zoom__clone--loaded');
}
