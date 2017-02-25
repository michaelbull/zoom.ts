import { Dimension } from './Dimension';
import {
    addTransitionEndListener,
    removeTransitionEndListener,
    repaint,
    fillViewportScale,
    srcAttribute,
    translate,
    dimensions
} from './Element';
import {
    viewportHeight,
    viewportWidth,
    scrollY
} from './Document';

const ESCAPE_KEY_CODE: number = 27;
const SCROLL_Y_DELTA: number = 50;

export class Zoom {
    private readonly overlay: HTMLDivElement;
    private readonly container: HTMLElement;
    private readonly element: HTMLImageElement;
    private readonly original: Dimension;

    private initialScrollY: number;
    private transforming: boolean = false;
    private clone: HTMLImageElement;

    constructor(overlay: HTMLDivElement, container: HTMLElement, element: HTMLImageElement) {
        this.overlay = overlay;
        this.container = container;
        this.element = element;
        this.original = dimensions(element);
    }

    show(): void {
        this.showOverlay();
        this.expandContainer();
        this.addClone();
        this.addEventListeners();
    }

    hide(): void {
        this.removeEventListeners();
        this.hideOverlay();
        this.collapseContainer();
    }

    private scaleContainer(): void {
        let scale: number = fillViewportScale(this.container, this.original);

        let scaledWidth: number = this.original.width * scale;
        let scaledHeight: number = this.original.height * scale;

        let centreX: number = (viewportWidth() - scaledWidth) / 2;
        let centreY: number = (viewportHeight() - scaledHeight) / 2;

        let offsetX: number = this.original.left + (this.original.width - scaledWidth) / 2;
        let offsetY: number = this.original.top + (this.original.height - scaledHeight) / 2;

        if (this.transforming) {
            let translateX: number = (centreX - offsetX) / scale;
            let translateY: number = (centreY - offsetY) / scale;
            this.container.style.transform = `scale(${scale}) ${translate(translateX, translateY)}`;
        } else {
            this.container.style.transform = '';

            this.clone.style.left = `${centreX - this.original.left}px`;
            this.clone.style.top = `${centreY - this.original.top}px`;
            this.clone.style.width = `${scaledWidth}px`;
            this.clone.style.maxWidth = `${scaledWidth}px`;
            this.clone.style.height = `${scaledHeight}px`;
        }
    }

    private showOverlay(): void {
        document.body.appendChild(this.overlay);
        repaint(this.overlay);
        this.overlay.classList.add('zoom__overlay--visible');
    }

    private hideOverlay(): void {
        this.overlay.classList.remove('zoom__overlay--visible');
        removeTransitionEndListener(this.container, this.finishedExpandingContainer);
    }

    private expandContainer(): void {
        this.container.classList.add('zoom--active');
        this.element.classList.add('zoom__element--active');
        addTransitionEndListener(this.container, this.finishedExpandingContainer);
        this.transforming = true;
        this.scaleContainer();
    }

    private finishedExpandingContainer: EventListener = () => {
        removeTransitionEndListener(this.container, this.finishedExpandingContainer);

        this.container.style.transition = 'initial';
        this.transforming = false;
        this.scaleContainer();
        repaint(this.container);
        this.container.style.transition = '';
    };

    private collapseContainer(): void {
        addTransitionEndListener(this.container, this.finishedCollapsingContainer);

        this.container.style.transition = 'initial';
        this.transforming = true;
        this.scaleContainer();
        repaint(this.container);
        this.container.style.transition = '';
        this.container.style.transform = '';

        this.clone.style.left = '';
        this.clone.style.top = '';
        this.clone.style.width = '';
        this.clone.style.maxWidth = '';
        this.clone.style.height = '';
    }

    private finishedCollapsingContainer: EventListener = () => {
        removeTransitionEndListener(this.container, this.finishedCollapsingContainer);

        document.body.removeChild(this.overlay);
        this.container.classList.remove('zoom--active');
        this.element.classList.remove('zoom__element--active');

        this.removeClone();
    };

    private addClone(): void {
        this.clone = document.createElement('img');
        this.clone.classList.add('zoom__clone');
        this.clone.addEventListener('load', this.finishedLoadingClone);
        this.clone.src = srcAttribute(this.element);
    }

    private finishedLoadingClone: EventListener = () => {
        this.container.appendChild(this.clone);
        this.element.style.opacity = '0';
    };

    private removeClone(): void {
        this.clone.removeEventListener('load', this.finishedLoadingClone);
        this.element.style.opacity = '';

        if (this.container.contains(this.clone)) {
            this.container.removeChild(this.clone);
        }
    }

    private addEventListeners(): void {
        this.initialScrollY = scrollY();

        window.addEventListener('resize', this.resizeListener);
        window.addEventListener('scroll', this.scrollListener);
        document.addEventListener('keyup', this.keyboardListener);
        this.container.addEventListener('click', this.clickListener);
    }

    private removeEventListeners(): void {
        window.removeEventListener('resize', this.resizeListener);
        window.removeEventListener('scroll', this.scrollListener);
        document.removeEventListener('keyup', this.keyboardListener);
        this.container.removeEventListener('click', this.clickListener);
    }

    private resizeListener: EventListener = () => {
        this.scaleContainer();
    };

    private scrollListener: EventListener = () => {
        if (Math.abs(this.initialScrollY - scrollY()) > SCROLL_Y_DELTA) {
            this.hide();
        }
    };

    private clickListener: EventListener = () => {
        this.hide();
    };

    private keyboardListener: EventListener = (event: KeyboardEvent) => {
        if (event.keyCode === ESCAPE_KEY_CODE) {
            this.hide();
        }
    };
}
