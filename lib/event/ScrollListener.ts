import { pageScrollY } from '../browser/Window';
import { fireEventListener } from './EventListener';

/**
 * An {@link EventListenerObject} that handles {@link Event}s when the page has been scrolled vertically a certain
 * {@link ScrollListener#distance} in pixels from a {@link ScrollListener#start} position.
 */
export class ScrollListener implements EventListenerObject {
    private readonly target: any;
    private readonly start: number;
    private readonly distance: number;
    private readonly delegate: EventListenerOrEventListenerObject;

    constructor(target: any, start: number, distance: number, delegate: EventListenerOrEventListenerObject) {
        this.target = target;
        this.start = start;
        this.distance = distance;
        this.delegate = delegate;
    }

    handleEvent(evt: Event): void {
        let delta = Math.abs(this.start - pageScrollY());

        if (delta > this.distance) {
            fireEventListener(this.target, this.delegate, evt);
        }
    }
}
