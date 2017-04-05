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
    resetBounds,
    setBoundsPx
} from './element/Style';
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
import { centreBounds } from './math/Bounds';
import { pixels } from './math/Unit';
import {
    positionFrom,
    sizeFrom,
    Vector
} from './math/Vector';
import { pageScrollY } from './window/Window';
import {
    capabilitiesOf,
    WindowCapabilities
} from './window/WindowCapabilities';

const DEFAULT_SCROLL_DELTA: number = 50;

// TODO: clean this up somehow
function collapsed(overlay: HTMLDivElement, wrapper: HTMLElement, image: HTMLImageElement): void {
    deactivateImage(image);

    document.body.removeChild(overlay);
    stopCollapsingWrapper(wrapper);
    wrapper.style.height = '';

    setTimeout(() => addZoomListener(), 1);
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

function addDismissListeners(container: HTMLElement, scrollDelta: number, collapse: Function): Function {
    let initialScrollY: number = pageScrollY(window);
    let scrolledAway: PotentialEventListener = addEventListener(window, 'scroll', scrolled(initialScrollY, scrollDelta, () => pageScrollY(window), () => collapse()));
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

function zoomInstant(elements: ZoomElements, scrollDelta: number, target: Vector): void {
    let imageRect: ClientRect = elements.image.getBoundingClientRect();
    let imagePosition: Vector = positionFrom(imageRect);
    let imageSize: Vector = sizeFrom(imageRect);

    let resized: PotentialEventListener = addEventListener(window, 'resize', (): void => {
        imagePosition = positionFrom(elements.wrapper.getBoundingClientRect());
        setBoundsPx(elements.container.style, centreBounds(document, target, imageSize, imagePosition));
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
        collapsed(elements.overlay, elements.wrapper, elements.image);
    }

    removeDismissListeners = addDismissListeners(elements.container, scrollDelta, collapse);

    setWrapperExpanded(elements.wrapper);
    elements.wrapper.style.height = pixels(elements.image.height);
    activateImage(elements.image);

    setBoundsPx(elements.container.style, centreBounds(document, target, imageSize, imagePosition));
}

function zoomTransition(capabilities: WindowCapabilities, elements: ZoomElements, scrollDelta: number, target: Vector): void {
    let imageRect: ClientRect = elements.image.getBoundingClientRect();
    let imagePosition: Vector = positionFrom(imageRect);
    let imageSize: Vector = sizeFrom(imageRect);

    let resized: PotentialEventListener = addEventListener(window, 'resize', (): void => {
        imagePosition = positionFrom(elements.wrapper.getBoundingClientRect());

        if (isWrapperTransitioning(elements.wrapper)) {
            transformToCentre(target, imageSize, imagePosition, capabilities, elements.container);
        } else {
            setBoundsPx(elements.container.style, centreBounds(document, target, imageSize, imagePosition));
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

            collapsed(elements.overlay, elements.wrapper, elements.image);
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
                transformToCentre(target, imageSize, imagePosition, capabilities, elements.container);
            });

            style[capabilities.transformProperty as string] = '';
            resetBounds(elements.container.style);
            unsetWrapperExpanded(elements.wrapper);
        }

        if (collapsedListener === undefined) {
            if (elements.clone !== undefined) {
                replaceCloneWithImage(elements.image, elements.clone);
            }

            collapsed(elements.overlay, elements.wrapper, elements.image);
        }
    }

    function expanded(): void {
        if (elements.clone !== undefined && isCloneLoaded(elements.clone) && !isCloneVisible(elements.clone)) {
            if (elements.showCloneListener !== undefined) {
                removeEventListener(elements.clone, capabilities.transitionEndEvent as string, elements.showCloneListener);
            }

            replaceImageWithClone(elements.image, elements.clone);
        }

        finishedExpanding(elements.wrapper, elements.container, target, imageSize, imagePosition, capabilities);
    }

    removeDismissListeners = addDismissListeners(elements.container, scrollDelta, collapse);

    startExpandingWrapper(elements.wrapper);
    elements.wrapper.style.height = pixels(elements.image.height);
    activateImage(elements.image);

    expandedListener = listenForEvent(elements.container, capabilities.transitionEndEvent as string, () => expanded());

    if (expandedListener === undefined) {
        expanded();
    } else {
        transformToCentre(target, imageSize, imagePosition, capabilities, elements.container);
    }
}

function clickedZoomable(event: MouseEvent, zoomListener: EventListener, scrollDelta: number): void {
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
            zoomInstant(elements, scrollDelta, target);
        } else {
            zoomTransition(capabilities, elements, scrollDelta, target);
        }
    }
}

export function addZoomListener(scrollDelta: number = DEFAULT_SCROLL_DELTA): void {
    let listener: PotentialEventListener = addEventListener(document.body, 'click', (event: MouseEvent) => {
        if (isZoomable(event.target)) {
            event.preventDefault();
            event.stopPropagation();
            clickedZoomable(event, listener as EventListener, scrollDelta);
        }
    });
}
