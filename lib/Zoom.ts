import {
    createClone,
    createDiv,
    pageScrollY,
    viewportHeight,
    viewportWidth
} from './Document';
import {
    addClass,
    hasClass,
    removeClass,
    repaint,
    srcAttribute
} from './Element';
import {
    addEventListener,
    removeEventListener
} from './Events';
import {
    addTransitionEndListener,
    removeTransitionEndListener
} from './Transition';
import {
    translate,
    translate3d,
    hasTranslate3d
} from './Translate';
import { vendorProperty } from './Vendor';

const ESCAPE_KEY_CODE: number = 27;
const SCROLL_Y_DELTA: number = 50;

type State = 'collapsed' | 'expanding' | 'expanded' | 'collapsing';

let overlay: HTMLDivElement = createDiv('zoom__overlay');
let wrapper: HTMLElement;
let container: HTMLElement;
let image: HTMLImageElement;
let clone: HTMLImageElement;

let rect: ClientRect;
let targetWidth: number;
let targetHeight: number;

let transform: string | null;
let useTranslate3d: boolean;

let state: State = 'collapsed';
let loaded: boolean = false;
let initialScrollY: number;

let resizeListener: EventListener = (): void => {
    initialScrollY = pageScrollY(window, document);
    rect = wrapper.getBoundingClientRect();
    scaleContainer();
};

let scrollListener: EventListener = (): void => {
    if (Math.abs(initialScrollY - pageScrollY(window, document)) > SCROLL_Y_DELTA) {
        hide();
    }
};

let keyboardListener: EventListener = (event: KeyboardEvent): void => {
    if (event.keyCode === ESCAPE_KEY_CODE) {
        hide();
    }
};

let zoomInListener: EventListener = (event: MouseEvent): void => {
    if (state !== 'collapsed') {
        return;
    }

    let target: EventTarget = event.target;

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

        if (transform === undefined) {
            transform = vendorProperty(document.body, 'transform');
        }

        if (transform === null || event.metaKey || event.ctrlKey) {
            window.open(src, '_blank');
            return;
        }

        if (useTranslate3d === undefined && transform !== null) {
            useTranslate3d = hasTranslate3d(document.body, transform);
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
    removeEventListener(clone, 'load', finishedLoadingClone);
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
    state = 'collapsed';

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
    setTargetSize();
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

function setTargetSize(): void {
    targetWidth = Number(wrapper.getAttribute('data-width') || Infinity);
    targetHeight = Number(wrapper.getAttribute('data-height') || Infinity);
}

function freezeWrapperHeight(): void {
    wrapper.style.height = `${image.height}px`;
}

function unfreezeWrapperHeight(): void {
    wrapper.style.height = '';
}

function addEventListeners(): void {
    initialScrollY = pageScrollY(window, document);
    addEventListener(window, 'resize', resizeListener);
    addEventListener(window, 'scroll', scrollListener);
    addEventListener(document, 'keyup', keyboardListener);
    addEventListener(container, 'click', zoomOutListener);
}

function removeEventListeners(): void {
    removeEventListener(window, 'resize', resizeListener);
    removeEventListener(window, 'scroll', scrollListener);
    removeEventListener(document, 'keyup', keyboardListener);
    removeEventListener(container, 'click', zoomOutListener);
}

function addClone(src: string): void {
    clone = createClone(src);
    addEventListener(clone, 'load', finishedLoadingClone);
    container.appendChild(clone);
}

function showClone(): void {
    addClass(image, 'zoom__element--hidden');
    addClass(clone, 'zoom__clone--visible');
}

function hideClone(): void {
    removeClass(image, 'zoom__element--hidden');
    removeClass(clone, 'zoom__clone--visible');
}

function repaintContainer(): void {
    container.style.transition = 'initial';
    scaleContainer();
    repaint(container);
    container.style.transition = '';
}

function scaleContainer(): void {
    let vWidth: number = viewportWidth(document);
    let vHeight: number = viewportHeight(document);

    let scaleX: number = Math.min(vWidth, targetWidth) / rect.width;
    let scaleY: number = Math.min(vHeight, targetHeight) / rect.height;
    let scale: number = Math.min(scaleX, scaleY);

    let scaledWidth: number = rect.width * scale;
    let scaledHeight: number = rect.height * scale;

    let centreX: number = (vWidth - scaledWidth) / 2;
    let centreY: number = (vHeight - scaledHeight) / 2;

    let style: any = container.style;

    if (state === 'expanding' || state === 'collapsing') {
        let offsetX: number = rect.left + (rect.width - scaledWidth) / 2;
        let offsetY: number = rect.top + (rect.height - scaledHeight) / 2;

        let translateX: number = (centreX - offsetX) / scale;
        let translateY: number = (centreY - offsetY) / scale;

        let translation: string;

        if (useTranslate3d) {
            translation = translate3d(translateX, translateY);
        } else {
            translation = translate(translateX, translateY);
        }

        style[transform as string] = `scale(${scale}) ${translation}`;
    } else {
        style[transform as string] = '';
        style.left = `${centreX - rect.left}px`;
        style.top = `${centreY - rect.top}px`;
        style.width = `${scaledWidth}px`;
        style.maxWidth = `${scaledWidth}px`;
        style.height = `${scaledHeight}px`;
    }
}

function resetScale(): void {
    let style: any = container.style;
    style[transform as string] = '';
    style.left = '';
    style.top = '';
    style.width = '';
    style.maxWidth = '';
    style.height = '';
}

function addOverlay(): void {
    document.body.appendChild(overlay);
}

function removeOverlay(): void {
    document.body.removeChild(overlay);
}

function showOverlay(): void {
    repaint(overlay);
    addClass(overlay, 'zoom__overlay--visible');
}

function hideOverlay(): void {
    removeClass(overlay, 'zoom__overlay--visible');
    removeTransitionEndListener(container, finishedExpandingContainer);
}

function expandContainer(): void {
    state = 'expanding';

    rect = wrapper.getBoundingClientRect();
    activateZoom();
    addTransitionEndListener(container, finishedExpandingContainer);
    scaleContainer();
}

function collapseContainer(): void {
    state = 'collapsing';

    addTransitionEndListener(container, finishedCollapsingContainer);
    repaintContainer();
    resetScale();
}

function activateZoom(): void {
    addClass(wrapper, 'zoom--active');
    addClass(image, 'zoom__element--active');
}

function deactivateZoom(): void {
    removeClass(wrapper, 'zoom--active');
    removeClass(image, 'zoom__element--active');
}

export function start(): void {
    addEventListener(document.body, 'click', zoomInListener);
}

export function stop(): void {
    addEventListener(document.body, 'click', zoomInListener);
}
