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
import { ZoomElements } from './ZoomElements';

export function createClone(config: Config, src: string): HTMLImageElement {
    let clone = document.createElement('img');
    clone.className = config.cloneClass;
    clone.src = src;
    listenForEvent(clone, 'load', () => addClass(clone, config.cloneLoadedClass));
    return clone;
}

export function showCloneOnceLoaded(
    config: Config,
    elements: ZoomElements
): EventListener {
    return (): void => {
        if (elements.clone !== undefined) {
            let cloneHidden = !hasClass(elements.clone, config.cloneVisibleClass);
            let wrapperExpanded = hasClass(elements.wrapper, config.wrapperExpandedClass);

            if (cloneHidden && wrapperExpanded) {
                replaceImageWithClone(config, elements.image, elements.clone);
            }
        }
    };
}

export function removeCloneLoadedListener(
    config: Config,
    elements: ZoomElements,
    showCloneListener: PotentialEventListener
): void {
    if (elements.clone !== undefined && showCloneListener !== undefined) {
        let cloneLoading: boolean = !hasClass(elements.clone, config.cloneLoadedClass);

        if (cloneLoading) {
            removeEventListener(elements.clone, 'load', showCloneListener);
        }
    }
}

export function replaceImageWithClone(
    config: Config,
    image: HTMLImageElement,
    clone: HTMLImageElement
): void {
    addClass(clone, config.cloneVisibleClass);
    addClass(image, config.imageHiddenClass);
}

export function replaceCloneWithImage(
    config: Config,
    image: HTMLImageElement,
    clone: HTMLImageElement
): void {
    removeClass(image, config.imageHiddenClass);
    removeClass(clone, config.cloneVisibleClass);
}
