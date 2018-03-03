export function fireEventListener(
    target: any,
    listener: EventListenerOrEventListenerObject,
    event: Event
): void {
    if (typeof listener === 'function') {
        listener.call(target, event);
    } else {
        listener.handleEvent(event);
    }
}
