import { pageScrollY } from '../browser/Window';
import { Config } from '../Config';
import {
    addEventListener,
    fireEventListener,
    PotentialEventListener,
    removeEventListener
} from './EventListener';

export const ESCAPE_KEY_CODE: number = 27;

export function escKeyPressed(listener: EventListenerOrEventListenerObject): EventListener {
    return (event: KeyboardEvent): void => {
        if (event.keyCode === ESCAPE_KEY_CODE) {
            event.preventDefault();
            event.stopPropagation();
            fireEventListener(listener, event);
        }
    };
}

export function scrolled(start: number, minAmount: number, current: () => number, listener: EventListenerOrEventListenerObject): EventListener {
    return (event: Event): void => {
        if (Math.abs(start - current()) >= minAmount) {
            fireEventListener(listener, event);
        }
    };
}

export function addDismissListeners(config: Config, container: HTMLElement, collapse: EventListener): Function {
    let initialScrollY: number = pageScrollY();
    let scrolledAway: PotentialEventListener = addEventListener(window, 'scroll', scrolled(initialScrollY, config.scrollDelta, () => pageScrollY(), collapse));
    let pressedEsc: PotentialEventListener = addEventListener(document, 'keyup', escKeyPressed(collapse));
    let dismissed: PotentialEventListener = addEventListener(container, 'click', collapse);

    return (): void => {
        removeEventListener(window, 'scroll', scrolledAway as EventListener);
        removeEventListener(document, 'keyup', pressedEsc as EventListener);
        removeEventListener(container, 'click', dismissed as EventListener);
    };
}
