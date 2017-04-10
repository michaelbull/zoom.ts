import { createDiv } from '../browser/Document';
import { hasClass } from './ClassList';

export const CLASS: string = 'zoom__container';

export function createContainer(): HTMLDivElement {
    return createDiv(CLASS);
}

export function isContainer(element: HTMLElement): boolean {
    return hasClass(element, CLASS);
}
