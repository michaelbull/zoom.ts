import {
    Config,
    defaultConfig
} from './Config';
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
    replaceImageWithClone,
    showCloneOnceLoaded
} from './element/Clone';
import { isContainer } from './element/Container';
import {
    resetStyle,
    targetSize
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
import { addDismissListeners } from './event/EventListeners';
import { pixels } from './math/Unit';
import {
    positionFrom,
    Vector
} from './math/Vector';
import { ready } from './window/Document';
import {
    capabilitiesOf,
    WindowCapabilities
} from './window/WindowCapabilities';

function collapsed(window: Window, config: Config, elements: ZoomElements): void {
    if (elements.clone !== undefined) {
        replaceCloneWithImage(elements.image, elements.clone);
    }

    deactivateImage(elements.image);

    window.document.body.removeChild(elements.overlay);
    stopCollapsingWrapper(elements.wrapper);
    resetStyle(elements.wrapper, 'height');

    setTimeout(() => addZoomListener(window, config), 1);
}

function zoomInstant(window: Window, config: Config, elements: ZoomElements, target: Vector, showCloneListener: PotentialEventListener): void {
    let bounds: Bounds = boundsFrom(elements.image);

    let resized: PotentialEventListener = addEventListener(window, 'resize', (): void => {
        let wrapperPosition: Vector = positionFrom(elements.wrapper.getBoundingClientRect());
        bounds = createBounds(wrapperPosition, bounds.size);

        setBoundsPx(elements.container.style, centreBounds(window.document, target, bounds));
    });

    let removeDismissListeners: Function;

    let collapse: EventListener = (): void => {
        removeDismissListeners();
        removeEventListener(window, 'resize', resized as EventListener);
        if (elements.clone !== undefined && showCloneListener !== undefined && !isCloneLoaded(elements.clone)) {
            removeEventListener(elements.clone, 'load', showCloneListener);
        }

        unsetWrapperExpanded(elements.wrapper);
        resetBounds(elements.container.style);
        collapsed(window, config, elements);
    };

    removeDismissListeners = addDismissListeners(window, config, elements.container, collapse);

    setWrapperExpanded(elements.wrapper);
    elements.wrapper.style.height = pixels(elements.image.height);
    activateImage(elements.image);

    setBoundsPx(elements.container.style, centreBounds(document, target, bounds));
}

function zoomTransition(window: Window, capabilities: WindowCapabilities, config: Config, elements: ZoomElements, target: Vector, showCloneListener: PotentialEventListener): void {
    let bounds: Bounds = boundsFrom(elements.image);

    let resized: PotentialEventListener = addEventListener(window, 'resize', (): void => {
        let wrapperPosition: Vector = positionFrom(elements.wrapper.getBoundingClientRect());
        bounds = createBounds(wrapperPosition, bounds.size);

        if (isWrapperTransitioning(elements.wrapper)) {
            expandToViewport(capabilities, elements.container, target, bounds);
        } else {
            setBoundsPx(elements.container.style, centreBounds(window.document, target, bounds));
        }
    });

    let expandedListener: PotentialEventListener;
    let removeDismissListeners: Function;

    let collapse: EventListener = (): void => {
        removeDismissListeners();
        removeEventListener(window, 'resize', resized as EventListener);

        if (elements.clone !== undefined && showCloneListener !== undefined && !isCloneLoaded(elements.clone)) {
            removeEventListener(elements.clone, 'load', showCloneListener);
        }

        hideOverlay(elements.overlay);
        startCollapsingWrapper(elements.wrapper);

        let collapsedListener: PotentialEventListener = listenForEvent(elements.container, capabilities.transitionEndEvent as string, () => {
            collapsed(window, config, elements);
        });

        if (isWrapperExpanding(elements.wrapper)) {
            if (expandedListener !== undefined) {
                removeEventListener(elements.container, capabilities.transitionEndEvent as string, expandedListener);
            }

            resetStyle(elements.container, capabilities.transformProperty as string);
            stopExpandingWrapper(elements.wrapper);
        } else {
            ignoreTransitions(elements.container, capabilities.transitionProperty as string, () => {
                expandToViewport(capabilities, elements.container, target, bounds);
            });

            resetStyle(elements.container, capabilities.transformProperty as string);
            resetBounds(elements.container.style);
            unsetWrapperExpanded(elements.wrapper);
        }

        if (collapsedListener === undefined) {
            collapsed(window, config, elements);
        }
    };

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
            setBoundsPx(elements.container.style, centreBounds(window.document, target, bounds));
        });
    }

    removeDismissListeners = addDismissListeners(window, config, elements.container, collapse);

    startExpandingWrapper(elements.wrapper);
    elements.wrapper.style.height = pixels(elements.image.height);
    activateImage(elements.image);

    expandedListener = listenForEvent(elements.container, capabilities.transitionEndEvent as string, () => expanded());

    if (expandedListener === undefined) {
        expanded();
    } else {
        expandToViewport(capabilities, elements.container, target, bounds);
    }
}

export function clickedZoomable(window: Window, config: Config, event: MouseEvent, zoomListener: EventListener): void {
    let image: HTMLImageElement = event.target as HTMLImageElement;
    let parent: HTMLElement = image.parentElement as HTMLElement;
    let previouslyZoomed: boolean = isContainer(parent);
    let wrapper: HTMLElement = previouslyZoomed ? parent.parentElement as HTMLElement : parent;

    if (event.metaKey || event.ctrlKey) {
        window.open(fullSrc(wrapper, image), '_blank');
    } else {
        if (zoomListener !== undefined) {
            removeEventListener(window.document.body, 'click', zoomListener);
        }

        let elements: ZoomElements;
        let overlay: HTMLDivElement = addOverlay();

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

        let target: Vector = targetSize(elements.wrapper);
        let capabilities: WindowCapabilities = capabilitiesOf(window);

        if (capabilities.hasTransform && capabilities.hasTransitions) {
            zoomTransition(window, capabilities, config, elements, target, showCloneListener);
        } else {
            zoomInstant(window, config, elements, target, showCloneListener);
        }
    }
}

export function addZoomListener(window: Window, config: Config): void {
    let listener: PotentialEventListener = addEventListener(window.document.body, 'click', (event: MouseEvent) => {
        if (isZoomable(event.target)) {
            event.preventDefault();
            event.stopPropagation();
            clickedZoomable(window, config, event, listener as EventListener);
        }
    });
}

export function listenWhenReady(window: Window, config: Config = defaultConfig()): void {
    ready(window.document, () => addZoomListener(window, config));
}
