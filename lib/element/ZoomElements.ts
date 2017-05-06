import { Config } from '../Config';
import { createClone } from './Clone';
import { fullSrc } from './Image';
import { createDiv } from '../browser/Document';

export interface ZoomElements {
    readonly overlay: HTMLDivElement;
    readonly wrapper: HTMLElement;
    readonly container: HTMLElement;
    readonly image: HTMLImageElement;
    readonly clone: HTMLImageElement | undefined;
}

export function useExistingElements(overlay: HTMLDivElement, image: HTMLImageElement): ZoomElements {
    let container: HTMLElement = image.parentElement as HTMLElement;
    let wrapper: HTMLElement = container.parentElement as HTMLElement;

    let clone: HTMLImageElement | undefined;
    let src: string = fullSrc(wrapper, image);
    let cloneRequired: boolean = src !== image.src;

    if (cloneRequired) {
        clone = container.children.item(1) as HTMLImageElement;
    }

    return {
        overlay,
        wrapper,
        container,
        image,
        clone
    };
}

export function setUpElements(config: Config, overlay: HTMLDivElement, image: HTMLImageElement): ZoomElements {
    let container: HTMLElement = createDiv(config.containerClass);
    let wrapper: HTMLElement = image.parentElement as HTMLElement;

    let clone: HTMLImageElement | undefined;
    let src: string = fullSrc(wrapper, image);
    let cloneRequired: boolean = src !== image.src;

    if (cloneRequired) {
        clone = createClone(config, src);
    }

    return {
        overlay,
        wrapper,
        container,
        image,
        clone
    };
}
