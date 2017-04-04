import {
    createClone,
    hideClone,
    isCloneLoaded,
    isCloneVisible,
    showClone
} from './element/Clone';
import {
    createContainer,
    isContainer
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
    addEventListener,
    PotentialEventListener,
    removeEventListener
} from './event/EventListener';
import {
    escKeyPressed,
    scrolled,
    showCloneOnceLoaded
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

function finishedExpanding(wrapper: HTMLElement, container: HTMLElement, target: Vector, imageSize: Vector, imagePosition: Vector, transformProperty: string, transitionProperty: string): void {
    stopExpandingWrapper(wrapper);
    setWrapperExpanded(wrapper);

    ignoreTransitions(container, transitionProperty, () => {
        let style: any = container.style;

        style[transformProperty] = '';
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

function zoomInstantWithClone(wrapper: HTMLElement, container: HTMLElement, image: HTMLImageElement, clone: HTMLImageElement, showCloneListener: PotentialEventListener, scrollDelta: number, overlay: HTMLDivElement, target: Vector): void {
    let imageRect: ClientRect = image.getBoundingClientRect();
    let imagePosition: Vector = positionFrom(imageRect);
    let imageSize: Vector = sizeFrom(imageRect);

    let resized: PotentialEventListener = addEventListener(window, 'resize', (): void => {
        imagePosition = positionFrom(wrapper.getBoundingClientRect());
        setBoundsPx(container.style, centreBounds(document, target, imageSize, imagePosition));
    });

    let removeDismissListeners: Function;

    function collapse(): void {
        removeDismissListeners();
        removeEventListener(window, 'resize', resized as EventListener);

        if (!isCloneLoaded(clone) && showCloneListener !== undefined) {
            removeEventListener(clone, 'load', showCloneListener);
        }

        showImage(image);
        hideClone(clone);

        unsetWrapperExpanded(wrapper);
        resetBounds(container.style);
        collapsed(overlay, wrapper, image);
    }

    removeDismissListeners = addDismissListeners(container, scrollDelta, collapse);

    setWrapperExpanded(wrapper);
    wrapper.style.height = pixels(image.height);
    activateImage(image);

    setBoundsPx(container.style, centreBounds(document, target, imageSize, imagePosition));
}

function zoomInstantWithoutClone(wrapper: HTMLElement, container: HTMLElement, image: HTMLImageElement, scrollDelta: number, overlay: HTMLDivElement, target: Vector): void {
    let imageRect: ClientRect = image.getBoundingClientRect();
    let imagePosition: Vector = positionFrom(imageRect);
    let imageSize: Vector = sizeFrom(imageRect);

    let resized: PotentialEventListener = addEventListener(window, 'resize', (): void => {
        imagePosition = positionFrom(wrapper.getBoundingClientRect());
        setBoundsPx(container.style, centreBounds(document, target, imageSize, imagePosition));
    });

    let removeDismissListeners: Function;

    function collapse(): void {
        removeDismissListeners();
        removeEventListener(window, 'resize', resized as EventListener);

        unsetWrapperExpanded(wrapper);
        resetBounds(container.style);
        collapsed(overlay, wrapper, image);
    }

    removeDismissListeners = addDismissListeners(container, scrollDelta, collapse);

    setWrapperExpanded(wrapper);
    wrapper.style.height = pixels(image.height);
    activateImage(image);

    setBoundsPx(container.style, centreBounds(document, target, imageSize, imagePosition));
}
function zoomTransitionWithClone(capabilities: WindowCapabilities, wrapper: HTMLElement, container: HTMLElement, image: HTMLImageElement, clone: HTMLImageElement, showCloneListener: PotentialEventListener, scrollDelta: number, overlay: HTMLDivElement, target: Vector): void {
    let imageRect: ClientRect = image.getBoundingClientRect();
    let imagePosition: Vector = positionFrom(imageRect);
    let imageSize: Vector = sizeFrom(imageRect);

    let resized: PotentialEventListener = addEventListener(window, 'resize', (): void => {
        imagePosition = positionFrom(wrapper.getBoundingClientRect());

        if (isWrapperTransitioning(wrapper)) {
            transformToCentre(target, imageSize, imagePosition, capabilities, container);
        } else {
            setBoundsPx(container.style, centreBounds(document, target, imageSize, imagePosition));
        }
    });

    let expandedListener: PotentialEventListener = undefined;
    let removeDismissListeners: Function;

    function collapse(): void {
        removeDismissListeners();
        removeEventListener(window, 'resize', resized as EventListener);

        if (!isCloneLoaded(clone) && showCloneListener !== undefined) {
            removeEventListener(clone, 'load', showCloneListener);
        }

        hideOverlay(overlay);
        startCollapsingWrapper(wrapper);

        let collapsedListener: PotentialEventListener = addEventListener(container, capabilities.transitionEndEvent as string, () => {
            if (collapsedListener !== undefined) {
                removeEventListener(container, capabilities.transitionEndEvent as string, collapsedListener);
            }

            showImage(image);
            hideClone(clone);

            collapsed(overlay, wrapper, image);
        });

        let style: any = container.style;

        if (isWrapperExpanding(wrapper)) {
            if (expandedListener !== undefined) {
                removeEventListener(container, capabilities.transitionEndEvent as string, expandedListener);
            }

            style[capabilities.transformProperty as string] = '';
            stopExpandingWrapper(wrapper);
        } else {
            ignoreTransitions(container, capabilities.transitionProperty as string, () => {
                transformToCentre(target, imageSize, imagePosition, capabilities, container);
            });

            style[capabilities.transformProperty as string] = '';
            resetBounds(container.style);
            unsetWrapperExpanded(wrapper);
        }

        if (collapsedListener === undefined) {
            showImage(image);
            hideClone(clone);

            collapsed(overlay, wrapper, image);
        }
    }

    function expanded() {
        if (isCloneLoaded(clone) && !isCloneVisible(clone)) {
            if (showCloneListener !== undefined) {
                removeEventListener(clone, capabilities.transitionEndEvent as string, showCloneListener);
            }

            showClone(clone);
            hideImage(image);
        }

        finishedExpanding(wrapper, container, target, imageSize, imagePosition, capabilities.transformProperty as string, capabilities.transitionProperty as string);
    }

    removeDismissListeners = addDismissListeners(container, scrollDelta, collapse);

    startExpandingWrapper(wrapper);
    wrapper.style.height = pixels(image.height);
    activateImage(image);

    expandedListener = addEventListener(container, capabilities.transitionEndEvent as string, () => {
        if (expandedListener !== undefined) {
            removeEventListener(container, capabilities.transitionEndEvent as string, expandedListener);
        }

        expanded();
    });

    if (expandedListener === undefined) {
        expanded();
    } else {
        transformToCentre(target, imageSize, imagePosition, capabilities, container);
    }
}

function zoomTransitionWithoutClone(capabilities: WindowCapabilities, wrapper: HTMLElement, container: HTMLElement, image: HTMLImageElement, scrollDelta: number, overlay: HTMLDivElement, target: Vector): void {
    let imageRect: ClientRect = image.getBoundingClientRect();
    let imagePosition: Vector = positionFrom(imageRect);
    let imageSize: Vector = sizeFrom(imageRect);

    let resized: PotentialEventListener = addEventListener(window, 'resize', (): void => {
        imagePosition = positionFrom(wrapper.getBoundingClientRect());

        if (isWrapperTransitioning(wrapper)) {
            transformToCentre(target, imageSize, imagePosition, capabilities, container);
        } else {
            setBoundsPx(container.style, centreBounds(document, target, imageSize, imagePosition));
        }
    });

    let expandedListener: PotentialEventListener = undefined;
    let removeDismissListeners: Function;

    function collapse(): void {
        removeDismissListeners();
        removeEventListener(window, 'resize', resized as EventListener);

        hideOverlay(overlay);
        startCollapsingWrapper(wrapper);

        let collapsedListener: PotentialEventListener = addEventListener(container, capabilities.transitionEndEvent as string, () => {
            if (collapsedListener !== undefined) {
                removeEventListener(container, capabilities.transitionEndEvent as string, collapsedListener);
            }

            collapsed(overlay, wrapper, image);
        });

        let style: any = container.style;

        if (isWrapperExpanding(wrapper)) {
            if (expandedListener !== undefined) {
                removeEventListener(container, capabilities.transitionEndEvent as string, expandedListener);
            }

            style[capabilities.transformProperty as string] = '';
            stopExpandingWrapper(wrapper);
        } else {
            ignoreTransitions(container, capabilities.transitionProperty as string, () => {
                transformToCentre(target, imageSize, imagePosition, capabilities, container);
            });

            style[capabilities.transformProperty as string] = '';
            resetBounds(container.style);
            unsetWrapperExpanded(wrapper);
        }

        if (collapsedListener === undefined) {
            collapsed(overlay, wrapper, image);
        }
    }

    removeDismissListeners = addDismissListeners(container, scrollDelta, collapse);

    startExpandingWrapper(wrapper);
    wrapper.style.height = pixels(image.height);
    activateImage(image);

    expandedListener = addEventListener(container, capabilities.transitionEndEvent as string, () => {
        if (expandedListener !== undefined) {
            removeEventListener(container, capabilities.transitionEndEvent as string, expandedListener);
        }

        finishedExpanding(wrapper, container, target, imageSize, imagePosition, capabilities.transformProperty as string, capabilities.transitionProperty as string);
    });

    if (expandedListener === undefined) {
        finishedExpanding(wrapper, container, target, imageSize, imagePosition, capabilities.transformProperty as string, capabilities.transitionProperty as string);
    } else {
        transformToCentre(target, imageSize, imagePosition, capabilities, container);
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

    let originalSrc: string = image.src;
    let fullSrc: string | null = wrapper.getAttribute('data-src');
    let actualSrc: string = fullSrc === null ? originalSrc : fullSrc;

    if (event.metaKey || event.ctrlKey) {
        window.open(actualSrc, '_blank');
    } else {
        if (zoomListener !== undefined) {
            removeEventListener(document.body, 'click', zoomListener);
        }

        if (!isWrapper(wrapper)) {
            setWrapper(wrapper);
        }

        let capabilities: WindowCapabilities = capabilitiesOf(window);
        let transition: boolean = capabilities.hasTransform && capabilities.hasTransitions && capabilities.transitionEndEvent !== undefined;

        let overlay: HTMLDivElement = addOverlay(document);

        let container: HTMLElement;
        let clone: HTMLImageElement | undefined;

        let cloneRequired: boolean = fullSrc !== null && fullSrc !== originalSrc;
        let showCloneListener: PotentialEventListener;

        let target: Vector = targetDimensions(wrapper);

        if (previouslyZoomed) {
            container = image.parentElement as HTMLElement;

            if (cloneRequired) {
                clone = container.children.item(1) as HTMLImageElement;

                if (isCloneLoaded(clone)) {
                    if (!transition) {
                        showClone(clone);
                        hideImage(image);
                    }
                } else {
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

        if (transition) {
            if (cloneRequired) {
                zoomTransitionWithClone(capabilities, wrapper, container, image, clone as HTMLImageElement, showCloneListener, scrollDelta, overlay, target);
            } else {
                zoomTransitionWithoutClone(capabilities, wrapper, container, image, scrollDelta, overlay, target);
            }
        } else {
            if (cloneRequired) {
                zoomInstantWithClone(wrapper, container, image, clone as HTMLImageElement, showCloneListener, scrollDelta, overlay, target);
            } else {
                zoomInstantWithoutClone(wrapper, container, image, scrollDelta, overlay, target);
            }
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
