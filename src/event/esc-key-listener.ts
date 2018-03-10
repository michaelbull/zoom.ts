import { fireEventListener } from './util';

const ESCAPE_KEY_CODE = 27;

/**
 * An {@link EventListenerObject} that handles {@link KeyboardEvent}s with a {@link KeyboardEvent#keyCode} equal to
 * {@link ESCAPE_KEY_CODE}.
 */
export class EscKeyListener implements EventListenerObject {
    private readonly delegate: EventListenerOrEventListenerObject;

    constructor(delegate: EventListenerOrEventListenerObject) {
        this.delegate = delegate;
    }

    handleEvent(evt: KeyboardEvent): void {
        if (evt.keyCode === ESCAPE_KEY_CODE) {
            fireEventListener(document, this.delegate, evt);
        }
    }
}
