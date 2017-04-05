import {
    addEventListener,
    PotentialEventListener
} from '../event/EventListener';
import { showCloneOnceLoaded } from '../event/EventListeners';
import {
    createClone,
    isCloneLoaded
} from './Clone';
import { createContainer } from './Container';
import { fullSrc } from './Image';

export interface ZoomElements {
    overlay: HTMLDivElement;
    wrapper: HTMLElement;
    container: HTMLElement;
    image: HTMLImageElement;
    clone: HTMLImageElement | undefined;
    showCloneListener: PotentialEventListener;
}

export function useExistingElements(overlay: HTMLDivElement, wrapper: HTMLElement, image: HTMLImageElement): ZoomElements {
    let container: HTMLElement = image.parentElement as HTMLElement;

    let clone: HTMLImageElement | undefined;
    let src: string = fullSrc(wrapper, image);
    let cloneRequired: boolean = src !== image.src;
    let showCloneListener: PotentialEventListener;

    if (cloneRequired) {
        clone = container.children.item(1) as HTMLImageElement;

        if (!isCloneLoaded(clone)) {
            showCloneListener = showCloneOnceLoaded(wrapper, image, clone);
        }
    }

    return {
        overlay,
        wrapper,
        container,
        image,
        clone,
        showCloneListener
    };
}

export function setUpElements(overlay: HTMLDivElement, wrapper: HTMLElement, image: HTMLImageElement): ZoomElements {
    let container: HTMLElement = createContainer(document);

    let clone: HTMLImageElement | undefined;
    let src: string = fullSrc(wrapper, image);
    let cloneRequired: boolean = src !== image.src;
    let showCloneListener: PotentialEventListener;

    if (cloneRequired) {
        clone = createClone(src);
        showCloneListener = addEventListener(clone, 'load', () => {
            showCloneOnceLoaded(wrapper, image, clone as HTMLImageElement);
        });
    }

    return {
        overlay,
        wrapper,
        container,
        image,
        clone,
        showCloneListener
    };
}
