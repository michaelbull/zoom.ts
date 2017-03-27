import {
    isCloneVisible,
    setCloneVisible
} from '../element/Clone';
import { setImageHidden } from '../element/Image';
import { isWrapperExpanded } from '../element/Wrapper';
import { removeEventListener } from './Events';

export const ESCAPE_KEY_CODE: number = 27;

export function escKeyPressed(callback: Function): EventListener {
    return (event: KeyboardEvent): void => {
        if (event.keyCode === ESCAPE_KEY_CODE) {
            event.preventDefault();
            callback();
        }
    };
}

export function scrolled(start: number, minAmount: number, callback: Function, current: () => number): EventListener {
    return (): void => {
        if (Math.abs(start - current()) >= minAmount) {
            callback();
        }
    };
}

export function cloneLoaded(wrapper: HTMLElement, image: HTMLImageElement, clone: HTMLImageElement): EventListener {
    let listener: EventListener = (): void => {
        removeEventListener(clone, 'load', listener);

        if (isWrapperExpanded(wrapper) && !isCloneVisible(clone)) {
            setImageHidden(image);
            setCloneVisible(clone);
        }
    };

    return listener;
}
