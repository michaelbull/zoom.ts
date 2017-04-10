import { clientSize } from '../element/Element';
import { listenForEvent } from '../event/EventListener';
import { Vector } from '../math/Vector';

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
export function ready(document: Document, callback: Function): void {
    if (document.readyState === 'complete') {
        callback();
    } else {
        listenForEvent(document, 'DOMContentLoaded', () => callback());
    }
}

export function viewportSize(document: Document): Vector {
    return clientSize(rootElement(document));
}

export function createDiv(className: string): HTMLDivElement {
    let overlay: HTMLDivElement = document.createElement('div');
    overlay.className = className;
    return overlay;
}
