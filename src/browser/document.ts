import { Vector2 } from '../math';

export const QUIRKS_MODE = 'BackCompat';
export const STANDARDS_MODE = 'CSS1Compat';

export function isStandardsMode(doc: Document = document): boolean {
    return doc.compatMode === STANDARDS_MODE;
}

export function rootElement(doc: Document = document): HTMLElement {
    return isStandardsMode(doc) ? doc.documentElement : doc.body;
}

export function viewportSize(doc: Document = document): Vector2 {
    return Vector2.fromClientSize(rootElement(doc));
}

/**
 * Executes a callback function when a document has finished loading, or immediately if the document has already
 * finished loading.
 * @param callback The function to execute.
 * @param doc The document.
 * @see http://youmightnotneedjquery.com/#ready
 */
export function ready(callback: () => void, doc: Document = document): void {
    if (doc.readyState === 'loading') {
        let listener = (): void => {
            doc.removeEventListener('DOMContentLoaded', listener);
            callback.call(doc);
        };

        doc.addEventListener('DOMContentLoaded', listener);
    } else {
        callback.call(doc);
    }
}
