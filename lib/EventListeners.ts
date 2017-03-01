function wrap(standard: string, fallback: string): any {
    return (element: any, type: string, listener: (event: Event) => any, useCapture?: boolean): void => {
        if (element[standard] !== undefined) { // attempt to use standard listeners
            element[standard](type, listener, useCapture);
        } else if (element[fallback] !== undefined) { // attempt to use fallback listeners
            element[fallback](`on${type}`, listener, useCapture);
        } else { // no listeners available, fire event immediately
            listener(createEvent(type));
        }
    };
}

interface EventListeners {
    add(element: EventTarget, type: string, listener: (event: Event) => any, useCapture?: boolean): void;
    remove(element: EventTarget, type: string, listener: (event: Event) => any, useCapture?: boolean): void;
}

export let listeners: EventListeners = {
    add: wrap('addEventListener', 'attachEvent'),
    remove: wrap('removeEventListener', 'detachEvent')
};

export function createEvent(type: string): Event {
    if (typeof(Event) === 'function') {
        return new Event(type);
    } else {
        let event: Event = document.createEvent('Event');
        event.initEvent(type, false, false);
        return event;
    }
}
