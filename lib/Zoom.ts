import { ready } from './browser/Document';
import {
    detectFeatures,
    Features
} from './browser/Features';
import {
    Config,
    DEFAULT_CONFIG
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
    createOverlay,
    hideOverlay,
    addOverlay
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
    PotentialEventListener,
    removeEventListener
} from './event/EventListener';
import {
    addDismissListeners,
    listenForEvent
} from './event/EventListeners';
import { pixels } from './math/Unit';
import {
    positionFrom,
    Vector
} from './math/Vector';

export function collapsed(config: Config, elements: ZoomElements): void {
    if (elements.clone !== undefined) {
        replaceCloneWithImage(elements.image, elements.clone);
    }

    deactivateImage(elements.image);

    document.body.removeChild(elements.overlay);
    stopCollapsingWrapper(elements.wrapper);
    resetStyle(elements.wrapper, 'height');

    setTimeout(() => addZoomListener(config), 1);
}

export function zoomInstant(config: Config, elements: ZoomElements, target: Vector, showCloneListener: PotentialEventListener): void {
    let bounds: Bounds = boundsFrom(elements.image);

    let resized: PotentialEventListener = addEventListener(window, 'resize', (): void => {
        let wrapperPosition: Vector = positionFrom(elements.wrapper.getBoundingClientRect());
        bounds = createBounds(wrapperPosition, bounds.size);

        setBoundsPx(elements.container.style, centreBounds(document, target, bounds));
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
        collapsed(config, elements);
    };

    removeDismissListeners = addDismissListeners(config, elements.container, collapse);

    addOverlay(elements.overlay);
    setWrapperExpanded(elements.wrapper);
    elements.wrapper.style.height = pixels(elements.image.height);
    activateImage(elements.image);

    setBoundsPx(elements.container.style, centreBounds(document, target, bounds));
}

export function zoomTransition(config: Config, elements: ZoomElements, target: Vector, showCloneListener: PotentialEventListener, features: Features): void {
    let bounds: Bounds = boundsFrom(elements.image);

    let resized: PotentialEventListener = addEventListener(window, 'resize', (): void => {
        let wrapperPosition: Vector = positionFrom(elements.wrapper.getBoundingClientRect());
        bounds = createBounds(wrapperPosition, bounds.size);

        if (isWrapperTransitioning(elements.wrapper)) {
            expandToViewport(features, elements.container, target, bounds);
        } else {
            setBoundsPx(elements.container.style, centreBounds(document, target, bounds));
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

        let collapsedListener: PotentialEventListener = listenForEvent(elements.container, features.transitionEndEvent, () => {
            collapsed(config, elements);
        });

        if (isWrapperExpanding(elements.wrapper)) {
            if (expandedListener !== undefined) {
                removeEventListener(elements.container, features.transitionEndEvent as string, expandedListener);
            }

            resetStyle(elements.container, features.transformProperty as string);
            stopExpandingWrapper(elements.wrapper);
        } else {
            ignoreTransitions(elements.container, features.transitionProperty as string, () => {
                expandToViewport(features, elements.container, target, bounds);
            });

            resetStyle(elements.container, features.transformProperty as string);
            resetBounds(elements.container.style);
            unsetWrapperExpanded(elements.wrapper);
        }

        if (collapsedListener === undefined) {
            collapsed(config, elements);
        }
    };

    function expanded(): void {
        if (elements.clone !== undefined && isCloneLoaded(elements.clone) && !isCloneVisible(elements.clone)) {
            if (showCloneListener !== undefined) {
                removeEventListener(elements.clone, features.transitionEndEvent as string, showCloneListener);
            }

            replaceImageWithClone(elements.image, elements.clone);
        }

        stopExpandingWrapper(elements.wrapper);
        setWrapperExpanded(elements.wrapper);

        ignoreTransitions(elements.container, features.transitionProperty as string, () => {
            resetStyle(elements.container, features.transformProperty as string);
            setBoundsPx(elements.container.style, centreBounds(document, target, bounds));
        });
    }

    removeDismissListeners = addDismissListeners(config, elements.container, collapse);

    addOverlay(elements.overlay);
    startExpandingWrapper(elements.wrapper);
    elements.wrapper.style.height = pixels(elements.image.height);
    activateImage(elements.image);

    expandedListener = listenForEvent(elements.container, features.transitionEndEvent as string, () => expanded());

    if (expandedListener === undefined) {
        expanded();
    } else {
        expandToViewport(features, elements.container, target, bounds);
    }
}

export function clickedZoomable(config: Config, event: MouseEvent, zoomListener: EventListener): void {
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

        let elements: ZoomElements;
        let overlay: HTMLDivElement = createOverlay();

        if (previouslyZoomed) {
            elements = useExistingElements(overlay, image);
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
        let features: Features = detectFeatures();

        if (features.hasTransform && features.hasTransitions) {
            zoomTransition(config, elements, target, showCloneListener, features);
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

export function listenForZoom(config: Config = DEFAULT_CONFIG): void {
    ready(document, () => addZoomListener(config));
}
