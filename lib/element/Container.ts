import { createDiv } from '../window/Document';
import { hasClass } from './ClassList';

export const CLASS: string = 'zoom__container';

export function createContainer(document: Document): HTMLDivElement {
    return createDiv(document, CLASS);
}

export function isContainer(element: HTMLElement): boolean {
    return hasClass(element, CLASS);
}
