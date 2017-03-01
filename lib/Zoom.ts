import {
    addClass,
    hasClass,
    removeClass,
    repaint,
    srcAttribute
} from './Element';
import {
    createClone,
    createDiv,
    pageScrollY,
    viewportHeight,
    viewportWidth
} from './Document';
import { listeners } from './EventListeners';
import {
    addTransitionEndListener,
    removeTransitionEndListener
} from './Transition';
import {
    translate,
    supportsTranslate3d,
    translate3d
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

let transform: string | null;
let hasTranslate3d: boolean;

let state: State = 'collapsed';
let loaded: boolean = false;
let initialScrollY: number;

let resizeListener: EventListener = (): void => {
    initialScrollY = pageScrollY();
    scaleContainer();
};

let scrollListener: EventListener = (): void => {
    if (Math.abs(initialScrollY - pageScrollY()) > SCROLL_Y_DELTA) {
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

        if (hasClass(targetWrapper, 'zoom--active')) {
            return;
        }

        let src: string = srcAttribute(targetWrapper, target);

        if (transform === undefined) {
            transform = vendorProperty(document.body, 'transform');
        }

        if (transform === null || event.metaKey || event.ctrlKey) {
            window.open(src, '_blank');
            return;
        }

        if (hasTranslate3d === undefined && transform !== null) {
            hasTranslate3d = supportsTranslate3d(transform);
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
    listeners.remove(clone, 'load', finishedLoadingClone);
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
    initialScrollY = pageScrollY();
    listeners.add(window, 'resize', resizeListener);
    listeners.add(window, 'scroll', scrollListener);
    listeners.add(document, 'keyup', keyboardListener);
    listeners.add(container, 'click', zoomOutListener);
}

function removeEventListeners(): void {
    listeners.remove(window, 'resize', resizeListener);
    listeners.remove(window, 'scroll', scrollListener);
    listeners.remove(document, 'keyup', keyboardListener);
    listeners.remove(container, 'click', zoomOutListener);
}

function addClone(src: string): void {
    clone = createClone(src);
    listeners.add(clone, 'load', finishedLoadingClone);
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
    let rect: ClientRect = wrapper.getBoundingClientRect();

    let targetWidth: number = Number(wrapper.getAttribute('data-width') || Infinity);
    let targetHeight: number = Number(wrapper.getAttribute('data-height') || Infinity);

    let scaleX: number = Math.min(viewportWidth(), targetWidth) / rect.width;
    let scaleY: number = Math.min(viewportHeight(), targetHeight) / rect.height;
    let scale: number = Math.min(scaleX, scaleY);

    let scaledWidth: number = rect.width * scale;
    let scaledHeight: number = rect.height * scale;

    let centreX: number = (viewportWidth() - scaledWidth) / 2;
    let centreY: number = (viewportHeight() - scaledHeight) / 2;

    let style: any = container.style;

    if (state === 'expanding' || state === 'collapsing') {
        let offsetX: number = rect.left + (rect.width - scaledWidth) / 2;
        let offsetY: number = rect.top + (rect.height - scaledHeight) / 2;

        let translateX: number = (centreX - offsetX) / scale;
        let translateY: number = (centreY - offsetY) / scale;

        let translation: string;

        if (hasTranslate3d) {
            translation = translate3d(translateX, translateY);
        } else {
            translation = translate(translateX, translateY);
        }

        console.log(`${transform}`);
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
    listeners.add(document.body, 'click', zoomInListener);
}

export function stop(): void {
    listeners.remove(document.body, 'click', zoomInListener);
}
