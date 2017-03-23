import { addEventListener } from './Events';

export const QUIRKS_MODE: string = 'BackCompat';
export const STANDARDS_MODE: string = 'CSS1Compat';

export function isStandardsMode(document: Document): boolean {
    return document.compatMode === STANDARDS_MODE;
}

export function rootElement(document: Document): HTMLElement {
    return isStandardsMode(document) ? document.documentElement : document.body;
}

/**
 * Executes a callback function when a document has finished loading, or immediately if the document has already
 * finished loading.
 * @param document The document.
 * @param callback The function to execute.
 * @see http://youmightnotneedjquery.com/#ready
 */
export function ready(document: Document, callback: Function): any {
    let state: string = document.readyState;

    if (state === 'interactive' || state === 'complete') {
        return callback();
    } else {
        addEventListener(document, 'DOMContentLoaded', () => callback());
    }
}

/**
 * Calculates the number of pixels in the document have been scrolled past vertically.
 * @returns {number} The number of pixels in the document have been scrolled past vertically.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollY#Notes
 */
export function pageScrollY(window: Window, document: Document): number {
    if (window.pageYOffset === undefined) { // <IE9
        return rootElement(document).scrollTop;
    } else {
        return window.pageYOffset;
    }
}

export function createDiv(document: Document, className: string): HTMLDivElement {
    let overlay: HTMLDivElement = document.createElement('div');
    overlay.className = className;
    return overlay;
}

export function createClone(document: Document, src: string): HTMLImageElement {
    let clone: HTMLImageElement = document.createElement('img');
    clone.className = 'zoom__clone';
    clone.src = src;
    return clone;
}
