import { viewportDimensions } from '../Document';
import {
    createClone,
    isCloneLoaded,
    isCloneVisible,
    showClone,
    hideClone
} from '../element/Clone';
import {
    createContainer,
    isContainer,
    refreshContainer,
    restoreContainer
} from '../element/Container';
import { targetDimensions } from '../element/Element';
import {
    isZoomable,
    activateImage,
    hideImage,
    showImage
} from '../element/Image';
import {
    createOverlay,
    hideOverlay,
    showOverlay
} from '../element/Overlay';
import {
    resetTransformation,
    scaleAndTranslate,
    setBoundsPx,
    transform
} from '../element/Style';
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
} from '../element/Wrapper';
import {
    centrePosition,
    Matrix,
    minimizeMatrices,
    minimumScale,
    multiplyMatrix,
    positionOf,
    sizeOf,
    translateToCentre
} from '../Matrix';
import { vendorProperty } from '../Vendor';
import {
    hasTranslate3d,
    pageScrollY
} from '../Window';
import {
    addEventListener,
    removeEventListener
} from './Events';
import {
    addTransitionEndListener,
    removeTransitionEndListener
} from './TransitionEvents';

export const ESCAPE_KEY_CODE: number = 27;

export function escKeyPressed(callback: Function): EventListener {
    return (event: KeyboardEvent): void => {
        if (event.keyCode === ESCAPE_KEY_CODE) {
            event.preventDefault();
            callback();
        }
    };
}

export function scrolled(start: number, minAmount: number, callback: Function, current: () => number): EventListener {
    return (): void => {
        if (Math.abs(start - current()) >= minAmount) {
            callback();
        }
    };
}

export function showLoadedClone(wrapper: HTMLElement, image: HTMLImageElement, clone: HTMLImageElement): EventListener {
    let listener: EventListener = (): void => {
        removeEventListener(clone, 'load', listener);

        if (isWrapperExpanded(wrapper) && !isCloneVisible(clone)) {
            hideImage(image);
            showClone(clone);
        }
    };

    return listener;
}

function setUp(document: Document, src: string, wrapper: HTMLElement, image: HTMLImageElement): EventListener {
    let container: HTMLElement = createContainer(document);
    let clone: HTMLImageElement = createClone(document, src);

    let showClone: EventListener = showLoadedClone(wrapper, image, clone);
    addEventListener(clone, 'load', showClone);

    wrapper.replaceChild(container, image);
    container.appendChild(image);
    container.appendChild(clone);
    return showClone;
}

