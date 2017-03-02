function call(target: any, type: string, listener: EventListener, standard: string, fallback: string): boolean {
    let standardFunction: any = target[standard];
    let fallbackFunction: any = target[fallback];

    if (standardFunction !== undefined) {
        standardFunction(type, listener);
        return true;
    } else if (fallbackFunction !== undefined) {
        fallbackFunction(`on${type}`, listener);
        return true;
    } else {
        return false;
    }
}

export function addEventListener(target: any, type: string, listener: EventListener): void {
    if (!call(target, type, listener, 'addEventListener', 'attachEvent')) {
        listener(createEvent(type)); // fire immediately
    }
}

export function removeEventListener(target: any, type: string, listener: EventListener): void {
    call(target, type, listener, 'removeEventListener', 'detachEvent');
}

export function createEvent(type: string): Event {
    if (typeof(Event) === 'function') {
        return new Event(type);
    } else {
        let event: Event = document.createEvent('Event');
        event.initEvent(type, false, false);
        return event;
    }
}
