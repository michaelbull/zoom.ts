import {
    pageScrollY,
    rootElement
} from './Document';
import {
    activateZoom,
    createClone,
    createDiv,
    deactivateZoom,
    hasClass,
    hideClone,
    repaint,
    showClone,
    srcAttribute
} from './Element';
import {
    escapeKeyListener,
    scrollListener
} from './EventListeners';
import {
    addEventListener,
    removeEventListener
} from './Events';
import {
    hideOverlay,
    showOverlay
} from './Overlay';
import {
    freezeWrapperHeight,
    resetBounds,
    resetTransformation,
    setBoundsPx,
    transform,
    unfreezeWrapperHeight
} from './Style';
import {
    addTransitionEndListener,
    removeTransitionEndListener
} from './Transition';
import {
    hasTranslate3d,
    translate
} from './Translate';
import { vendorProperty } from './Vendor';

const SCROLL_Y_DELTA: number = 50;

const enum State {
    Collapsed,
    Expanding,
    Expanded,
    Collapsing
}

let overlay: HTMLDivElement;
let wrapper: HTMLElement;
let container: HTMLElement;
let image: HTMLImageElement;
let clone: HTMLImageElement;

let rect: ClientRect;
let targetWidth: number;
let targetHeight: number;

let useTranslate3d: boolean;

let state: State = State.Collapsed;
let loaded: boolean = false;
let initialScrollY: number;

let resizeListener: EventListener;
let scrolledListener: EventListener;
let keyboardListener: EventListener;
let zoomOutListener: EventListener;
let zoomInListener: EventListener;
let finishedExpandingContainer: EventListener;

let finishedLoadingClone: EventListener = (): void => {
    removeEventListener(clone, 'load', finishedLoadingClone);
    loaded = true;

    if (state === State.Expanded) {
        showClone(image, clone);
    }
};

function createResizeEventListener(window: Window): EventListener {
    return (): void => {
        initialScrollY = pageScrollY(window);
        rect = wrapper.getBoundingClientRect();
        scaleContainer(window.document);
    };
}

function createZoomInListener(window: Window): EventListener {
    return (event: MouseEvent): void => {
        let target: EventTarget = event.target;
        let document: Document = window.document;
        let body: HTMLElement = document.body;

        if (target instanceof HTMLImageElement && hasClass(target, 'zoom__element')) {
            let parent: HTMLElement | null = target.parentElement;
            if (parent === null) {
                return;
            }

            let grandParent: HTMLElement | null = parent.parentElement;
            if (grandParent === null) {
                return;
            }

            event.preventDefault();

            let containerExists: boolean = hasClass(parent, 'zoom__container');
            let targetWrapper: HTMLElement = containerExists ? grandParent : parent;

            let src: string = srcAttribute(targetWrapper, target);
            let transformProperty: string | null = vendorProperty(body.style, 'transform');

            if (transformProperty === null || event.metaKey || event.ctrlKey) {
                window.open(src, '_blank');
            } else {
                removeZoomListener(window);
                wrapper = targetWrapper;

                if (containerExists) {
                    useExistingContainer(parent, target);
                } else {
                    createContainer(document, target, src);
                }

                if (useTranslate3d === undefined && transformProperty !== null) {
                    useTranslate3d = hasTranslate3d(body, transformProperty);
                }

                show(window);
            }
        }
    };
}

function createZoomOutListener(window: Window): EventListener {
    return (): void => {
        hide(window);
    };
}

function createFinishedExpandingContainerListener(document: Document): EventListener {
    return (): void => {
        removeTransitionEndListener(container, finishedExpandingContainer);

        state = State.Expanded;
        refreshContainer(document);

        if (loaded) {
            showClone(image, clone);
        }
    };
}

function finishedCollapsingContainer(window: Window): EventListener {
    let listener: EventListener = (): void => {
        removeTransitionEndListener(container, listener);

        state = State.Collapsed;
        window.document.body.removeChild(overlay);
        deactivateZoom(wrapper, image);
        addZoomListener(window);
    };

    return listener;
}

function createContainer(document: Document, target: HTMLImageElement, src: string): void {
    image = target.cloneNode(true) as HTMLImageElement;
    container = createDiv(document, 'zoom__container');
    clone = createClone(document, src, finishedLoadingClone);

    container.appendChild(image);
    container.appendChild(clone);
    wrapper.replaceChild(container, target);
}

