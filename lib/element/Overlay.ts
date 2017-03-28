import { createDiv } from '../Document';
import {
    addClass,
    hasClass,
    removeClass
} from './ClassList';
import { repaint } from './Element';

export const CLASS: string = 'zoom__overlay';
export const VISIBLE_CLASS: string = `${CLASS}--visible`;

export function createOverlay(document: Document): HTMLDivElement {
    return createDiv(document, CLASS);
}

export function showOverlay(overlay: HTMLDivElement): void {
    repaint(overlay);
    addClass(overlay, VISIBLE_CLASS);
}

export function hideOverlay(overlay: HTMLDivElement): void {
    removeClass(overlay, VISIBLE_CLASS);
}

export function isOverlayVisible(overlay: HTMLDivElement): boolean {
    return hasClass(overlay, VISIBLE_CLASS);
}
