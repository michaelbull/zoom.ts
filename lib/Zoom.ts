import { Config } from './Config';
import {
    Bounds,
    boundsFrom,
    centreBounds,
    resetBounds,
    setBoundsPx
} from './element/Bounds';
import {
    hideClone,
    isCloneLoaded,
    isCloneVisible,
    showClone
} from './element/Clone';
import { isContainer } from './element/Container';
import { targetDimensions } from './element/Element';
import {
    activateImage,
    deactivateImage,
    fullSrc,
    hideImage,
    isZoomable,
    showImage
} from './element/Image';
import {
    addOverlay,
    hideOverlay
} from './element/Overlay';
import {
    centreTransformation,
    ScaleAndTranslate,
    scaleTranslate,
    scaleTranslate3d
} from './element/Transform';
import { ignoreTransitions } from './element/Transition';
import {
    isWrapper,
    isWrapperExpanding,
    isWrapperTransitioning,
    setWrapper,
    setWrapperExpanded,
    startCollapsingWrapper,
    startExpandingWrapper,
    stopCollapsingWrapper,
    stopExpandingWrapper,
    unsetWrapperExpanded
} from './element/Wrapper';
import {
    setUpElements,
    useExistingElements,
    ZoomElements
} from './element/ZoomElements';
import {
    addEventListener,
    listenForEvent,
    PotentialEventListener,
    removeEventListener
} from './event/EventListener';
import {
    escKeyPressed,
    scrolled
} from './event/EventListeners';
import { pixels } from './math/Unit';
import {
    positionFrom,
    Vector
} from './math/Vector';
import { pageScrollY } from './window/Window';
import {
    capabilitiesOf,
    WindowCapabilities
} from './window/WindowCapabilities';

function collapsed(config: Config, overlay: HTMLDivElement, wrapper: HTMLElement, image: HTMLImageElement): void {
    deactivateImage(image);

    document.body.removeChild(overlay);
    stopCollapsingWrapper(wrapper);
    wrapper.style.height = '';

    setTimeout(() => addZoomListener(config), 1);
}

function finishedExpanding(wrapper: HTMLElement, container: HTMLElement, target: Vector, imageSize: Vector, imagePosition: Vector, capabilities: WindowCapabilities): void {
    stopExpandingWrapper(wrapper);
    setWrapperExpanded(wrapper);

    ignoreTransitions(container, capabilities.transitionProperty as string, () => {
        let style: any = container.style;

        style[capabilities.transformProperty as string] = '';
        setBoundsPx(style, centreBounds(document, target, imageSize, imagePosition));
    });
}

function transformToCentre(target: Vector, size: Vector, position: Vector, capabilities: WindowCapabilities, container: HTMLElement) {
    let transformation: ScaleAndTranslate = centreTransformation(document, target, size, position);
    let style: any = container.style;

    if (capabilities.hasTranslate3d) {
        style[capabilities.transformProperty as string] = scaleTranslate3d(transformation);
    } else {
        style[capabilities.transformProperty as string] = scaleTranslate(transformation);
    }
}

function addDismissListeners(config: Config, container: HTMLElement, collapse: Function): Function {
    let initialScrollY: number = pageScrollY(window);
    let scrolledAway: PotentialEventListener = addEventListener(window, 'scroll', scrolled(initialScrollY, config.scrollDelta, () => pageScrollY(window), () => collapse()));
    let pressedEsc: PotentialEventListener = addEventListener(document, 'keyup', escKeyPressed(collapse));
    let dismissed: PotentialEventListener = addEventListener(container, 'click', () => collapse());

    return (): void => {
        removeEventListener(document, 'keyup', pressedEsc as EventListener);
        removeEventListener(container, 'click', dismissed as EventListener);
        removeEventListener(window, 'scroll', scrolledAway as EventListener);
    };
}

function replaceImageWithClone(image: HTMLImageElement, clone: HTMLImageElement) {
    showClone(clone);
    hideImage(image);
}

function replaceCloneWithImage(image: HTMLImageElement, clone: HTMLImageElement) {
    showImage(image);
    hideClone(clone);
}

function zoomInstant(config: Config, elements: ZoomElements, target: Vector): void {
    let bounds: Bounds = boundsFrom(elements.image);
    let currentPosition: Vector = bounds.position;

    let resized: PotentialEventListener = addEventListener(window, 'resize', (): void => {
        currentPosition = positionFrom(elements.wrapper.getBoundingClientRect());
        setBoundsPx(elements.container.style, centreBounds(document, target, bounds.size, currentPosition));
    });

    let removeDismissListeners: Function;

    function collapse(): void {
        removeDismissListeners();
        removeEventListener(window, 'resize', resized as EventListener);

        if (elements.clone !== undefined) {
            if (!isCloneLoaded(elements.clone) && elements.showCloneListener !== undefined) {
                removeEventListener(elements.clone, 'load', elements.showCloneListener);
            }

            replaceCloneWithImage(elements.image, elements.clone);
        }

        unsetWrapperExpanded(elements.wrapper);
        resetBounds(elements.container.style);
        collapsed(config, elements.overlay, elements.wrapper, elements.image);
    }

    removeDismissListeners = addDismissListeners(config, elements.container, collapse);

    setWrapperExpanded(elements.wrapper);
    elements.wrapper.style.height = pixels(elements.image.height);
    activateImage(elements.image);

    setBoundsPx(elements.container.style, centreBounds(document, target, bounds.size, currentPosition));
}

