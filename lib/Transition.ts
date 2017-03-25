import {
    addEventListener,
    fireEventListener,
    removeEventListener
} from './Events';
import {
    vendorPrefixes,
    vendorProperty
} from './Vendor';

const transitionEndEvents: string[] = ['transitionend'];

for (let prefix of vendorPrefixes) {
    transitionEndEvents.push(`${prefix}TransitionEnd`);
}

export function hasTransitions(window: Window, element: HTMLElement): boolean {
    if (window.getComputedStyle === undefined) {
        return false;
    }

    let property: string | null = vendorProperty(element.style, 'transitionDuration');

    if (property === null) {
        return false;
    }

    let style: any = window.getComputedStyle(element);
    let value: string = style[property];

    if (value === '') {
        return false;
    }

    let duration: number = parseFloat(value);
    return !isNaN(duration) && duration !== 0;
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
