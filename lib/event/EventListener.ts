import {
    currentEvent,
    polyfillEvent
} from './Event';

export type PotentialEventListener = EventListener | undefined;

export function fireEventListener(listener: EventListenerOrEventListenerObject, event: Event): void {
    if (typeof listener === 'function') {
        listener(event);
    } else {
        listener.handleEvent(event);
    }
}

export function addEventListener(target: any, type: string, listener: EventListenerOrEventListenerObject, useCapture: boolean = false): PotentialEventListener {
    let standard: any = target['addEventListener'];
    let fallback: any = target['attachEvent'];

    let wrappedListener: EventListener = (event: Event): void => {
        fireEventListener(listener, polyfillEvent(currentEvent(event)));
    };

    if (typeof standard === 'function') {
        standard.call(target, type, wrappedListener, useCapture);
        return wrappedListener;
    } else if (typeof fallback === 'function' && fallback.call(target, `on${type}`, wrappedListener)) {
        return wrappedListener;
    }

    return undefined;
}

export function listenForEvent(target: any, type: any, listener: EventListenerOrEventListenerObject, useCapture: boolean = false): PotentialEventListener {
    let registered: PotentialEventListener = addEventListener(target, type, (event: Event) => {
        if (registered !== undefined) {
            removeEventListener(target, type, registered);
        }

        fireEventListener(listener, event);
    }, useCapture);

    return registered;
}

export function removeEventListener(target: any, type: string, listener: EventListenerOrEventListenerObject): boolean {
    let standard: any = target['removeEventListener'];
    let fallback: any = target['detachEvent'];

    if (typeof standard === 'function') {
        standard.call(target, type, listener);
        return true;
    } else if (typeof fallback === 'function') {
        fallback.call(target, type, listener);
        return true;
    } else {
        return false;
    }
}
