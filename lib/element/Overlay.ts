import { createDiv } from '../browser/Document';
import {
    addClass,
    hasClass,
    removeClass
} from './ClassList';
import { repaint } from './Element';

export const CLASS: string = 'zoom__overlay';
export const VISIBLE_CLASS: string = `${CLASS}--visible`;

export function createOverlay(): HTMLDivElement {
    return createDiv(CLASS);
}

export function addOverlay(overlay: HTMLDivElement): void {
    document.body.appendChild(overlay);
    repaint(overlay);
    addClass(overlay, VISIBLE_CLASS);
}

export function hideOverlay(overlay: HTMLDivElement): void {
    removeClass(overlay, VISIBLE_CLASS);
}

export function isOverlayVisible(overlay: HTMLDivElement): boolean {
    return hasClass(overlay, VISIBLE_CLASS);
}
