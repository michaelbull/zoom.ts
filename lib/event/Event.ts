export function currentEvent(event: Event | undefined, context: Window = window): Event {
    if (event !== undefined) {
        return event;
    } else if (context.event !== undefined) {
        return context.event;
    } else {
        throw new Error('No current event to handle.');
    }
}

export function polyfillEvent(event: Event): Event {
    if (typeof event.preventDefault !== 'function') {
        event.preventDefault = (): void => {
            event.returnValue = false;
        };
    }

    if (typeof event.stopPropagation !== 'function') {
        event.stopPropagation = (): void => {
            event.cancelBubble = true;
        };
    }

    if (event.type === 'mouseover') {
        let mouseEvent: MouseEvent = event as MouseEvent;

        if (mouseEvent.relatedTarget === undefined && mouseEvent.fromElement !== undefined) {
            (mouseEvent as any).relatedTarget = mouseEvent.fromElement;
        }
    } else if (event.type === 'mouseout') {
        let mouseEvent: MouseEvent = event as MouseEvent;

        if (mouseEvent.relatedTarget === undefined && mouseEvent.toElement !== undefined) {
            (mouseEvent as any).relatedTarget = mouseEvent.toElement;
        }
    }

    return event;
}
