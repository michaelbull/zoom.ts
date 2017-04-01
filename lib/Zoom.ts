import {
    createClone,
    hideClone,
    isCloneLoaded,
    isCloneVisible,
    showClone
} from './element/Clone';
import {
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
import { transform } from './element/Style';
import {
    collapseWrapper,
    expandWrapper,
    finishCollapsingWrapper,
    finishExpandingWrapper,
    isWrapperExpanding,
    isWrapperTransitioning,
    stopExpandingWrapper
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
    finishCollapsingWrapper(wrapper);
    addZoomListener();
}

function expanded(wrapper: HTMLElement, container: HTMLElement, target: Vector, imageSize: Vector, imagePosition: Vector, clone: HTMLImageElement | null, showCloneListener: PotentialEventListener, transitionEndEvent: string | any, image: HTMLImageElement): void {
    finishExpandingWrapper(wrapper);

    refreshContainer(container, () => {
        fixToCentre(container, document, target, imageSize, imagePosition);
    });

    if (clone !== null && isCloneLoaded(clone) && !isCloneVisible(clone)) {
        if (showCloneListener !== undefined) {
            removeEventListener(clone, transitionEndEvent as string, showCloneListener);
        }

        showClone(clone);
        hideImage(image);
    }
}

function zoom(wrapper: HTMLElement, container: HTMLElement, image: HTMLImageElement, clone: HTMLImageElement | null, transformProperty: string, transitionProperty: string | any, showCloneListener: PotentialEventListener, scrollY: number, overlay: HTMLDivElement): void {
    let target: Vector = targetDimensions(wrapper);
    let imageRect: ClientRect = image.getBoundingClientRect();
    let imagePosition: Vector = positionFrom(imageRect);
    let imageSize: Vector = sizeFrom(imageRect);

    let use3d: boolean = transformProperty !== null && hasTranslate3d(window, transformProperty);
    let transitionEndEvent: string | null = transitionProperty === null ? null : TRANSITION_END_EVENTS[transitionProperty];

    function recalculateScale(): void {
        if (isWrapperTransitioning(wrapper)) {
            transitionToCentre(container, document, target, imageSize, imagePosition, use3d);
        } else {
            fixToCentre(container, document, target, imageSize, imagePosition);
        }
    }

    let expandedListener: PotentialEventListener = undefined;

    if (transitionEndEvent !== null) {
        expandedListener = addEventListener(container, transitionEndEvent, () => {
            if (expandedListener !== undefined) {
                removeEventListener(container, transitionEndEvent as string, expandedListener);
            }

            expanded(wrapper, container, target, imageSize, imagePosition, clone, showCloneListener, transitionEndEvent, image);
        });
    }

    let removeListeners: Function;

    function collapse(): void {
        removeListeners();

        if (isWrapperExpanding(wrapper)) {
            if (expandedListener !== undefined) {
                removeEventListener(container, transitionEndEvent as string, expandedListener);
            }

            stopExpandingWrapper(wrapper);
        }

        if (clone !== null && !isCloneLoaded(clone) && showCloneListener !== undefined) {
            removeEventListener(clone, 'load', showCloneListener);
        }

        collapseWrapper(wrapper);
        hideOverlay(overlay);

        let collapsedListener: PotentialEventListener;

        if (transitionEndEvent !== null) {
            collapsedListener = addEventListener(container, transitionEndEvent, () => {
                if (collapsedListener !== undefined) {
                    removeEventListener(container, transitionEndEvent as string, collapsedListener);
                }

                collapsed(overlay, wrapper, image, clone);
            });
        }

        refreshContainer(container, recalculateScale);
        restoreContainer(container);

        if (collapsedListener === undefined) {
            collapsed(overlay, wrapper, image, clone);
        }
    }

    let initialScrollY: number = pageScrollY(window);

    let pressedEsc: PotentialEventListener = addEventListener(document, 'keyup', escKeyPressed(collapse));
    let dismissed: PotentialEventListener = addEventListener(container, 'click', () => collapse());
    let scrolledAway: PotentialEventListener = addEventListener(window, 'scroll', scrolled(initialScrollY, scrollY, () => collapse(), () => pageScrollY(window)));
    let resized: PotentialEventListener = addEventListener(window, 'resize', (): void => {
        imagePosition = positionFrom(wrapper.getBoundingClientRect());
        recalculateScale();
    });

    removeListeners = (): void => {
        removeEventListener(document, 'keyup', pressedEsc as EventListenerOrEventListenerObject);
        removeEventListener(container, 'click', dismissed as EventListenerOrEventListenerObject);
        removeEventListener(window, 'scroll', scrolledAway as EventListenerOrEventListenerObject);
        removeEventListener(window, 'resize', resized as EventListenerOrEventListenerObject);
    };

    expandWrapper(wrapper, image.height);
    activateImage(image);

    if (transitionEndEvent === null || expandedListener === undefined) {
        expanded(wrapper, container, target, imageSize, imagePosition, clone, showCloneListener, transitionEndEvent, image);
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

    let transformProperty: string | null = vendorProperty(document.body.style, 'transform');

    if (transformProperty === null || event.metaKey || event.ctrlKey) {
        window.open(actualSrc, '_blank');
    } else {
        if (zoomListener !== undefined) {
            removeEventListener(document.body, 'click', zoomListener);
        }

        let transitionProperty: string | null = vendorProperty(document.body.style, 'transition');

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

        let overlay: HTMLDivElement = addOverlay(document);

        zoom(wrapper, container, image, clone, transformProperty, transitionProperty, showCloneListener, scrollDelta, overlay);
    }
}

export function addZoomListener(scrollDelta: number = DEFAULT_SCROLL_DELTA): void {
    let listener: PotentialEventListener = addEventListener(document.body, 'click', (event: MouseEvent) => {
        if (isZoomable(event.target)) {
            event.preventDefault();
            clickedZoomable(event, listener as EventListener, scrollDelta);
        }
    });
}
