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
    isWrapperExpanded,
    isWrapperExpanding,
    isWrapperTransitioning,
    resolveSrc,
    stopExpandingWrapper
} from './element/Wrapper';
import {
    addEventListener,
    PotentialEventListener,
    removeEventListener
} from './event/EventListener';
import {
    escKeyPressed,
    scrolled
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

function setUp(src: string, wrapper: HTMLElement, image: HTMLImageElement): PotentialEventListener {
    let container: HTMLElement = createContainer(document);
    let clone: HTMLImageElement = createClone(src);

    let listener: PotentialEventListener = addEventListener(clone, 'load', () => {
        if (listener !== undefined) {
            removeEventListener(clone, 'load', listener);
        }

        if (isWrapperExpanded(wrapper) && !isCloneVisible(clone)) {
            showClone(clone);
            hideImage(image);
        }
    });

    wrapper.replaceChild(container, image);
    container.appendChild(image);
    container.appendChild(clone);
    return undefined;
}

// TODO: clean this up somehow
function collapsed(overlay: HTMLDivElement, wrapper: HTMLElement, image: HTMLImageElement, clone: HTMLImageElement): void {
    showImage(image);
    hideClone(clone);
    document.body.removeChild(overlay);
    finishCollapsingWrapper(wrapper);
    addZoomListener();
}

function expanded(wrapper: HTMLElement, container: HTMLElement, target: Vector, imageSize: Vector, imagePosition: Vector, clone: HTMLImageElement, showCloneListener: PotentialEventListener, transitionEndEvent: string | any, image: HTMLImageElement): void {
    finishExpandingWrapper(wrapper);

    refreshContainer(container, () => {
        fixToCentre(container, document, target, imageSize, imagePosition);
    });

    if (isCloneLoaded(clone) && !isCloneVisible(clone)) {
        if (showCloneListener !== undefined) {
            removeEventListener(clone, transitionEndEvent as string, showCloneListener);
        }

        showClone(clone);
        hideImage(image);
    }
}

function zoom(wrapper: HTMLElement, image: HTMLImageElement, transformProperty: string, transitionProperty: string | any, showCloneListener: PotentialEventListener, scrollY: number, overlay: HTMLDivElement): void {
    let container: HTMLElement = image.parentElement as HTMLElement;
    let clone: HTMLImageElement = container.children.item(1) as HTMLImageElement;

    let target: Vector = targetDimensions(wrapper);
    let imageRect: ClientRect = image.getBoundingClientRect();
    let imagePosition: Vector = positionFrom(imageRect);
    let imageSize: Vector = sizeFrom(imageRect);

    let use3d: boolean = hasTranslate3d(window, transformProperty);
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

        if (!isCloneLoaded(clone) && showCloneListener !== undefined) {
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

function clickedZoomable(event: MouseEvent, zoomListener: PotentialEventListener, scrollDelta: number): void {
    let image: HTMLImageElement = event.target as HTMLImageElement;
    let parent: HTMLElement = image.parentElement as HTMLElement;
    let grandParent: HTMLElement = parent.parentElement as HTMLElement;

    let alreadySetUp: boolean = isContainer(parent);
    let wrapper: HTMLElement = alreadySetUp ? grandParent : parent;

    let src: string = resolveSrc(wrapper, image);
    let transformProperty: string | null = vendorProperty(document.body.style, 'transform');

    if (transformProperty === null || event.metaKey || event.ctrlKey) {
        window.open(src, '_blank');
    } else {
        if (zoomListener !== undefined) {
            removeEventListener(document.body, 'click', zoomListener);
        }

        let transitionProperty: string | null = vendorProperty(document.body.style, 'transition');
        let showClone: PotentialEventListener = alreadySetUp ? undefined : setUp(src, wrapper, image);
        let overlay: HTMLDivElement = addOverlay(document);

        zoom(wrapper, image, transformProperty, transitionProperty, showClone, scrollDelta, overlay);
    }
}

export function addZoomListener(scrollDelta: number = DEFAULT_SCROLL_DELTA): void {
    let listener: PotentialEventListener = addEventListener(document.body, 'click', (event: MouseEvent) => {
        if (isZoomable(event.target)) {
            event.preventDefault();
            removeEventListener(document.body, 'click', listener as EventListener);
            clickedZoomable(event, listener, scrollDelta);
        }
    });
}
