import {
    srcAttribute,
    createOverlay,
    removeTransitionEndListener,
    fillViewportScale,
    translate,
    dimensions,
    repaint,
    addTransitionEndListener
} from './Element';
import {
    scrollY,
    viewportWidth,
    viewportHeight
} from './Document';
import { Dimension } from './Dimension';

const transform: any = require('transform-property');

const ESCAPE_KEY_CODE: number = 27;
const SCROLL_Y_DELTA: number = 50;

type State = 'collapsed' | 'expanding' | 'expanded' | 'collapsing';

let overlay: HTMLDivElement = createOverlay();
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
        event.preventDefault();

        if (transform && !event.metaKey && !event.ctrlKey) {
            zoomImage(target);
        } else {
            window.open(srcAttribute(target), '_blank');
        }
    }
};

let zoomOutListener: EventListener = (): void => {
    hide();
};

let finishedLoadingClone: EventListener = (): void => {
    clone.removeEventListener('load', finishedLoadingClone);
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
    zoomInactive();
    removeClone();
};

function zoomImage(element: HTMLImageElement): void {
    let parent: HTMLElement | null = element.parentElement;

    if (parent === null) {
        return;
    }

    let parentClasses: DOMTokenList = parent.classList;

    if (parentClasses.contains('zoom') && !parentClasses.contains('zoom--active')) {
        container = parent;
        image = element;
        original = dimensions(image);
        show();
    }
}

function show(): void {
    addClone();
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
}

function addEventListeners(): void {
    initialScrollY = scrollY();
    window.addEventListener('resize', resizeListener);
    window.addEventListener('scroll', scrollListener);
    document.addEventListener('keyup', keyboardListener);
    container.addEventListener('click', zoomOutListener);
}

function removeEventListeners(): void {
    window.removeEventListener('resize', resizeListener);
    window.removeEventListener('scroll', scrollListener);
    document.removeEventListener('keyup', keyboardListener);
    container.removeEventListener('click', zoomOutListener);
}

function addClone(): void {
    clone = document.createElement('img');
    clone.classList.add('zoom__clone');
    clone.addEventListener('load', finishedLoadingClone);
    clone.src = srcAttribute(image);
    container.appendChild(clone);
}

function removeClone(): void {
    container.removeChild(clone);
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
    let scale: number = fillViewportScale(container, original);

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
    zoomActive();
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

function zoomActive(): void {
    container.classList.add('zoom--active');
    image.classList.add('zoom__element--active');
}

function zoomInactive(): void {
    container.classList.remove('zoom--active');
    image.classList.remove('zoom__element--active');
}

export function start(): void {
    document.body.addEventListener('click', zoomInListener);
}
