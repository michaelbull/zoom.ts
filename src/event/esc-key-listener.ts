import { fireEventListener } from './event-listener';

const ESCAPE_KEY_CODE = 27;

/**
 * An {@link EventListenerObject} that handles {@link KeyboardEvent}s with a {@link KeyboardEvent#keyCode} equal to
 * {@link ESCAPE_KEY_CODE}.
 */
export class EscKeyListener implements EventListenerObject {
    private readonly target: any;
    private readonly delegate: EventListenerOrEventListenerObject;

    constructor(target: any, delegate: EventListenerOrEventListenerObject) {
        this.target = target;
        this.delegate = delegate;
    }

    handleEvent(evt: KeyboardEvent): void {
        if (evt.keyCode === ESCAPE_KEY_CODE) {
            evt.preventDefault();
            evt.stopPropagation();
            fireEventListener(this.target, this.delegate, evt);
        }
    }
}
