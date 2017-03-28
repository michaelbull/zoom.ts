import { viewportDimensions } from '../Document';
import {
    createClone,
    isCloneLoaded,
    isCloneVisible,
    setCloneVisible,
    unsetCloneVisible
} from '../element/Clone';
import {
    createContainer,
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
    hideOverlay,
    showOverlay
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

export function createZoomListener(window: Window, scrollY: number): EventListener {
    let document: Document = window.document;
    let body: HTMLElement = document.body;

    let listener: EventListener = (event: MouseEvent): void => {
        if (!isZoomable(event.target)) {
            return;
        }

        event.preventDefault();

        let image: HTMLImageElement = event.target as HTMLImageElement;
        let parent: HTMLElement = image.parentElement as HTMLElement;
        let wrapper: HTMLElement = parent;

        let alreadySetUp: boolean = isContainer(parent);
        if (alreadySetUp) {
            let grandParent: HTMLElement | null = parent.parentElement;
            if (grandParent === null) {
                return;
            }

            wrapper = grandParent;
        }

        let src: string = resolveSrc(wrapper, image);
        let transformProperty: string | null = vendorProperty(body.style, 'transform');

        if (transformProperty === null || event.metaKey || event.ctrlKey) {
            window.open(src, '_blank');
            return;
        }

        let container: HTMLElement;
        let clone: HTMLImageElement;
        let showClone: EventListener | null = null;

        if (alreadySetUp) {
            container = parent;
            clone = container.children.item(1) as HTMLImageElement;
        } else {
            container = createContainer(document);
            clone = createClone(document, src);

            showClone = cloneLoaded(wrapper, image, clone);
            addEventListener(clone, 'load', showClone);

            wrapper.replaceChild(container, image);
            container.appendChild(image);
            container.appendChild(clone);
        }

        let wrapperStyle: CSSStyleDeclaration = wrapper.style;
        let containerStyle: CSSStyleDeclaration = container.style;
        let target: Matrix = targetDimensions(wrapper);
        let imageRect: ClientRect = image.getBoundingClientRect();
        let imagePosition: Matrix = positionOf(imageRect);
        let imageSize: Matrix = sizeOf(imageRect);

        let use3d: boolean = transformProperty !== null && hasTranslate3d(window, transformProperty);
        let transformContainer: Function = (): void => {
            let viewport: Matrix = viewportDimensions(document);
            let cappedTarget: Matrix = minimizeMatrices(viewport, target);
            let factor: number = minimumScale(cappedTarget, imageSize);

            let translation: Matrix = translateToCentre(viewport, imageSize, imagePosition, factor);
            transform(containerStyle, scaleAndTranslate(factor, translation, use3d));
        };

        let freezeContainer: Function = (): void => {
            let viewport: Matrix = viewportDimensions(document);
            let cappedTarget: Matrix = minimizeMatrices(viewport, target);
            let factor: number = minimumScale(cappedTarget, imageSize);

            let newSize: Matrix = multiplyMatrix(imageSize, factor);
            let newPosition: Matrix = centrePosition(viewport, newSize, imagePosition);
            resetTransformation(containerStyle);
            setBoundsPx(containerStyle, newPosition, newSize);
        };

        let recalculateScale: Function = (): void => {
            if (isWrapperTransitioning(wrapper)) {
                transformContainer();
            } else {
                freezeContainer();
            }
        };

        let expanded: EventListener = (): void => {
            removeTransitionEndListener(container, expanded);
            unsetWrapperExpanding(wrapper);
            setWrapperExpanded(wrapper);
            refreshContainer(container, freezeContainer);

            if (isCloneLoaded(clone) && !isCloneVisible(clone)) {
                if (showClone !== null) {
                    removeTransitionEndListener(container, showClone);
                }

                setImageHidden(image);
                setCloneVisible(clone);
            }
        };

        let removeListeners: Function;
        let overlay: HTMLDivElement = createOverlay(document);

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

                body.removeChild(overlay);
                unsetWrapperCollapsing(wrapper);
                unsetHeight(wrapperStyle);
                unsetImageHidden(image);
                unsetImageActive(image);

                if (isCloneVisible(clone)) {
                    unsetCloneVisible(clone);
                }

                addEventListener(body, 'click', listener);
            };

            addTransitionEndListener(window, container, collapsed);
            refreshContainer(container, recalculateScale);

            resetTransformation(containerStyle);
            resetBounds(containerStyle);
            hideOverlay(overlay);
        };

        let pressedEsc: EventListener = escKeyPressed(collapse);
        let dismissed: EventListener = (): void => collapse();
        let resized: EventListener = (): void => recalculateScale();
        let initialScrollY: number = pageScrollY(window);
        let scolledPast: EventListener = scrolled(initialScrollY, scrollY, collapse, () => pageScrollY(window));

        removeListeners = (): void => {
            removeEventListener(document, 'keyup', pressedEsc);
            removeEventListener(container, 'click', dismissed);
            removeEventListener(window, 'scroll', scolledPast);
            removeEventListener(window, 'resize', resized);
        };

        removeEventListener(body, 'click', listener);

        body.appendChild(overlay);
        showOverlay(overlay);
        setWrapperExpanding(wrapper);
        setImageActive(image);
        setHeightPx(wrapperStyle, image.height);

        addTransitionEndListener(window, container, expanded);
        if (!isWrapperExpanded(wrapper)) {
            transformContainer();
        }

        addEventListener(document, 'keyup', pressedEsc);
        addEventListener(container, 'click', dismissed);
        addEventListener(window, 'scroll', scolledPast);
        addEventListener(window, 'resize', resized);
    };

    return listener;
}
