import { Dimension } from './Dimension';
import {
    addTransitionEndListener,
    removeTransitionEndListener,
    repaint,
    scaleToMaxViewport,
    srcAttribute,
    translate
} from './Element';
import {
    viewportHeight,
    viewportWidth,
    scrollY
} from './Document';

const ESCAPE_KEY_CODE: number = 27;
const SCROLL_Y_DELTA: number = 70;
const TOUCH_Y_DELTA: number = 30;

export class Zoom {
    private readonly overlay: HTMLDivElement;
    private readonly container: HTMLElement;
    private readonly element: HTMLImageElement;
    private readonly original: Dimension;

    private initialScrollY: number;
    private initialTouchY: number;
    private transforming: boolean = false;
    private clone: HTMLImageElement;

    constructor(overlay: HTMLDivElement, container: HTMLElement, element: HTMLImageElement, original: Dimension) {
        this.overlay = overlay;
        this.container = container;
        this.element = element;
        this.original = original;
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

    private zoom(): void {
        let scale: number = scaleToMaxViewport(this.container, this.original);

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
            this.container.style.left = `${centreX - this.original.left}px`;
            this.container.style.top = `${centreY - this.original.top}px`;
            this.container.style.width = `${Math.round(scaledWidth)}px`;
            this.container.style.maxWidth = `${Math.round(scaledWidth)}px`;
            this.container.style.height = `${Math.round(scaledHeight)}px`;
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
        addTransitionEndListener(this.container, this.closeListener);
    }

    private expandContainer(): void {
        this.container.classList.add('zoom--active');
        addTransitionEndListener(this.container, this.finishedExpandingContainer);
        this.transforming = true;
        this.zoom();
    }

    private collapseContainer(): void {
        this.container.style.transition = 'initial';
        this.transforming = true;
        this.zoom();
        repaint(this.container);
        this.container.style.transition = '';

        this.container.style.transform = '';
        this.container.style.left = '';
        this.container.style.top = '';
        this.container.style.width = '';
        this.container.style.maxWidth = '';
        this.container.style.height = '';
    }

    private finishedExpandingContainer: EventListener = () => {
        this.container.style.transition = 'initial';
        this.transforming = false;
        this.zoom();
        repaint(this.container);
        this.container.style.transition = '';
        removeTransitionEndListener(this.container, this.finishedExpandingContainer);
    };

    private addClone(): void {
        this.clone = document.createElement('img');
        this.clone.classList.add('zoom__clone');

        this.clone.onload = (): any => {
            this.element.style.opacity = '0';
            this.container.appendChild(this.clone);
        };

        this.clone.src = srcAttribute(this.element);
    }

    private addEventListeners(): void {
        this.initialScrollY = scrollY();

        window.addEventListener('resize', this.resizeListener);
        window.addEventListener('scroll', this.scrollListener);
        document.addEventListener('keyup', this.keyboardListener);
        document.addEventListener('touchstart', this.touchStartListener);
        this.clone.addEventListener('click', this.clickListener);
    }

    private removeEventListeners(): void {
        window.removeEventListener('resize', this.resizeListener);
        window.removeEventListener('scroll', this.scrollListener);
        document.removeEventListener('keyup', this.keyboardListener);
        document.removeEventListener('touchstart', this.touchStartListener);
        document.removeEventListener('touchmove', this.touchMoveListener);
        this.clone.removeEventListener('click', this.clickListener);
    }

    private resizeListener: EventListener = () => {
        this.zoom();
    };

    private scrollListener: EventListener = () => {
        if (Math.abs(this.initialScrollY - scrollY()) > SCROLL_Y_DELTA) {
            this.hide();
        }
    };

    private closeListener: EventListener = () => {
        document.body.removeChild(this.overlay);
        this.element.style.opacity = '1';
        this.container.removeChild(this.clone);
        this.container.classList.remove('zoom--active');
        removeTransitionEndListener(this.container, this.closeListener);
    };

    private clickListener: EventListener = () => {
        this.hide();
    };

    private keyboardListener: EventListener = (event: KeyboardEvent) => {
        if (event.keyCode === ESCAPE_KEY_CODE) {
            this.hide();
        }
    };

    private touchStartListener: EventListener = (event: TouchEvent) => {
        this.initialTouchY = event.touches[0].pageY;
        event.target.addEventListener('touchmove', this.touchMoveListener);
    };

    private touchMoveListener: EventListener = (event: TouchEvent) => {
        if (Math.abs(event.touches[0].pageY - this.initialTouchY) > TOUCH_Y_DELTA) {
            this.hide();
        }
    };
}
