import { vendorPrefixes } from '../Vendor';
import { hasTransitions } from '../Window';
import {
    addEventListener,
    fireEventListener,
    removeEventListener
} from './Events';

const transitionEndEvents: string[] = ['transitionend'];

for (let prefix of vendorPrefixes) {
    transitionEndEvents.push(`${prefix}TransitionEnd`);
}

export function addTransitionEndListener(window: Window, element: HTMLElement, listener: EventListener): void {
    if (hasTransitions(window, element)) {
        for (let event of transitionEndEvents) {
            addEventListener(element, event, listener);
        }
    } else {
        fireEventListener(transitionEndEvents[0], listener);
    }
}

export function removeTransitionEndListener(element: HTMLElement, listener: EventListener): void {
    for (let event of transitionEndEvents) {
        removeEventListener(element, event, listener);
    }
}