// TODO: clean this up somehow
function zoom(window: Window, wrapper: HTMLElement, image: HTMLImageElement, transformProperty: string | null,
    showCloneListener: EventListener | null, zoomListener: EventListener, scrollY: number): void {

    let container: HTMLElement = image.parentElement as HTMLElement;
    let clone: HTMLImageElement = container.children.item(1) as HTMLImageElement;

    let target: Matrix = targetDimensions(wrapper);
    let imageRect: ClientRect = image.getBoundingClientRect();
    let imagePosition: Matrix = positionOf(imageRect);
    let imageSize: Matrix = sizeOf(imageRect);

    let use3d: boolean = transformProperty !== null && hasTranslate3d(window, transformProperty);

    function transformContainer(): void {
        let viewport: Matrix = viewportDimensions(window.document);
        let cappedTarget: Matrix = minimizeMatrices(viewport, target);
        let factor: number = minimumScale(cappedTarget, imageSize);

        let translation: Matrix = translateToCentre(viewport, imageSize, imagePosition, factor);
        transform(container.style, scaleAndTranslate(factor, translation, use3d));
    }

    function freezeContainer(): void {
        let viewport: Matrix = viewportDimensions(window.document);
        let cappedTarget: Matrix = minimizeMatrices(viewport, target);
        let factor: number = minimumScale(cappedTarget, imageSize);

        let newSize: Matrix = multiplyMatrix(imageSize, factor);
        let newPosition: Matrix = centrePosition(viewport, newSize, imagePosition);
        resetTransformation(container.style);
        setBoundsPx(container.style, newPosition, newSize);
    }

    function recalculateScale(): void {
        if (isWrapperTransitioning(wrapper)) {
            transformContainer();
        } else {
            freezeContainer();
        }
    }

    let expanded: EventListener = (): void => {
        removeTransitionEndListener(container, expanded);

        finishExpandingWrapper(wrapper);
        refreshContainer(container, freezeContainer);

        if (isCloneLoaded(clone) && !isCloneVisible(clone)) {
            if (showCloneListener !== null) {
                removeTransitionEndListener(container, showCloneListener);
            }

            hideImage(image);
            showClone(clone);
        }
    };

    let removeListeners: Function;
    let overlay: HTMLDivElement = createOverlay(window.document);

    function collapse(): void {
        removeListeners();

        if (isWrapperExpanding(wrapper)) {
            removeTransitionEndListener(container, expanded);
            stopExpandingWrapper(wrapper);
        }

        if (!isCloneLoaded(clone) && showCloneListener !== null) {
            removeEventListener(clone, 'load', showCloneListener);
        }

        let collapsed: EventListener = (): void => {
            removeTransitionEndListener(container, collapsed);

            window.document.body.removeChild(overlay);
            finishCollapsingWrapper(wrapper);
            showImage(image);
            hideClone(clone);
            addEventListener(window.document.body, 'click', zoomListener);
        };

        hideOverlay(overlay);
        collapseWrapper(wrapper);

        addTransitionEndListener(window, container, collapsed);
        refreshContainer(container, recalculateScale);
        restoreContainer(container);
    }

    let pressedEsc: EventListener = escKeyPressed(collapse);
    let dismissed: EventListener = (): void => collapse();
    let resized: EventListener = (): void => recalculateScale();
    let initialScrollY: number = pageScrollY(window);
    let scrolledAway: EventListener = scrolled(initialScrollY, scrollY, collapse, () => pageScrollY(window));

    removeListeners = (): void => {
        removeEventListener(window.document, 'keyup', pressedEsc);
        removeEventListener(container, 'click', dismissed);
        removeEventListener(window, 'scroll', scrolledAway);
        removeEventListener(window, 'resize', resized);
    };

    removeEventListener(window.document.body, 'click', zoomListener);

    window.document.body.appendChild(overlay);
    showOverlay(overlay);
    activateImage(image);
    expandWrapper(wrapper, image.height);

    addTransitionEndListener(window, container, expanded);
    if (!isWrapperExpanded(wrapper)) {
        transformContainer();
    }

    addEventListener(window.document, 'keyup', pressedEsc);
    addEventListener(container, 'click', dismissed);
    addEventListener(window, 'scroll', scrolledAway);
    addEventListener(window, 'resize', resized);
}

export function createZoomListener(window: Window, scrollY: number): EventListener {
    let listener: EventListener = (event: MouseEvent): void => {
        if (isZoomable(event.target)) {
            event.preventDefault();

            let image: HTMLImageElement = event.target as HTMLImageElement;
            let parent: HTMLElement = image.parentElement as HTMLElement;
            let grandParent: HTMLElement = parent.parentElement as HTMLElement;

            let alreadySetUp: boolean = isContainer(parent);
            let wrapper: HTMLElement = alreadySetUp ? grandParent : parent;

            let src: string = resolveSrc(wrapper, image);
            let transformProperty: string | null = vendorProperty(window.document.body.style, 'transform');

            if (transformProperty === null || event.metaKey || event.ctrlKey) {
                window.open(src, '_blank');
            } else {
                let loadClone: EventListener | null = alreadySetUp ? null : setUp(window.document, src, wrapper, image);
                zoom(window, wrapper, image, transformProperty, loadClone, listener, scrollY);
            }
        }
    };

    return listener;
}
