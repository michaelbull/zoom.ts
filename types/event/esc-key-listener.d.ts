export declare const ESCAPE_KEY_CODE = 27;
/**
 * An {@link EventListenerObject} that handles {@link KeyboardEvent}s with a {@link KeyboardEvent#keyCode} equal to
 * {@link ESCAPE_KEY_CODE}.
 */
export declare class EscKeyListener implements EventListenerObject {
    private readonly delegate;
    constructor(delegate: EventListenerOrEventListenerObject);
    handleEvent(evt: KeyboardEvent): void;
}
