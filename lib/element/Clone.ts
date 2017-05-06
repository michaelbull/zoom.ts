import { Config } from '../Config';
import {
    PotentialEventListener,
    removeEventListener
} from '../event/EventListener';
import { listenForEvent } from '../event/EventListeners';
import {
    addClass,
    hasClass,
    removeClass
} from './ClassList';
import {
    hideImage,
    showImage
} from './Image';
import { isWrapperExpanded } from './Wrapper';
import { ZoomElements } from './ZoomElements';

export function createClone(config: Config, src: string): HTMLImageElement {
    let clone: HTMLImageElement = document.createElement('img');
    clone.className = config.cloneClass;
    clone.src = src;
    listenForEvent(clone, 'load', () => addClass(clone, config.cloneLoadedClass));
    return clone;
}

export function showCloneOnceLoaded(config: Config, elements: ZoomElements): EventListener {
    return (): void => {
        if (elements.clone !== undefined) {
            let cloneHidden: boolean = !hasClass(elements.clone, config.cloneVisibleClass);

            if (cloneHidden && isWrapperExpanded(elements.wrapper)) {
                replaceImageWithClone(config, elements.image, elements.clone);
            }
        }
    };
}

export function removeCloneLoadedListener(config: Config, elements: ZoomElements, showCloneListener: PotentialEventListener): void {
    if (elements.clone !== undefined && showCloneListener !== undefined) {
        let cloneLoading: boolean = !hasClass(elements.clone, config.cloneLoadedClass);

        if (cloneLoading) {
            removeEventListener(elements.clone, 'load', showCloneListener);
        }
    }
}

export function replaceImageWithClone(config: Config, image: HTMLImageElement, clone: HTMLImageElement): void {
    addClass(clone, config.cloneVisibleClass);
    hideImage(image);
}

export function replaceCloneWithImage(config: Config, image: HTMLImageElement, clone: HTMLImageElement): void {
    showImage(image);
    removeClass(clone, config.cloneVisibleClass);
}
