import { createDiv } from '../browser/Document';
import { Config } from '../Config';
import { createClone } from './Clone';
import { fullSrc } from './Image';

export interface ZoomElements {
    readonly overlay: HTMLDivElement;
    readonly wrapper: HTMLElement;
    readonly container: HTMLElement;
    readonly image: HTMLImageElement;
    readonly clone: HTMLImageElement | undefined;
}

export function useExistingElements(overlay: HTMLDivElement, image: HTMLImageElement): ZoomElements {
    let container = image.parentElement as HTMLElement;
    let wrapper = container.parentElement as HTMLElement;

    let cloneRequired = fullSrc(wrapper, image) !== image.src;
    let clone = cloneRequired ? container.children.item(1) as HTMLImageElement : undefined;

    return {
        overlay,
        wrapper,
        container,
        image,
        clone
    };
}

export function setUpElements(config: Config, overlay: HTMLDivElement, image: HTMLImageElement): ZoomElements {
    let container = createDiv(config.containerClass);
    let wrapper = image.parentElement as HTMLElement;

    let src = fullSrc(wrapper, image);
    let cloneRequired= src !== image.src;
    let clone = cloneRequired ? createClone(config, src) : undefined;

    return {
        overlay,
        wrapper,
        container,
        image,
        clone
    };
}
