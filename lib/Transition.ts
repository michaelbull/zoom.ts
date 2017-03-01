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

function transitionDurationProperty(): string | null {
    for (let property of vendorProperties('transitionDuration')) {
        if (property in document.body.style) {
            return property;
        }
    }

    return null;
}

function hasTransitions(element?: HTMLElement): boolean {
    let property: string | null = transitionDurationProperty();

    if (property === null) {
        return false;
    } else if (element === undefined) {
        return true;
    } else {
        let style: any = getComputedStyle(element);
        let duration: any = style[property];
        return duration.length > 0 && parseFloat(duration) !== 0;
    }
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
