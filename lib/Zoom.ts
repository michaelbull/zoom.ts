import {
    createClone,
    hideClone,
    isCloneLoaded,
    isCloneVisible,
    showClone
} from './element/Clone';
import {
    centreContainer,
    createContainer,
    fixToCentre,
    isContainer,
    refreshContainer,
    restoreContainer,
    transitionToCentre
} from './element/Container';
import { targetDimensions } from './element/Element';
import {
    activateImage,
    deactivateImage,
    hideImage,
    isZoomable,
    showImage
} from './element/Image';
import {
    addOverlay,
    hideOverlay
} from './element/Overlay';
import {
    setHeightPx,
    transform,
    unsetHeight
} from './element/Style';
import {
    isWrapperExpanding,
    setWrapperExpanded,
    startCollapsingWrapper,
    startExpandingWrapper,
    stopCollapsingWrapper,
    stopExpandingWrapper,
    unsetWrapperExpanded
} from './element/Wrapper';
import {
    addEventListener,
    PotentialEventListener,
    removeEventListener
} from './event/EventListener';
import {
    escKeyPressed,
    scrolled,
    showCloneOnceLoaded
} from './event/EventListeners';
import {
    positionFrom,
    sizeFrom,
    Vector
} from './math/Vector';
import { vendorProperty } from './Vendor';
import {
    hasTranslate3d,
    pageScrollY,
    TRANSITION_END_EVENTS
} from './Window';

const DEFAULT_SCROLL_DELTA: number = 50;

// TODO: clean this up somehow
function collapsed(overlay: HTMLDivElement, wrapper: HTMLElement, image: HTMLImageElement, clone: HTMLImageElement | null): void {
    deactivateImage(image);

    if (clone !== null) {
        showImage(image);
        hideClone(clone);
    }

    document.body.removeChild(overlay);
    stopCollapsingWrapper(wrapper);
    unsetHeight(wrapper.style);

    setTimeout(() => addZoomListener(), 1);
}

function expanded(wrapper: HTMLElement, container: HTMLElement, target: Vector, imageSize: Vector, imagePosition: Vector) {
    setWrapperExpanded(wrapper);

    refreshContainer(container, () => {
        fixToCentre(container, document, target, imageSize, imagePosition);
    });
}

function finishedExpanding(wrapper: HTMLElement, container: HTMLElement, target: Vector, imageSize: Vector, imagePosition: Vector, clone: HTMLImageElement | null, showCloneListener: PotentialEventListener, transitionEndEvent: string | any, image: HTMLImageElement): void {
    stopExpandingWrapper(wrapper);
    expanded(wrapper, container, target, imageSize, imagePosition);

    if (clone !== null && isCloneLoaded(clone) && !isCloneVisible(clone)) {
        if (showCloneListener !== undefined) {
            removeEventListener(clone, transitionEndEvent as string, showCloneListener);
        }

        showClone(clone);
        hideImage(image);
    }
}

function zoomInstant(wrapper: HTMLElement, container: HTMLElement, image: HTMLImageElement, clone: HTMLImageElement | any, showCloneListener: PotentialEventListener, scrollY: number, overlay: HTMLDivElement, target: Vector, use3d: boolean): void {
    let initialScrollY: number = pageScrollY(window);
    let imageRect: ClientRect = image.getBoundingClientRect();
    let imagePosition: Vector = positionFrom(imageRect);
    let imageSize: Vector = sizeFrom(imageRect);

    function recentre(): void {
        centreContainer(wrapper, container, target, imageSize, imagePosition, use3d);
    }

    let removeListeners: Function;

    function collapse(): void {
        removeListeners();

        if (clone !== null && !isCloneLoaded(clone) && showCloneListener !== undefined) {
            removeEventListener(clone, 'load', showCloneListener);
        }

        unsetWrapperExpanded(wrapper);
        restoreContainer(container);
        collapsed(overlay, wrapper, image, clone);
    }

    let pressedEsc: PotentialEventListener = addEventListener(document, 'keyup', escKeyPressed(collapse));
    let dismissed: PotentialEventListener = addEventListener(container, 'click', () => collapse());
    let scrolledAway: PotentialEventListener = addEventListener(window, 'scroll', scrolled(initialScrollY, scrollY, () => pageScrollY(window), () => collapse()));
    let resized: PotentialEventListener = addEventListener(window, 'resize', (): void => {
        imagePosition = positionFrom(wrapper.getBoundingClientRect());
        recentre();
    });

    removeListeners = (): void => {
        removeEventListener(document, 'keyup', pressedEsc as EventListenerOrEventListenerObject);
        removeEventListener(container, 'click', dismissed as EventListenerOrEventListenerObject);
        removeEventListener(window, 'scroll', scrolledAway as EventListenerOrEventListenerObject);
        removeEventListener(window, 'resize', resized as EventListenerOrEventListenerObject);
    };

    setWrapperExpanded(wrapper);
    setHeightPx(wrapper.style, image.height);
    activateImage(image);

    expanded(wrapper, container, target, imageSize, imagePosition);
}

