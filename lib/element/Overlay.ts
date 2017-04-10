import { createDiv } from '../window/Document';
import {
    addClass,
    hasClass,
    removeClass
} from './ClassList';
import { repaint } from './Element';

export const CLASS: string = 'zoom__overlay';
export const VISIBLE_CLASS: string = `${CLASS}--visible`;

export function addOverlay(): HTMLDivElement {
    let overlay: HTMLDivElement = createDiv(CLASS);
    document.body.appendChild(overlay);
    repaint(overlay);
    addClass(overlay, VISIBLE_CLASS);
    return overlay;
}

export function hideOverlay(overlay: HTMLDivElement): void {
    removeClass(overlay, VISIBLE_CLASS);
}

export function isOverlayVisible(overlay: HTMLDivElement): boolean {
    return hasClass(overlay, VISIBLE_CLASS);
}
