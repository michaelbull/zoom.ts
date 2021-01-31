import { fireEventListener } from './fireEventListener';

export const ESCAPE_KEY_CODE = 27;

/**
 * An {@link EventListenerObject} that handles {@link KeyboardEvent}s with a {@link KeyboardEvent#keyCode} equal to
 * {@link ESCAPE_KEY_CODE}.
 */
export class EscKeyListener implements EventListenerObject {
    private readonly delegate: EventListenerOrEventListenerObject;
    private readonly target: EventTarget;

    constructor(delegate: EventListenerOrEventListenerObject, target: EventTarget = document) {
        this.delegate = delegate;
        this.target = target;
    }

    handleEvent(evt: KeyboardEvent): void {
        if (evt.keyCode === ESCAPE_KEY_CODE) {
            fireEventListener(this.target, this.delegate, evt);
        }
    }
}
