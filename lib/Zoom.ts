import {
    repaint,
    srcAttribute
} from './Element';
import {
    createClone,
    createDiv,
    scrollY,
    viewportHeight,
    viewportWidth
} from './Document';
import { listeners } from './EventListeners';
import {
    addTransitionEndListener,
    removeTransitionEndListener
} from './Transition';
import {
    transform,
    transformProperty
} from './Transform';
import { translate } from './Translate';

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

        if (transformProperty === undefined || event.metaKey || event.ctrlKey) {
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
    initialScrollY = scrollY();
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

    let style: CSSStyleDeclaration = container.style;

    if (state === 'expanding' || state === 'collapsing') {
        let offsetX: number = rect.left + (rect.width - scaledWidth) / 2;
        let offsetY: number = rect.top + (rect.height - scaledHeight) / 2;

        let translateX: number = (centreX - offsetX) / scale;
        let translateY: number = (centreY - offsetY) / scale;

        transform(container, `scale(${scale}) ${translate(translateX, translateY)}`);
    } else {
        transform(container, '');
        style.left = `${centreX - rect.left}px`;
        style.top = `${centreY - rect.top}px`;
        style.width = `${scaledWidth}px`;
        style.maxWidth = `${scaledWidth}px`;
        style.height = `${scaledHeight}px`;
    }
}

function resetScale(): void {
    let style: CSSStyleDeclaration = container.style;
    transform(container, '');
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
    overlay.classList.add('zoom__overlay--visible');
}

function hideOverlay(): void {
    overlay.classList.remove('zoom__overlay--visible');
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
    wrapper.classList.add('zoom--active');
    image.classList.add('zoom__element--active');
}

function deactivateZoom(): void {
    wrapper.classList.remove('zoom--active');
    image.classList.remove('zoom__element--active');
}

export function start(): void {
    listeners.add(document.body, 'click', zoomInListener);
}

export function stop(): void {
    listeners.remove(document.body, 'click', zoomInListener);
}
