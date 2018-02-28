import { pageScrollY } from '../browser/Window';
import { Config } from '../Config';
import {
    addEventListener,
    fireEventListener,
    PotentialEventListener,
    removeEventListener
} from './EventListener';

export const ESCAPE_KEY_CODE = 27;

export function escKeyPressed(listener: EventListenerOrEventListenerObject): EventListenerObject {
    return {
        handleEvent(event: KeyboardEvent): void {
            if (event.keyCode === ESCAPE_KEY_CODE) {
                event.preventDefault();
                event.stopPropagation();
                fireEventListener(listener, event);
            }
        }
    };
}

export function scrolled(
    start: number,
    minAmount: number,
    current: () => number,
    listener: EventListenerOrEventListenerObject
): EventListener {
    return (event: Event): void => {
        if (Math.abs(start - current()) >= minAmount) {
            fireEventListener(listener, event);
        }
    };
}

export function addDismissListeners(
    config: Config,
    container: HTMLElement,
    collapse: EventListener
): () => void {

    let initialScrollY = pageScrollY();
    let scrollListener = scrolled(initialScrollY, config.scrollDismissPx, pageScrollY, collapse);

    let scrolledAway = addEventListener(window, 'scroll', scrollListener);
    let pressedEsc = addEventListener(document, 'keyup', escKeyPressed(collapse));
    let dismissed = addEventListener(container, 'click', collapse);

    return (): void => {
        removeEventListener(window, 'scroll', scrolledAway as EventListener);
        removeEventListener(document, 'keyup', pressedEsc as EventListener);
        removeEventListener(container, 'click', dismissed as EventListener);
    };
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
        callback();
    } else {
        listenForEvent(document, 'DOMContentLoaded', () => callback());
    }
}

export function listenForEvent(
    target: any,
    type: any,
    listener: EventListenerOrEventListenerObject,
    useCapture: boolean = false
): PotentialEventListener {

    let added = addEventListener(target, type, (event: Event) => {
        if (added !== undefined) {
            removeEventListener(target, type, added);
        }

        fireEventListener(listener, event);
    }, useCapture);

    return added;
}
