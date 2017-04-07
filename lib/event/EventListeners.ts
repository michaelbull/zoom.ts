import { Config } from '../Config';
import { pageScrollY } from '../window/Window';
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

export function addDismissListeners(window: Window, config: Config, container: HTMLElement, collapse: EventListener): Function {
    let initialScrollY: number = pageScrollY(window);
    let scrolledAway: PotentialEventListener = addEventListener(window, 'scroll', scrolled(initialScrollY, config.scrollDelta, () => pageScrollY(window), collapse));
    let pressedEsc: PotentialEventListener = addEventListener(window.document, 'keyup', escKeyPressed(collapse));
    let dismissed: PotentialEventListener = addEventListener(container, 'click', collapse);

    return (): void => {
        removeEventListener(window, 'scroll', scrolledAway as EventListener);
        removeEventListener(window.document, 'keyup', pressedEsc as EventListener);
        removeEventListener(container, 'click', dismissed as EventListener);
    };
}
