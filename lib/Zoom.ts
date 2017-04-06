import { Config } from './Config';
import {
    Bounds,
    boundsFrom,
    centreBounds,
    createBounds,
    resetBounds,
    setBoundsPx
} from './element/Bounds';
import {
    isCloneLoaded,
    isCloneVisible,
    replaceCloneWithImage,
    replaceImageWithClone
} from './element/Clone';
import { isContainer } from './element/Container';
import {
    resetStyle,
    targetDimensions
} from './element/Element';
import {
    activateImage,
    deactivateImage,
    fullSrc,
    isZoomable
} from './element/Image';
import {
    addOverlay,
    hideOverlay
} from './element/Overlay';
import { expandToViewport } from './element/Transform';
import { ignoreTransitions } from './element/Transition';
import {
    isWrapperExpanding,
    isWrapperTransitioning,
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
    scrolled,
    showCloneOnceLoaded
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

function collapsed(config: Config, elements: ZoomElements): void {
    if (elements.clone !== undefined) {
        replaceCloneWithImage(elements.image, elements.clone);
    }

    deactivateImage(elements.image);

    document.body.removeChild(elements.overlay);
    stopCollapsingWrapper(elements.wrapper);
    resetStyle(elements.wrapper, 'height');

    setTimeout(() => addZoomListener(config), 1);
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

function zoomInstant(config: Config, elements: ZoomElements, target: Vector, showCloneListener: PotentialEventListener): void {
    let bounds: Bounds = boundsFrom(elements.image);

    let resized: PotentialEventListener = addEventListener(window, 'resize', (): void => {
        let wrapperPosition: Vector = positionFrom(elements.wrapper.getBoundingClientRect());
        bounds = createBounds(wrapperPosition, bounds.size);

        setBoundsPx(elements.container.style, centreBounds(document, target, bounds));
    });

    let removeDismissListeners: Function;

    function collapse(): void {
        removeDismissListeners();
        removeEventListener(window, 'resize', resized as EventListener);
        if (elements.clone !== undefined && showCloneListener !== undefined && !isCloneLoaded(elements.clone)) {
            removeEventListener(elements.clone, 'load', showCloneListener);
        }

        unsetWrapperExpanded(elements.wrapper);
        resetBounds(elements.container.style);
        collapsed(config, elements);
    }

    removeDismissListeners = addDismissListeners(config, elements.container, collapse);

    setWrapperExpanded(elements.wrapper);
    elements.wrapper.style.height = pixels(elements.image.height);
    activateImage(elements.image);

    setBoundsPx(elements.container.style, centreBounds(document, target, bounds));
}

function zoomTransition(config: Config, elements: ZoomElements, target: Vector, showCloneListener: PotentialEventListener, capabilities: WindowCapabilities): void {
    let bounds: Bounds = boundsFrom(elements.image);

    let resized: PotentialEventListener = addEventListener(window, 'resize', (): void => {
        let wrapperPosition: Vector = positionFrom(elements.wrapper.getBoundingClientRect());
        bounds = createBounds(wrapperPosition, bounds.size);

        if (isWrapperTransitioning(elements.wrapper)) {
            expandToViewport(elements.container, target, bounds, capabilities, document);
        } else {
            setBoundsPx(elements.container.style, centreBounds(document, target, bounds));
        }
    });

    let expandedListener: PotentialEventListener;
    let removeDismissListeners: Function;

    function collapse(): void {
        removeDismissListeners();
        removeEventListener(window, 'resize', resized as EventListener);

        if (elements.clone !== undefined && showCloneListener !== undefined && !isCloneLoaded(elements.clone)) {
            removeEventListener(elements.clone, 'load', showCloneListener);
        }

        hideOverlay(elements.overlay);
        startCollapsingWrapper(elements.wrapper);

        let collapsedListener: PotentialEventListener = listenForEvent(elements.container, capabilities.transitionEndEvent as string, () => {
            collapsed(config, elements);
        });

        if (isWrapperExpanding(elements.wrapper)) {
            if (expandedListener !== undefined) {
                removeEventListener(elements.container, capabilities.transitionEndEvent as string, expandedListener);
            }

            resetStyle(elements.container, capabilities.transformProperty as string);
            stopExpandingWrapper(elements.wrapper);
        } else {
            ignoreTransitions(elements.container, capabilities.transitionProperty as string, () => {
                expandToViewport(elements.container, target, bounds, capabilities, document);
            });

            resetStyle(elements.container, capabilities.transformProperty as string);
            resetBounds(elements.container.style);
            unsetWrapperExpanded(elements.wrapper);
        }

        if (collapsedListener === undefined) {
            collapsed(config, elements);
        }
    }

    function expanded(): void {
        if (elements.clone !== undefined && isCloneLoaded(elements.clone) && !isCloneVisible(elements.clone)) {
            if (showCloneListener !== undefined) {
                removeEventListener(elements.clone, capabilities.transitionEndEvent as string, showCloneListener);
            }

            replaceImageWithClone(elements.image, elements.clone);
        }

        stopExpandingWrapper(elements.wrapper);
        setWrapperExpanded(elements.wrapper);

        ignoreTransitions(elements.container, capabilities.transitionProperty as string, () => {
            resetStyle(elements.container, capabilities.transformProperty as string);
            setBoundsPx(elements.container.style, centreBounds(document, target, bounds));
        });
    }

    removeDismissListeners = addDismissListeners(config, elements.container, collapse);

    startExpandingWrapper(elements.wrapper);
    elements.wrapper.style.height = pixels(elements.image.height);
    activateImage(elements.image);

    expandedListener = listenForEvent(elements.container, capabilities.transitionEndEvent as string, () => expanded());

    if (expandedListener === undefined) {
        expanded();
    } else {
        expandToViewport(elements.container, target, bounds, capabilities, document);
    }
}

function clickedZoomable(config: Config, event: MouseEvent, zoomListener: EventListener): void {
    let image: HTMLImageElement = event.target as HTMLImageElement;
    let parent: HTMLElement = image.parentElement as HTMLElement;
    let previouslyZoomed: boolean = isContainer(parent);
    let wrapper: HTMLElement = previouslyZoomed ? parent.parentElement as HTMLElement : parent;

    if (event.metaKey || event.ctrlKey) {
        window.open(fullSrc(wrapper, image), '_blank');
    } else {
        if (zoomListener !== undefined) {
            removeEventListener(document.body, 'click', zoomListener);
        }

        let capabilities: WindowCapabilities = capabilitiesOf(window);
        let transition: boolean = capabilities.hasTransform && capabilities.hasTransitions && capabilities.transitionEndEvent !== undefined;

        let elements: ZoomElements;
        let overlay: HTMLDivElement = addOverlay(document);

        if (previouslyZoomed) {
            elements = useExistingElements(overlay, image);

            if (elements.clone !== undefined && isCloneLoaded(elements.clone)) {
                replaceImageWithClone(image, elements.clone);
            }
        } else {
            elements = setUpElements(overlay, image);

            elements.wrapper.replaceChild(elements.container, image);
            elements.container.appendChild(image);

            if (elements.clone !== undefined) {
                elements.container.appendChild(elements.clone);
            }
        }

        let showCloneListener: PotentialEventListener;

        if (elements.clone !== undefined) {
            if (isCloneLoaded(elements.clone)) {
                replaceImageWithClone(image, elements.clone);
            } else {
                showCloneListener = addEventListener(elements.clone, 'load', showCloneOnceLoaded(elements));
            }
        }

        let target: Vector = targetDimensions(elements.wrapper);

        if (transition) {
            zoomTransition(config, elements, target, showCloneListener, capabilities);
        } else {
            zoomInstant(config, elements, target, showCloneListener);
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