function useExistingContainer(parent: HTMLElement, target: HTMLImageElement): void {
    image = target;
    container = parent;
    clone = container.children.item(1) as HTMLImageElement;

    loaded = true;
}

function show(window: Window): void {
    if (overlay === undefined) {
        overlay = createDiv(document, 'zoom__overlay');
    }

    setTargetSize();
    freezeWrapperHeight(wrapper, image);
    showOverlay(window.document.body, overlay);
    expandContainer(window);
    addEventListeners(window);
}

function hide(window: Window): void {
    loaded = false;

    removeEventListeners(window);
    collapseContainer(window);
    hideOverlay(overlay);
    hideClone(image, clone);
    unfreezeWrapperHeight(wrapper);
}

function setTargetSize(): void {
    targetWidth = Number(wrapper.getAttribute('data-width') || Infinity);
    targetHeight = Number(wrapper.getAttribute('data-height') || Infinity);
}

function addEventListeners(window: Window): void {
    initialScrollY = pageScrollY(window);

    resizeListener = createResizeEventListener(window);
    keyboardListener = escapeKeyListener(() => hide(window));
    scrolledListener = scrollListener(initialScrollY, SCROLL_Y_DELTA, () => pageScrollY(window), () => hide(window));
    zoomOutListener = createZoomOutListener(window);

    addEventListener(window, 'resize', resizeListener);
    addEventListener(window, 'scroll', scrolledListener);
    addEventListener(window.document, 'keyup', keyboardListener);
    addEventListener(container, 'click', zoomOutListener);
}

function removeEventListeners(window: Window): void {
    removeEventListener(window, 'resize', resizeListener);
    removeEventListener(window, 'scroll', scrolledListener);
    removeEventListener(window.document, 'keyup', keyboardListener);
    removeEventListener(container, 'click', zoomOutListener);
}

export function scaleContainer(document: Document): void {
    let root: HTMLElement = rootElement(document);
    let viewportWidth: number = root.clientWidth;
    let viewportHeight: number = root.clientHeight;

    let x: number = rect.left;
    let y: number = rect.top;
    let width: number = rect.width;
    let height: number = rect.height;

    let scaleX: number = Math.min(viewportWidth, targetWidth) / width;
    let scaleY: number = Math.min(viewportHeight, targetHeight) / height;
    let scale: number = Math.min(scaleX, scaleY);

    let scaledWidth: number = width * scale;
    let scaledHeight: number = height * scale;

    let centreX: number = (viewportWidth - scaledWidth) / 2;
    let centreY: number = (viewportHeight - scaledHeight) / 2;

    let style: CSSStyleDeclaration = container.style;

    if (state === State.Expanding || state === State.Collapsing) {
        let offsetX: number = x + (width - scaledWidth) / 2;
        let offsetY: number = y + (height - scaledHeight) / 2;

        let translateX: number = (centreX - offsetX) / scale;
        let translateY: number = (centreY - offsetY) / scale;

        transform(style, `scale(${scale}) ${translate(translateX, translateY, useTranslate3d)}`);
    } else {
        resetTransformation(style);
        setBoundsPx(style, centreX - x, centreY - y, scaledWidth, scaledHeight);
    }
}

function expandContainer(window: Window): void {
    state = State.Expanding;

    rect = image.getBoundingClientRect();
    finishedExpandingContainer = createFinishedExpandingContainerListener(window.document);
    activateZoom(wrapper, image);
    addTransitionEndListener(window, container, finishedExpandingContainer);
    scaleContainer(window.document);
}

function refreshContainer(document: Document): void {
    let style: CSSStyleDeclaration = container.style;

    style.transition = 'initial';
    scaleContainer(document);
    repaint(container);
    style.transition = '';
}

function collapseContainer(window: Window): void {
    if (state === State.Expanding) {
        removeTransitionEndListener(container, finishedExpandingContainer);
    }

    if (!loaded) {
        removeEventListener(clone, 'load', finishedLoadingClone);
    }

    state = State.Collapsing;
    addTransitionEndListener(window, container, finishedCollapsingContainer(window));
    refreshContainer(window.document);

    resetTransformation(container.style);
    resetBounds(container.style);
}

export function addZoomListener(window: Window): void {
    zoomInListener = createZoomInListener(window);
    addEventListener(window.document.body, 'click', zoomInListener);
}

export function removeZoomListener(window: Window): void {
    removeEventListener(window.document.body, 'click', zoomInListener);
}
