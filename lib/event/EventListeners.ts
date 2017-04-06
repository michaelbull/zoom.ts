import {
    isCloneVisible,
    showClone
} from '../element/Clone';
import { hideImage } from '../element/Image';
import { isWrapperExpanded } from '../element/Wrapper';
import { ZoomElements } from '../element/ZoomElements';

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

export function showCloneOnceLoaded(elements: ZoomElements): EventListener {
    return (): void => {
        if (elements.clone !== undefined && isWrapperExpanded(elements.wrapper) && !isCloneVisible(elements.clone)) {
            showClone(elements.clone);
            hideImage(elements.image);
        }
    };
}
