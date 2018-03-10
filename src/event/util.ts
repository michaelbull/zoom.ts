export function fireEventListener(
    target: EventTarget,
    listener: EventListenerOrEventListenerObject,
    evt: Event
): void {
    if (typeof listener === 'function') {
        listener.call(target, evt);
    } else {
        listener.handleEvent(evt);
    }
}

export function removeEventListener(
    target: EventTarget,
    type: string,
    listener?: EventListenerOrEventListenerObject
) {
    target.removeEventListener(type, listener);
}
