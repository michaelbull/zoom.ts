import {
    addEventListener,
    removeEventListener,
    createEvent
} from './Events';
import {
    vendorPrefixes,
    vendorProperty
} from './Vendor';

const transitionEndEvents: string[] = ['transitionend'];

for (let prefix of vendorPrefixes) {
    transitionEndEvents.push(`${prefix}TransitionEnd`);
}

export function hasTransitions(element: HTMLElement): boolean {
    if (window.getComputedStyle === undefined) {
        return false;
    }

    let property: string | null = vendorProperty(element, 'transitionDuration');

    if (property === null) {
        return false;
    }

    let style: any = window.getComputedStyle(element);
    let value: string = style[property];

    if (value.length < 1) {
        return false;
    }

    let duration: number = parseFloat(value);
    return !isNaN(duration) && duration !== 0;
}

export function addTransitionEndListener(element: HTMLElement, listener: EventListener): void {
    if (hasTransitions(element)) {
        for (let event of transitionEndEvents) {
            addEventListener(element, event, listener);
        }
    } else {
        listener(createEvent(transitionEndEvents[0]));
    }
}

export function removeTransitionEndListener(element: HTMLElement, listener: EventListener): void {
    for (let event of transitionEndEvents) {
        removeEventListener(element, event, listener);
    }
}
