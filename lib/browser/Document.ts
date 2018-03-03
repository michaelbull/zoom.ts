import { Vector2 } from '../math/Vector2';

export const QUIRKS_MODE = 'BackCompat';
export const STANDARDS_MODE = 'CSS1Compat';

export function isStandardsMode(document: Document): boolean {
    return document.compatMode === STANDARDS_MODE;
}

export function rootElement(document: Document): HTMLElement {
    return isStandardsMode(document) ? document.documentElement : document.body;
}

export function viewportSize(document: Document): Vector2 {
    return Vector2.clientSizeOf(rootElement(document));
}

/**
 * Executes a callback function when a document has finished loading, or immediately if the document has already
 * finished loading.
 * @param document The document.
 * @param callback The function to execute.
 * @see http://youmightnotneedjquery.com/#ready
 */
export function ready(document: Document, callback: () => void): void {
    if (document.readyState === 'complete') {
        callback.call(document);
    } else {
        let listener = (): void => {
            document.removeEventListener('DOMContentLoaded', listener);
            callback.call(document);
        };

        document.addEventListener('DOMContentLoaded', listener);
    }
}
