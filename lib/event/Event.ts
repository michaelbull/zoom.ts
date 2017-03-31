
export function currentEvent(event: Event | undefined): Event {
    if (event !== undefined) {
        return event;
    } else if (window.event !== undefined) {
        return window.event;
    } else {
        throw new TypeError('no current event to handle');
    }
}

export function polyfillEvent(event: Event): Event {
    if (typeof event.preventDefault !== 'function') {
        event.preventDefault = (): void => {
            event.returnValue = false;
        };
    }

    if (typeof event.stopPropagation !== 'function') {
        event.stopPropagation = () => {
            event.cancelBubble = true;
        };
    }

    if (event.type === 'mouseover') {
        let mouseEvent: MouseEvent = event as MouseEvent;
        let missingRelatedTarget: boolean = mouseEvent.relatedTarget === undefined;

        if (missingRelatedTarget && mouseEvent.fromElement !== undefined) {
            (mouseEvent as any).relatedTarget = mouseEvent.fromElement;
        }
    } else if (event.type === 'mouseout') {
        let mouseEvent: MouseEvent = event as MouseEvent;
        let missingRelatedTarget: boolean = mouseEvent.relatedTarget === undefined;

        if (missingRelatedTarget && mouseEvent.toElement !== undefined) {
            (mouseEvent as any).relatedTarget = mouseEvent.toElement;
        }
    }

    return event;
}
