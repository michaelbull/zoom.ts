import {
    isCloneVisible,
    showClone
} from '../element/Clone';
import { hideImage } from '../element/Image';
import { isWrapperExpanded } from '../element/Wrapper';
import {
    addEventListener,
    PotentialEventListener,
    removeEventListener
} from './EventListener';

export const ESCAPE_KEY_CODE: number = 27;

export function escKeyPressed(callback: Function): EventListener {
    return (event: KeyboardEvent): void => {
        if (event.keyCode === ESCAPE_KEY_CODE) {
            event.preventDefault();
            callback();
        }
    };
}

export function scrolled(start: number, minAmount: number, current: () => number, callback: Function): EventListener {
    return (): void => {
        if (Math.abs(start - current()) >= minAmount) {
            callback();
        }
    };
}

export function showCloneOnceLoaded(wrapper: HTMLElement, image: HTMLImageElement, clone: HTMLImageElement): PotentialEventListener {
    let listener: PotentialEventListener = addEventListener(clone, 'load', () => {
        if (listener !== undefined) {
            removeEventListener(clone, 'load', listener);
        }

        if (isWrapperExpanded(wrapper) && !isCloneVisible(clone)) {
            showClone(clone);
            hideImage(image);
        }
    });

    return listener;
}
