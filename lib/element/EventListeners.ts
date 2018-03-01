import { pageScrollY } from '../browser/Window';
import { Config } from '../Config';

export const ESCAPE_KEY_CODE = 27;

export function escKeyPressed(
    target: any,
    listener: EventListenerOrEventListenerObject
): EventListenerObject {
    return {
        handleEvent(event: KeyboardEvent): void {
            if (event.keyCode === ESCAPE_KEY_CODE) {
                event.preventDefault();
                event.stopPropagation();
                fireEventListener(target, listener, event);
            }
        }
    };
}

export function scrolled(
    target: any,
    start: number,
    minAmount: number,
    current: () => number,
    listener: EventListenerOrEventListenerObject
): EventListener {
    return (event: Event): void => {
        if (Math.abs(start - current()) >= minAmount) {
            fireEventListener(target, listener, event);
        }
    };
}

/**
 * Executes a callback function when a document has finished loading, or immediately if the document has already
 * finished loading.
 * @param document The document.
 * @param listener The function to execute.
 * @see http://youmightnotneedjquery.com/#ready
 */
export function ready(document: Document, listener: EventListenerOrEventListenerObject): void {
    if (document.readyState === 'complete') {
        fireEventListener(document, listener, undefined);
    } else {
        document.addEventListener('DOMContentLoaded', listener);
    }
}

export function fireEventListener(
    target: any,
    listener: EventListenerOrEventListenerObject,
    event: Event | undefined
): void {
    if (typeof listener === 'function') {
        listener.call(target, event);
    } else {
        listener.handleEvent(event as Event);
    }
}
