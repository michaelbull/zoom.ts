import { listeners } from './EventListeners';
import {
    vendorPrefixes,
    vendorProperties
} from './Vendor';

const transitionEndEvents: string[] = ['transitionend'].concat(
    vendorPrefixes.map((prefix: string) => `${prefix}TransitionEnd`)
);

function hasTransitions(element?: HTMLElement): boolean {
    let property: string = vendorProperties('transitionDuration').find((type: string) => type in document.body.style);

    if (element === undefined) {
        return property !== undefined;
    }

    let style: any = getComputedStyle(element);
    let duration: any = style[property];
    return duration.length > 0 && parseFloat(duration) !== 0;
}

export function addTransitionEndListener(element: HTMLElement, listener: EventListener): void {
    if (hasTransitions(element)) {
        for (let event of transitionEndEvents) {
            listeners.add(element, event, listener);
        }
    } else {
        listener(new Event(transitionEndEvents[0]));
    }
}

export function removeTransitionEndListener(element: HTMLElement, listener: EventListener): void {
    for (let event of transitionEndEvents) {
        listeners.remove(element, event, listener);
    }
}
