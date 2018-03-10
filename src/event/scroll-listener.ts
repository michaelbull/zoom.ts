import { pageScrollY } from '../browser/window';
import { fireEventListener } from './util';

/**
 * An {@link EventListenerObject} that handles {@link Event}s when the page has been scrolled vertically a certain
 * {@link ScrollListener#distance} in pixels from a {@link ScrollListener#start} position.
 */
export class ScrollListener implements EventListenerObject {
    private readonly start: number;
    private readonly distance: number;
    private readonly delegate: EventListenerOrEventListenerObject;

    constructor(start: number, distance: number, delegate: EventListenerOrEventListenerObject) {
        this.start = start;
        this.distance = distance;
        this.delegate = delegate;
    }

    handleEvent(evt: Event): void {
        let delta = Math.abs(this.start - pageScrollY());

        if (delta > this.distance) {
            fireEventListener(document, this.delegate, evt);
        }
    }
}