function zoomTransition(wrapper: HTMLElement, container: HTMLElement, image: HTMLImageElement, clone: HTMLImageElement | any, showCloneListener: PotentialEventListener, scrollY: number, overlay: HTMLDivElement, transitionEndEvent: string, target: Vector, use3d: boolean): void {
    let initialScrollY: number = pageScrollY(window);
    let imageRect: ClientRect = image.getBoundingClientRect();
    let imagePosition: Vector = positionFrom(imageRect);
    let imageSize: Vector = sizeFrom(imageRect);

    function recentre(): void {
        centreContainer(wrapper, container, target, imageSize, imagePosition, use3d);
    }

    let expandedListener: PotentialEventListener = undefined;
    let removeListeners: Function;

    function collapse(): void {
        removeListeners();

        if (clone !== null && !isCloneLoaded(clone) && showCloneListener !== undefined) {
            removeEventListener(clone, 'load', showCloneListener);
        }

        if (isWrapperExpanding(wrapper)) {
            if (expandedListener !== undefined) {
                removeEventListener(container, transitionEndEvent, expandedListener);
            }

            stopExpandingWrapper(wrapper);
        } else {
            unsetWrapperExpanded(wrapper);
        }

        startCollapsingWrapper(wrapper);
        hideOverlay(overlay);

        let collapsedListener: PotentialEventListener = addEventListener(container, transitionEndEvent, () => {
            if (collapsedListener !== undefined) {
                removeEventListener(container, transitionEndEvent, collapsedListener);
            }

            collapsed(overlay, wrapper, image, clone);
        });

        refreshContainer(container, recentre);
        restoreContainer(container);

        if (collapsedListener === undefined) {
            collapsed(overlay, wrapper, image, clone);
        }
    }

    let pressedEsc: PotentialEventListener = addEventListener(document, 'keyup', escKeyPressed(collapse));
    let dismissed: PotentialEventListener = addEventListener(container, 'click', () => collapse());
    let scrolledAway: PotentialEventListener = addEventListener(window, 'scroll', scrolled(initialScrollY, scrollY, () => pageScrollY(window), () => collapse()));
    let resized: PotentialEventListener = addEventListener(window, 'resize', (): void => {
        imagePosition = positionFrom(wrapper.getBoundingClientRect());
        recentre();
    });

    removeListeners = (): void => {
        removeEventListener(document, 'keyup', pressedEsc as EventListenerOrEventListenerObject);
        removeEventListener(container, 'click', dismissed as EventListenerOrEventListenerObject);
        removeEventListener(window, 'scroll', scrolledAway as EventListenerOrEventListenerObject);
        removeEventListener(window, 'resize', resized as EventListenerOrEventListenerObject);
    };

    startExpandingWrapper(wrapper);
    setHeightPx(wrapper.style, image.height);
    activateImage(image);

    expandedListener = addEventListener(container, transitionEndEvent, () => {
        if (expandedListener !== undefined) {
            removeEventListener(container, transitionEndEvent, expandedListener);
        }

        finishedExpanding(wrapper, container, target, imageSize, imagePosition, clone, showCloneListener, transitionEndEvent, image);
    });

    if (expandedListener === undefined) {
        finishedExpanding(wrapper, container, target, imageSize, imagePosition, clone, showCloneListener, transitionEndEvent, image);
    } else {
        transitionToCentre(container, document, target, imageSize, imagePosition, use3d);
    }
}

function clickedZoomable(event: MouseEvent, zoomListener: EventListener, scrollDelta: number): void {
    let image: HTMLImageElement = event.target as HTMLImageElement;
    let parent: HTMLElement = image.parentElement as HTMLElement;
    let grandParent: HTMLElement = parent.parentElement as HTMLElement;

    let alreadySetUp: boolean = isContainer(parent);
    let wrapper: HTMLElement = alreadySetUp ? grandParent : parent;

    let originalSrc: string = image.src;
    let fullSrc: string | null = wrapper.getAttribute('data-src');
    let actualSrc: string = fullSrc === null ? originalSrc : fullSrc;

    let transformProperty: string | undefined = vendorProperty(document.body.style, 'transform');

    if (transformProperty === undefined || event.metaKey || event.ctrlKey) {
        window.open(actualSrc, '_blank');
    } else {
        if (zoomListener !== undefined) {
            removeEventListener(document.body, 'click', zoomListener);
        }

        let transitionProperty: string | undefined = vendorProperty(document.body.style, 'transition');
        let transitionEndEvent: string | undefined = transitionProperty === undefined ? undefined : TRANSITION_END_EVENTS[transitionProperty];

        let container: HTMLElement;
        let clone: HTMLImageElement | null = null;

        let cloneRequired: boolean = fullSrc !== null && fullSrc !== originalSrc;
        let showCloneListener: PotentialEventListener;

        if (alreadySetUp) {
            container = image.parentElement as HTMLElement;

            if (cloneRequired) {
                clone = container.children.item(1) as HTMLImageElement;

                if (!isCloneLoaded(clone)) {
                    showCloneListener = showCloneOnceLoaded(wrapper, image, clone);
                }
            }
        } else {
            container = createContainer(document);
            wrapper.replaceChild(container, image);
            container.appendChild(image);

            if (cloneRequired) {
                clone = createClone(actualSrc);
                showCloneListener = showCloneOnceLoaded(wrapper, image, clone);
                container.appendChild(clone);
            }
        }

        let target: Vector = targetDimensions(wrapper);
        let use3d: boolean = hasTranslate3d(window, transformProperty);

        let overlay: HTMLDivElement = addOverlay(document);

        if (transitionEndEvent === undefined) {
            zoomInstant(wrapper, container, image, clone, showCloneListener, scrollDelta, overlay, target, use3d);
        } else {
            zoomTransition(wrapper, container, image, clone, showCloneListener, scrollDelta, overlay, transitionEndEvent, target, use3d);
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
