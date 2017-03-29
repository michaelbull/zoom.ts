import { VENDOR_PREFIXES } from '../Vendor';
import { hasTransitions } from '../Window';
import {
    addEventListener,
    fireEventListener,
    removeEventListener
} from './Events';

const STANDARD_EVENT: string = 'transitionend';

const TRANSITION_END_EVENTS: string[] = VENDOR_PREFIXES
    .map((prefix: string) => `${prefix}TransitionEnd`)
    .concat(STANDARD_EVENT);

export function addTransitionEndListener(window: Window, element: HTMLElement, listener: EventListener): void {
    if (hasTransitions(window, element)) {
        for (let event of TRANSITION_END_EVENTS) {
            addEventListener(element, event, listener);
        }
    } else {
        fireEventListener(STANDARD_EVENT, listener);
    }
}

export function removeTransitionEndListener(element: HTMLElement, listener: EventListener): void {
    for (let event of TRANSITION_END_EVENTS) {
        removeEventListener(element, event, listener);
    }
}
