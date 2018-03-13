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
