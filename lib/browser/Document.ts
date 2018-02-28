import { clientSize } from '../element/Element';
import { Vector } from '../math/Vector';

export const QUIRKS_MODE = 'BackCompat';
export const STANDARDS_MODE = 'CSS1Compat';

export function isStandardsMode(document: Document): boolean {
    return document.compatMode === STANDARDS_MODE;
}

export function rootElement(document: Document): HTMLElement {
    return isStandardsMode(document) ? document.documentElement : document.body;
}

export function viewportSize(document: Document): Vector {
    return clientSize(rootElement(document));
}

export function createDiv(className: string): HTMLDivElement {
    let overlay = document.createElement('div');
    overlay.className = className;
    return overlay;
}
