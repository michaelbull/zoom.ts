import { listenForEvent } from '../event/EventListener';
import {
    addClass,
    hasClass,
    removeClass
} from './ClassList';

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
