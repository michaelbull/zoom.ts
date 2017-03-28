import { viewportDimensions } from './Document';
import {
    createClone,
    isCloneLoaded,
    isCloneVisible,
    setCloneVisible,
    unsetCloneVisible
} from './element/Clone';
import {
    createContainer,
    isContainer,
    refreshContainer
} from './element/Container';
import { targetDimensions } from './element/Element';
import {
    isZoomable,
    setImageActive,
    setImageHidden,
    unsetImageActive,
    unsetImageHidden
} from './element/Image';
import {
    createOverlay,
    hideOverlay
} from './element/Overlay';
import {
    resetBounds,
    resetTransformation,
    scaleAndTranslate,
    setBoundsPx,
    setHeightPx,
    transform,
    unsetHeight
} from './element/Style';
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
} from './element/Wrapper';
import {
    cloneLoaded,
    escKeyPressed,
    scrolled
} from './event/EventListeners';
import {
    addEventListener,
    removeEventListener
} from './event/Events';
import {
    addTransitionEndListener,
    removeTransitionEndListener
} from './event/TransitionEvents';
import {
    centrePosition,
    Matrix,
    minimizeMatrices,
    minimumScale,
    multiplyMatrix,
    positionOf,
    sizeOf,
    translateToCentre
} from './Matrix';
import { vendorProperty } from './Vendor';
import {
    hasTranslate3d,
    pageScrollY
} from './Window';

const SCROLL_Y_DELTA: number = 50;

export function addZoomListener(window: Window): void {
    let zoomListener: EventListener = (event: MouseEvent): void => {
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
            container = createContainer(document);
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
            let cappedTarget: Matrix = minimizeMatrices(viewport, target);
            let factor: number = minimumScale(cappedTarget, imageSize);

            let newSize: Matrix = multiplyMatrix(imageSize, factor);
            let newPosition: Matrix = centrePosition(viewport, newSize, imagePosition);
            resetTransformation(container.style);
            setBoundsPx(container.style, newPosition, newSize);
        };

        let scaleAndTranslateContainer: Function = (): void => {
            let viewport: Matrix = viewportDimensions(document);
            let cappedTarget: Matrix = minimizeMatrices(viewport, target);
            let factor: number = minimumScale(cappedTarget, imageSize);

            let translation: Matrix = translateToCentre(viewport, imageSize, imagePosition, factor);
            transform(container.style, scaleAndTranslate(factor, translation, use3d));
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

                addEventListener(window.document.body, 'click', zoomListener);
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
        let scolledPast: EventListener = scrolled(pageScrollY(window), SCROLL_Y_DELTA, collapse, () => {
            return pageScrollY(window);
        });

        removeListeners = (): void => {
            removeEventListener(window.document, 'keyup', pressedEsc);
            removeEventListener(container, 'click', dismissed);
            removeEventListener(window, 'scroll', scolledPast);
            removeEventListener(window, 'resize', resized);
        };

        removeEventListener(window.document.body, 'click', zoomListener);

        setWrapperExpanding(wrapper);
        setImageActive(image);
        setHeightPx(wrapper.style, image.height);

        addTransitionEndListener(window, container, expanded);
        if (!isWrapperExpanded(wrapper)) {
            scaleAndTranslateContainer();
        }

        addEventListener(window.document, 'keyup', pressedEsc);
        addEventListener(container, 'click', dismissed);
        addEventListener(window, 'scroll', scolledPast);
        addEventListener(window, 'resize', resized);
    };

    addEventListener(window.document.body, 'click', zoomListener);
}