function zoomTransition(config: Config, elements: ZoomElements, target: Vector, capabilities: WindowCapabilities): void {
    let bounds: Bounds = boundsFrom(elements.image);
    let currentPosition: Vector = bounds.position;

    let resized: PotentialEventListener = addEventListener(window, 'resize', (): void => {
        currentPosition = positionFrom(elements.wrapper.getBoundingClientRect());

        if (isWrapperTransitioning(elements.wrapper)) {
            transformToCentre(target, bounds.size, currentPosition, capabilities, elements.container);
        } else {
            setBoundsPx(elements.container.style, centreBounds(document, target, bounds.size, currentPosition));
        }
    });

    let expandedListener: PotentialEventListener;
    let removeDismissListeners: Function;

    function collapse(): void {
        removeDismissListeners();
        removeEventListener(window, 'resize', resized as EventListener);

        if (elements.clone !== undefined && !isCloneLoaded(elements.clone) && elements.showCloneListener !== undefined) {
            removeEventListener(elements.clone, 'load', elements.showCloneListener);
        }

        hideOverlay(elements.overlay);
        startCollapsingWrapper(elements.wrapper);

        let collapsedListener: PotentialEventListener = listenForEvent(elements.container, capabilities.transitionEndEvent as string, () => {
            if (elements.clone !== undefined) {
                replaceCloneWithImage(elements.image, elements.clone);
            }

            collapsed(config, elements.overlay, elements.wrapper, elements.image);
        });

        let style: any = elements.container.style;

        if (isWrapperExpanding(elements.wrapper)) {
            if (expandedListener !== undefined) {
                removeEventListener(elements.container, capabilities.transitionEndEvent as string, expandedListener);
            }

            style[capabilities.transformProperty as string] = '';
            stopExpandingWrapper(elements.wrapper);
        } else {
            ignoreTransitions(elements.container, capabilities.transitionProperty as string, () => {
                transformToCentre(target, bounds.size, currentPosition, capabilities, elements.container);
            });

            style[capabilities.transformProperty as string] = '';
            resetBounds(elements.container.style);
            unsetWrapperExpanded(elements.wrapper);
        }

        if (collapsedListener === undefined) {
            if (elements.clone !== undefined) {
                replaceCloneWithImage(elements.image, elements.clone);
            }

            collapsed(config, elements.overlay, elements.wrapper, elements.image);
        }
    }

    function expanded(): void {
        if (elements.clone !== undefined && isCloneLoaded(elements.clone) && !isCloneVisible(elements.clone)) {
            if (elements.showCloneListener !== undefined) {
                removeEventListener(elements.clone, capabilities.transitionEndEvent as string, elements.showCloneListener);
            }

            replaceImageWithClone(elements.image, elements.clone);
        }

        finishedExpanding(elements.wrapper, elements.container, target, bounds.position, currentPosition, capabilities);
    }

    removeDismissListeners = addDismissListeners(config, elements.container, collapse);

    startExpandingWrapper(elements.wrapper);
    elements.wrapper.style.height = pixels(elements.image.height);
    activateImage(elements.image);

    expandedListener = listenForEvent(elements.container, capabilities.transitionEndEvent as string, () => expanded());

    if (expandedListener === undefined) {
        expanded();
    } else {
        transformToCentre(target, bounds.size, currentPosition, capabilities, elements.container);
    }
}

function clickedZoomable(config: Config, event: MouseEvent, zoomListener: EventListener): void {
    let image: HTMLImageElement = event.target as HTMLImageElement;
    let parent: HTMLElement = image.parentElement as HTMLElement;
    let previouslyZoomed: boolean = isContainer(parent);

    let wrapper: HTMLElement;

    if (previouslyZoomed) {
        let grandParent: HTMLElement | null = parent.parentElement;

        if (grandParent === null) {
            throw new Error('No wrapper found.');
        } else {
            wrapper = grandParent;
        }
    } else {
        wrapper = parent;
    }

    if (event.metaKey || event.ctrlKey) {
        window.open(fullSrc(wrapper, image), '_blank');
    } else {
        if (zoomListener !== undefined) {
            removeEventListener(document.body, 'click', zoomListener);
        }

        if (!isWrapper(wrapper)) {
            setWrapper(wrapper);
        }

        let capabilities: WindowCapabilities = capabilitiesOf(window);
        let transition: boolean = capabilities.hasTransform && capabilities.hasTransitions && capabilities.transitionEndEvent !== undefined;

        let elements: ZoomElements;
        let overlay: HTMLDivElement = addOverlay(document);
        let target: Vector = targetDimensions(wrapper);

        if (previouslyZoomed) {
            elements = useExistingElements(overlay, wrapper, image);

            if (elements.clone !== undefined && !isCloneLoaded(elements.clone)) {
                replaceImageWithClone(image, elements.clone);
            }
        } else {
            elements = setUpElements(overlay, wrapper, image);

            wrapper.replaceChild(elements.container, image);
            elements.container.appendChild(image);

            if (elements.clone !== undefined) {
                elements.container.appendChild(elements.clone);
            }
        }

        if (transition) {
            zoomInstant(config, elements, target);
        } else {
            zoomTransition(config, elements, target, capabilities);
        }
    }
}

export function addZoomListener(config: Config): void {
    let listener: PotentialEventListener = addEventListener(document.body, 'click', (event: MouseEvent) => {
        if (isZoomable(event.target)) {
            event.preventDefault();
            event.stopPropagation();
            clickedZoomable(config, event, listener as EventListener);
        }
    });
}
