import { rootElement } from './Document';

/**
 * Calculates the number of pixels in the document have been scrolled past vertically.
 * @returns {number} The number of pixels in the document have been scrolled past vertically.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollY#Notes
 */
export function pageScrollY(window: Window): number {
    if (window.pageYOffset === undefined) { // <IE9
        return rootElement(window.document).scrollTop;
    } else {
        return window.pageYOffset;
    }
}
