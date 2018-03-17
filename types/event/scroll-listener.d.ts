/**
 * An {@link EventListenerObject} that handles {@link Event}s when the page has been scrolled vertically a certain
 * {@link ScrollListener#distance} in pixels from a {@link ScrollListener#start} position.
 */
export declare class ScrollListener implements EventListenerObject {
    private readonly start;
    private readonly distance;
    private readonly delegate;
    constructor(start: number, distance: number, delegate: EventListenerOrEventListenerObject);
    handleEvent(evt: Event): void;
}
