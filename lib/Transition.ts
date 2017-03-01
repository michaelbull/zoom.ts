import {
    createEvent,
    listeners
} from './EventListeners';
import {
    vendorPrefixes,
    vendorProperties
} from './Vendor';

const transitionEndEvents: string[] = ['transitionend'];

for (let prefix of vendorPrefixes) {
    transitionEndEvents.push(`${prefix}TransitionEnd`);
}

function transitionDurationProperty(element: HTMLElement): string | null {
    for (let property of vendorProperties('transitionDuration')) {
        if (property in element.style) {
            return property;
        }
    }

    return null;
}

function hasTransitions(element: HTMLElement): boolean {
    if (window.getComputedStyle === undefined) {
        return false;
    }

    let property: string | null = transitionDurationProperty(element);

    if (property === null) {
        return false;
    }

    let style: any = window.getComputedStyle(element);
    let duration: string = style[property];
    return duration.length > 0 && parseFloat(duration) !== 0;
}

export function addTransitionEndListener(element: HTMLElement, listener: EventListener): void {
    if (hasTransitions(element)) {
        for (let event of transitionEndEvents) {
            listeners.add(element, event, listener);
        }
    } else {
        listener(createEvent(transitionEndEvents[0]));
    }
}

export function removeTransitionEndListener(element: HTMLElement, listener: EventListener): void {
    for (let event of transitionEndEvents) {
        listeners.remove(element, event, listener);
    }
}
