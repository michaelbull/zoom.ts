function call(target: any, type: string, listener: EventListener, standard: string, fallback: string): boolean {
    let standardFn: any = target[standard];
    let fallbackFn: any = target[fallback];

    if (typeof standardFn === 'function') {
        standardFn.call(target, type, listener);
        return true;
    } else if (typeof fallbackFn === 'function') {
        fallbackFn.call(target, `on${type}`, listener);
        return true;
    } else {
        return false;
    }
}

function createEvent(type: string): Event {
    if (typeof(Event) === 'function') {
        return new Event(type);
    } else {
        let event: Event = document.createEvent('Event');
        event.initEvent(type, false, false);
        return event;
    }
}

export function addEventListener(target: any, type: string, listener: EventListener): void {
    if (!call(target, type, listener, 'addEventListener', 'attachEvent')) {
        fireEventListener(type, listener);
    }
}

export function removeEventListener(target: any, type: string, listener: EventListener): void {
    call(target, type, listener, 'removeEventListener', 'detachEvent');
}

export function fireEventListener(type: string, listener: EventListener): void {
    listener(createEvent(type));
}