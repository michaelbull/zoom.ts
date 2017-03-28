import { createDiv } from '../Document';
import { hasClass } from './ClassList';
import { repaint } from './Element';

const CLASS: string = 'zoom__container';

export function createContainer(document: Document): HTMLDivElement {
    return createDiv(document, CLASS);
}

export function isContainer(element: HTMLElement): boolean {
    return hasClass(element, CLASS);
}

export function refreshContainer(container: HTMLElement, callback: Function): void {
    container.style.transition = 'initial';
    callback();
    repaint(container);
    container.style.transition = '';
}
