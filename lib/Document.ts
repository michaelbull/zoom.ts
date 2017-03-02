import { addEventListener } from './Events';

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
 * Calculates the width (in pixels) of the browser window viewport.
 * @returns {number} The width (in pixels) of the browser window viewport.
 * @see https://stackoverflow.com/questions/9410088/how-do-i-get-innerwidth-in-internet-explorer-8/9410162#9410162
 */
export function viewportWidth(document: Document): number {
    return (document.documentElement || document.body).clientWidth;
}

/**
 * Calculates the height (in pixels) of the browser window viewport.
 * @returns {number} The height (in pixels) of the browser window viewport.
 * @see https://stackoverflow.com/questions/9410088/how-do-i-get-innerwidth-in-internet-explorer-8/9410162#9410162
 */
export function viewportHeight(document: Document): number {
    return (document.documentElement || document.body).clientHeight;
}

/**
 * Calculates the number of pixels in the document have been scrolled past vertically.
 * @returns {number} The number of pixels in the document have been scrolled past vertically.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollY#Notes
 */
export function pageScrollY(window: Window, document: Document): number {
    if (window.pageYOffset === undefined) { // <IE9
        return (document.documentElement || document.body).scrollTop;
    } else {
        return window.pageYOffset;
    }
}

export function createDiv(className: string): HTMLDivElement {
    let overlay: HTMLDivElement = document.createElement('div');
    overlay.className = className;
    return overlay;
}

export function createClone(src: string): HTMLImageElement {
    let clone: HTMLImageElement = document.createElement('img');
    clone.className = 'zoom__clone';
    clone.src = src;
    return clone;
}
