import { createDiv } from '../Document';
import { centreBounds } from '../math/Bounds';
import { Vector } from '../math/Vector';
import { hasClass } from './ClassList';
import { repaint } from './Element';
import {
    centreTransformation,
    resetBounds,
    resetTransformation,
    setBoundsPx,
    transform
} from './Style';

export const CLASS: string = 'zoom__container';

export function createContainer(document: Document): HTMLDivElement {
    return createDiv(document, CLASS);
}

export function isContainer(element: HTMLElement): boolean {
    return hasClass(element, CLASS);
}

export function fixToCentre(container: HTMLElement, document: Document, target: Vector, size: Vector, position: Vector): void {
    resetTransformation(container.style);
    setBoundsPx(container.style, centreBounds(document, target, size, position));
}

export function transitionToCentre(container: HTMLElement, document: Document, target: Vector, size: Vector, position: Vector, use3d: boolean): void {
    transform(container.style, centreTransformation(document, target, size, position, use3d));
}

export function refreshContainer(container: HTMLElement, callback: Function): void {
    container.style.transition = 'initial';
    callback();
    repaint(container);
    container.style.transition = '';
}

export function restoreContainer(container: HTMLElement): void {
    resetTransformation(container.style);
    resetBounds(container.style);
}
