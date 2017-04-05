import {
    isCloneVisible,
    showClone
} from '../element/Clone';
import { hideImage } from '../element/Image';
import { isWrapperExpanded } from '../element/Wrapper';

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

export function showCloneOnceLoaded(wrapper: HTMLElement, image: HTMLImageElement, clone: HTMLImageElement): EventListener {
    return (): void => {
        if (isWrapperExpanded(wrapper) && !isCloneVisible(clone)) {
            showClone(clone);
            hideImage(image);
        }
    };
}
