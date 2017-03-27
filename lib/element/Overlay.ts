import { createDiv } from '../Document';
import {
    addClass,
    hasClass,
    removeClass,
    repaint
} from './Element';

export function createOverlay(document: Document): HTMLDivElement {
    let overlay: HTMLDivElement = createDiv(document, 'zoom__overlay');
    document.body.appendChild(overlay);
    repaint(overlay);
    addClass(overlay, 'zoom__overlay--visible');
    return overlay;
}

export function hideOverlay(overlay: HTMLDivElement): void {
    removeClass(overlay, 'zoom__overlay--visible');
}

export function isOverlayVisible(overlay: HTMLDivElement): boolean {
    return hasClass(overlay, 'zoom__overlay--visible');
}
