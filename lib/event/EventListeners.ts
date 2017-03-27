import {
    createDiv,
    viewportDimensions
} from '../Document';
import {
    createClone,
    isCloneLoaded,
    isCloneVisible,
    setCloneVisible,
    unsetCloneVisible
} from '../element/Clone';
import {
    isContainer,
    refreshContainer
} from '../element/Container';
import { targetDimensions } from '../element/Element';
import {
    isZoomable,
    setImageActive,
    setImageHidden,
    unsetImageActive,
    unsetImageHidden
} from '../element/Image';
import {
    createOverlay,
    hideOverlay
} from '../element/Overlay';
import {
    resetBounds,
    resetTransformation,
    scaleAndTranslate,
    setBoundsPx,
    setHeightPx,
    transform,
    unsetHeight
} from '../element/Style';
import {
    isWrapperExpanded,
    isWrapperExpanding,
    isWrapperTransitioning,
    resolveSrc,
    setWrapperCollapsing,
    setWrapperExpanded,
    setWrapperExpanding,
    unsetWrapperCollapsing,
    unsetWrapperExpanded,
    unsetWrapperExpanding
} from '../element/Wrapper';
import {
    calculateScale,
    centrePosition,
    divideMatrices,
    Matrix,
    minimizeMatrices,
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
    addZoomListener,
    removeZoomListener
} from '../Zoom';
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

export function cloneLoaded(wrapper: HTMLElement, image: HTMLImageElement, clone: HTMLImageElement): EventListener {
    let listener: EventListener = (): void => {
        removeEventListener(clone, 'load', listener);

        if (isWrapperExpanded(wrapper) && !isCloneVisible(clone)) {
            setImageHidden(image);
            setCloneVisible(clone);
        }
    };

    return listener;
}

export function createZoomInListener(window: Window, scrollToDismiss: number): EventListener {
    return (event: MouseEvent): void => {
        if (!isZoomable(event.target)) {
            return;
        }

        event.preventDefault();

        let image: HTMLImageElement = event.target as HTMLImageElement;

        let parent: HTMLElement | null = image.parentElement;
        if (parent === null) {
            return;
        }

        let containerExists: boolean = isContainer(parent);
        let wrapper: HTMLElement = parent;

        if (containerExists) {
            let grandParent: HTMLElement | null = parent.parentElement;
            if (grandParent === null) {
                return;
            }

            wrapper = grandParent;
        }

        let src: string = resolveSrc(wrapper, image);
        let document: Document = window.document;
        let body: HTMLElement = document.body;
        let transformProperty: string | null = vendorProperty(body.style, 'transform');

        if (transformProperty === null || event.metaKey || event.ctrlKey) {
            window.open(src, '_blank');
            return;
        }

        let container: HTMLElement;
        let clone: HTMLImageElement;
        let showClone: EventListener | null = null;

        if (containerExists) {
            container = parent;
            clone = container.children.item(1) as HTMLImageElement;
        } else {
            container = createDiv(document, 'zoom__container');
            clone = createClone(document, src);

            showClone = cloneLoaded(wrapper, image, clone);
            addEventListener(clone, 'load', showClone);

            wrapper.replaceChild(container, image);
            container.appendChild(image);
            container.appendChild(clone);
        }

        let use3d: boolean = false;
        if (transformProperty !== null) {
            use3d = hasTranslate3d(window, transformProperty);
        }

        let overlay: HTMLDivElement = createOverlay(window.document);
        let target: Matrix = targetDimensions(wrapper);
        let imageRect: ClientRect = image.getBoundingClientRect();
        let imagePosition: Matrix = positionOf(imageRect);
        let imageSize: Matrix = sizeOf(imageRect);

        let freezeContainer: Function = (): void => {
            let viewport: Matrix = viewportDimensions(document);
            let actualTarget: Matrix = minimizeMatrices(viewport, target);
            let scales: Matrix = divideMatrices(actualTarget, imageSize);
            let factor: number = Math.min(scales[0], scales[1]);
            let scaled: Matrix = multiplyMatrix(imageSize, factor);
            let newPosition: Matrix = centrePosition(viewport, scaled, imagePosition);
            resetTransformation(container.style);
            setBoundsPx(container.style, newPosition, scaled);
        };

        let scaleAndTranslateContainer: Function = (): void => {
            let viewport: Matrix = viewportDimensions(document);
            let factor: number = calculateScale(viewport, target, imageSize);
            let translation: Matrix = translateToCentre(viewport, imageSize, imagePosition, factor);
            let transformation: string = scaleAndTranslate(factor, translation, use3d);
            transform(container.style, transformation);
        };

        let recalculateScale: Function = (): void => {
            if (isWrapperTransitioning(wrapper)) {
                scaleAndTranslateContainer();
            } else {
                freezeContainer();
            }
        };

        let expanded: EventListener = (): void => {
            removeTransitionEndListener(container, expanded);
            unsetWrapperExpanding(wrapper);
            setWrapperExpanded(wrapper);
            refreshContainer(container, () => freezeContainer());

            if (isCloneLoaded(clone) && !isCloneVisible(clone)) {
                if (showClone !== null) {
                    removeTransitionEndListener(container, showClone);
                }

                setImageHidden(image);
                setCloneVisible(clone);
            }
        };

        let removeListeners: Function;

        let collapse: Function = (): void => {
            removeListeners();

            if (isWrapperExpanding(wrapper)) {
                removeTransitionEndListener(container, expanded);
                unsetWrapperExpanding(wrapper);
            }

            if (!isCloneLoaded(clone) && showClone !== null) {
                removeEventListener(clone, 'load', showClone);
            }

            unsetWrapperExpanded(wrapper);
            setWrapperCollapsing(wrapper);

            let collapsed: EventListener = (): void => {
                removeTransitionEndListener(container, collapsed);

                window.document.body.removeChild(overlay);
                unsetWrapperCollapsing(wrapper);
                unsetHeight(wrapper.style);
                unsetImageHidden(image);
                unsetImageActive(image);

                if (isCloneVisible(clone)) {
                    unsetCloneVisible(clone);
                }

                addZoomListener(window);
            };

            addTransitionEndListener(window, container, collapsed);
            refreshContainer(container, () => recalculateScale());

            resetTransformation(container.style);
            resetBounds(container.style);
            hideOverlay(overlay);
        };

        let pressedEsc: EventListener = escKeyPressed(collapse);
        let dismissed: EventListener = (): void => collapse();
        let resized: EventListener = (): void => recalculateScale();
        let scolledPast: EventListener = scrolled(pageScrollY(window), scrollToDismiss, collapse, () => {
            return pageScrollY(window);
        });

        removeListeners = (): void => {
            removeEventListener(window.document, 'keyup', pressedEsc);
            removeEventListener(container, 'click', dismissed);
            removeEventListener(window, 'scroll', scolledPast);
            removeEventListener(window, 'resize', resized);
        };

        removeZoomListener(window);

        setWrapperExpanding(wrapper);
        setImageActive(image);
        setHeightPx(wrapper.style, image.height);

        addTransitionEndListener(window, container, expanded);
        scaleAndTranslateContainer();

        addEventListener(window.document, 'keyup', pressedEsc);
        addEventListener(container, 'click', dismissed);
        addEventListener(window, 'scroll', scolledPast);
        addEventListener(window, 'resize', resized);
    };
}
