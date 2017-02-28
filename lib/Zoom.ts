import {
    addTransitionEndListener,
    createClone,
    createDiv,
    dimensions,
    fillViewportScale,
    removeTransitionEndListener,
    srcAttribute,
    translate,
    repaint
} from './Element';
import {
    scrollY,
    viewportHeight,
    viewportWidth
} from './Document';
import { Dimension } from './Dimension';

const transform: any = require('transform-property');
const eventListener: any = require('eventlistener');

const ESCAPE_KEY_CODE: number = 27;
const SCROLL_Y_DELTA: number = 50;

type State = 'collapsed' | 'expanding' | 'expanded' | 'collapsing';

let overlay: HTMLDivElement = createDiv('zoom__overlay');
let wrapper: HTMLElement;
let container: HTMLElement;
let image: HTMLImageElement;
let clone: HTMLImageElement;

let state: State = 'collapsed';
let loaded: boolean = false;
let initialScrollY: number;
let original: Dimension;

let resizeListener: EventListener = (): void => {
    scaleContainer();
};

let scrollListener: EventListener = (): void => {
    if (Math.abs(initialScrollY - scrollY()) > SCROLL_Y_DELTA) {
        hide();
    }
};

let keyboardListener: EventListener = (event: KeyboardEvent): void => {
    if (event.keyCode === ESCAPE_KEY_CODE) {
        hide();
    }
};

let zoomInListener: EventListener = (event: MouseEvent): void => {
    let target: EventTarget = event.target;

    if (target instanceof HTMLImageElement && target.classList.contains('zoom__element')) {
        let parent: HTMLElement | null = target.parentElement;
        if (parent === null) {
            return;
        }

        let grandParent: HTMLElement | null = parent.parentElement;
        if (grandParent === null) {
            return;
        }

        event.preventDefault();

        let containerExists: boolean = parent.classList.contains('zoom__container');
        let targetWrapper: HTMLElement = containerExists ? grandParent : parent;

        if (targetWrapper.classList.contains('zoom--active')) {
            return;
        }

        let src: string = srcAttribute(targetWrapper, target);

        if (transform === undefined || event.metaKey || event.ctrlKey) {
            window.open(src, '_blank');
            return;
        }

        wrapper = targetWrapper;

        if (containerExists) {
            useExistingContainer(parent, target);
        } else {
            addContainer(target);
            addClone(src);
        }

        show();
    }
};

let zoomOutListener: EventListener = (): void => {
    hide();
};

let finishedLoadingClone: EventListener = (): void => {
    eventListener.remove(clone, 'load', finishedLoadingClone);
    loaded = true;

    if (state === 'expanded') {
        showClone();
    }
};

let finishedExpandingContainer: EventListener = (): void => {
    state = 'expanded';

    removeTransitionEndListener(container, finishedExpandingContainer);
    repaintContainer();

    if (loaded) {
        showClone();
    }
};

let finishedCollapsingContainer: EventListener = (): void => {
    removeTransitionEndListener(container, finishedCollapsingContainer);
    removeOverlay();
    deactivateZoom();
};

function addContainer(target: HTMLImageElement): void {
    image = target.cloneNode(true) as HTMLImageElement;
    container = createDiv('zoom__container');
    container.appendChild(image);
    wrapper.replaceChild(container, target);
}

function useExistingContainer(parent: HTMLElement, target: HTMLImageElement): void {
    loaded = true;
    image = target;
    container = parent;
    clone = container.children.item(1) as HTMLImageElement;
}

function show(): void {
    freezeWrapperHeight();
    addOverlay();
    showOverlay();
    expandContainer();
    addEventListeners();
}

function hide(): void {
    loaded = false;

    removeEventListeners();
    collapseContainer();
    hideOverlay();
    hideClone();
    unfreezeWrapperHeight();
}

function freezeWrapperHeight(): void {
    wrapper.style.height = `${image.height}px`;
}

function unfreezeWrapperHeight(): void {
    wrapper.style.height = '';
}

function addEventListeners(): void {
    initialScrollY = scrollY();
    eventListener.add(window, 'resize', resizeListener);
    eventListener.add(window, 'scroll', scrollListener);
    eventListener.add(document, 'keyup', keyboardListener);
    eventListener.add(container, 'click', zoomOutListener);
}

function removeEventListeners(): void {
    eventListener.remove(window, 'resize', resizeListener);
    eventListener.remove(window, 'scroll', scrollListener);
    eventListener.remove(document, 'keyup', keyboardListener);
    eventListener.remove(container, 'click', zoomOutListener);
}

function addClone(src: string): void {
    clone = createClone(src);
    eventListener.add(clone, 'load', finishedLoadingClone);
    container.appendChild(clone);
}

function showClone(): void {
    image.classList.add('zoom__element--hidden');
    clone.classList.add('zoom__clone--visible');
}

function hideClone(): void {
    image.classList.remove('zoom__element--hidden');
    clone.classList.remove('zoom__clone--visible');
}

function repaintContainer(): void {
    container.style.transition = 'initial';
    scaleContainer();
    repaint(container);
    container.style.transition = '';
}

function scaleContainer(): void {
    let scale: number = fillViewportScale(wrapper, original);

    let scaledWidth: number = original.width * scale;
    let scaledHeight: number = original.height * scale;

    let centreX: number = (viewportWidth() - scaledWidth) / 2;
    let centreY: number = (viewportHeight() - scaledHeight) / 2;

    let style: CSSStyleDeclaration = container.style;

    if (state === 'expanding' || state === 'collapsing') {
        let offsetX: number = original.left + (original.width - scaledWidth) / 2;
        let offsetY: number = original.top + (original.height - scaledHeight) / 2;

        let translateX: number = (centreX - offsetX) / scale;
        let translateY: number = (centreY - offsetY) / scale;

        style[transform] = `scale(${scale}) ${translate(translateX, translateY)}`;
    } else {
        style[transform] = '';
        style.left = `${centreX - original.left}px`;
        style.top = `${centreY - original.top}px`;
        style.width = `${scaledWidth}px`;
        style.maxWidth = `${scaledWidth}px`;
        style.height = `${scaledHeight}px`;
    }
}

function addOverlay(): void {
    document.body.appendChild(overlay);
}

function removeOverlay(): void {
    document.body.removeChild(overlay);
}

function showOverlay(): void {
    repaint(overlay);
    overlay.classList.add('zoom__overlay--visible');
}

function hideOverlay(): void {
    overlay.classList.remove('zoom__overlay--visible');
    removeTransitionEndListener(container, finishedExpandingContainer);
}

function expandContainer(): void {
    state = 'expanding';

    original = dimensions(image);
    activateZoom();

    addTransitionEndListener(container, finishedExpandingContainer);
    scaleContainer();
}

function collapseContainer(): void {
    state = 'collapsing';

    addTransitionEndListener(container, finishedCollapsingContainer);
    repaintContainer();

    let style: CSSStyleDeclaration = container.style;
    style[transform] = '';
    style.left = '';
    style.top = '';
    style.width = '';
    style.maxWidth = '';
    style.height = '';
}

function activateZoom(): void {
    wrapper.classList.add('zoom--active');
    image.classList.add('zoom__element--active');
}

function deactivateZoom(): void {
    wrapper.classList.remove('zoom--active');
    image.classList.remove('zoom__element--active');
}

export function start(): void {
    eventListener.add(document.body, 'click', zoomInListener);
}

export function stop(): void {
    eventListener.remove(document.body, 'click', zoomInListener);
}
