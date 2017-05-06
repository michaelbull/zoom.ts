import {
    createDiv,
    ready
} from './browser/Document';
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
    boundsOf,
    centreBounds,
    createBounds,
    resetBounds,
    setBoundsPx
} from './element/Bounds';
import {
    addClass,
    hasClass,
    removeClass
} from './element/ClassList';
import {
    removeCloneLoadedListener,
    replaceCloneWithImage,
    replaceImageWithClone,
    showCloneOnceLoaded
} from './element/Clone';
import {
    resetStyle,
    targetSize
} from './element/Element';
import {
    fullSrc,
    isZoomable
} from './element/Image';
import { addOverlay } from './element/Overlay';
import { expandToViewport } from './element/Transform';
import { ignoreTransitions } from './element/Transition';
import { isWrapperTransitioning } from './element/Wrapper';
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
        replaceCloneWithImage(config, elements.image, elements.clone);
    }

    document.body.removeChild(elements.overlay);
    removeClass(elements.image, config.imageActiveClass);
    removeClass(elements.wrapper, config.wrapperCollapsingClass);
    resetStyle(elements.wrapper, 'height');

    setTimeout(() => addZoomListener(config), 1);
}

export function zoomInstant(config: Config, elements: ZoomElements, target: Vector, showCloneListener: PotentialEventListener): void {
    let bounds: Bounds = boundsOf(elements.image);

    let resized: PotentialEventListener = addEventListener(window, 'resize', (): void => {
        let wrapperPosition: Vector = positionFrom(elements.wrapper.getBoundingClientRect());
        bounds = createBounds(wrapperPosition, bounds.size);

        setBoundsPx(elements.container.style, centreBounds(document, target, bounds));
    });

    let removeDismissListeners: Function;

    let collapse: EventListener = (): void => {
        removeDismissListeners();
        removeEventListener(window, 'resize', resized as EventListener);
        removeCloneLoadedListener(config, elements, showCloneListener);

        removeClass(elements.wrapper, config.wrapperExpandedClass);
        resetBounds(elements.container.style);
        collapsed(config, elements);
    };

    removeDismissListeners = addDismissListeners(config, elements.container, collapse);

    addOverlay(config, elements.overlay);
    addClass(elements.wrapper, config.wrapperExpandedClass);
    elements.wrapper.style.height = pixels(elements.image.height);
    addClass(elements.image, config.imageActiveClass);

    setBoundsPx(elements.container.style, centreBounds(document, target, bounds));
}

export function zoomTransition(config: Config, elements: ZoomElements, target: Vector, showCloneListener: PotentialEventListener, features: Features): void {
    let bounds: Bounds = boundsOf(elements.image);

    let resized: PotentialEventListener = addEventListener(window, 'resize', (): void => {
        let wrapperPosition: Vector = positionFrom(elements.wrapper.getBoundingClientRect());
        bounds = createBounds(wrapperPosition, bounds.size);

        if (isWrapperTransitioning(config, elements.wrapper)) {
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
        removeCloneLoadedListener(config, elements, showCloneListener);

        removeClass(elements.overlay, config.overlayVisibleClass);
        addClass(elements.wrapper, config.wrapperCollapsingClass);

        let collapsedListener: PotentialEventListener = listenForEvent(elements.container, features.transitionEndEvent, () => {
            collapsed(config, elements);
        });

        if (hasClass(elements.wrapper, config.wrapperExpandingClass)) {
            if (expandedListener !== undefined) {
                removeEventListener(elements.container, features.transitionEndEvent as string, expandedListener);
            }

            resetStyle(elements.container, features.transformProperty as string);
            removeClass(elements.wrapper, config.wrapperExpandingClass);
        } else {
            ignoreTransitions(elements.container, features.transitionProperty as string, () => {
                expandToViewport(features, elements.container, target, bounds);
            });

            resetStyle(elements.container, features.transformProperty as string);
            resetBounds(elements.container.style);
            removeClass(elements.wrapper, config.wrapperExpandedClass);
        }

        if (collapsedListener === undefined) {
            collapsed(config, elements);
        }
    };

    function expanded(): void {
        if (elements.clone !== undefined && hasClass(elements.clone, config.cloneLoadedClass) && !hasClass(elements.clone, config.cloneVisibleClass)) {
            if (showCloneListener !== undefined) {
                removeEventListener(elements.clone, features.transitionEndEvent as string, showCloneListener);
            }

            replaceImageWithClone(config, elements.image, elements.clone);
        }

        removeClass(elements.wrapper, config.wrapperExpandingClass);
        addClass(elements.wrapper, config.wrapperExpandedClass);

        ignoreTransitions(elements.container, features.transitionProperty as string, () => {
            resetStyle(elements.container, features.transformProperty as string);
            setBoundsPx(elements.container.style, centreBounds(document, target, bounds));
        });
    }

    removeDismissListeners = addDismissListeners(config, elements.container, collapse);

    addOverlay(config, elements.overlay);
    addClass(elements.wrapper, config.wrapperExpandingClass);
    elements.wrapper.style.height = pixels(elements.image.height);
    addClass(elements.image, config.imageActiveClass);

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
    let previouslyZoomed: boolean = hasClass(parent, config.containerClass);
    let wrapper: HTMLElement = previouslyZoomed ? parent.parentElement as HTMLElement : parent;

    if (event.metaKey || event.ctrlKey) {
        window.open(fullSrc(wrapper, image), '_blank');
    } else {
        if (zoomListener !== undefined) {
            removeEventListener(document.body, 'click', zoomListener);
        }

        let elements: ZoomElements;
        let overlay: HTMLDivElement = createDiv(config.overlayClass);

        if (previouslyZoomed) {
            elements = useExistingElements(overlay, image);
        } else {
            elements = setUpElements(config, overlay, image);

            elements.wrapper.replaceChild(elements.container, image);
            elements.container.appendChild(image);

            if (elements.clone !== undefined) {
                elements.container.appendChild(elements.clone);
            }
        }

        let showCloneListener: PotentialEventListener;

        if (elements.clone !== undefined) {
            if (hasClass(elements.clone, config.cloneLoadedClass)) {
                replaceImageWithClone(config, image, elements.clone);
            } else {
                showCloneListener = addEventListener(elements.clone, 'load', showCloneOnceLoaded(config, elements));
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
        if (isZoomable(config, event.target)) {
            event.preventDefault();
            event.stopPropagation();
            clickedZoomable(config, event, listener as EventListener);
        }
    });
}

export function listenForZoom(config: Config = DEFAULT_CONFIG): void {
    ready(document, () => addZoomListener(config));
}
