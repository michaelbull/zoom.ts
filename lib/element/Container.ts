import { createDiv } from '../Document';
import { hasClass } from './ClassList';
import { repaint } from './Element';

export function createContainer(document: Document): HTMLDivElement {
    return createDiv(document, 'zoom__container');
}

export function isContainer(element: HTMLElement): boolean {
    return hasClass(element, 'zoom__container');
}

export function refreshContainer(container: HTMLElement, callback: Function): void {
    container.style.transition = 'initial';
    callback();
    repaint(container);
    container.style.transition = '';
}
