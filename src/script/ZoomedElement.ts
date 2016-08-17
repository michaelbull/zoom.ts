import {
    FULL_SRC_KEY,
    ZOOM_FUNCTION_KEY,
    ZOOM_IN_VALUE,
    ZOOM_OUT_VALUE
} from './Attributes';
import {
    OVERLAY_CLASS,
    OVERLAY_OPEN_CLASS,
    OVERLAY_TRANSITIONING_CLASS,
    WRAP_CLASS,
    ZOOMED_CLASS
} from './Classes';
import { Position } from './Position';
import { Zoomable } from './Zoomable';

export abstract class ZoomedElement {
    private static transformStyle(element: HTMLElement, style: string): void {
        element.style.webkitTransform = style;
        element.style.transform = style;
    }

    protected _element: Zoomable;
    protected _wrap: HTMLDivElement;
    protected _clone: Zoomable;
    protected _overlay: HTMLDivElement;

    constructor(element: Zoomable) {
        this._element = element;
    }

    zoom(): void {
        const element: Zoomable = this._element;
        const src: string = element.getAttribute(FULL_SRC_KEY) || element.currentSrc || element.src;

        this.zoomedIn(src);
        element.src = src;
    }

    close(): void {
        document.body.classList.remove(OVERLAY_OPEN_CLASS);
        document.body.classList.add(OVERLAY_TRANSITIONING_CLASS);

        ZoomedElement.transformStyle(this._element, '');
        ZoomedElement.transformStyle(this._wrap, '');

        if ('transition' in document.body.style) {
            const element: HTMLElement = this._element as HTMLElement;
            element.addEventListener('transitionend', this.disposeListener);
            element.addEventListener('webkitTransitionEnd', this.disposeListener);
        } else {
            this.dispose();
        }
    }

    dispose(): void {
        this._element.removeEventListener('transitioned', this.disposeListener);
        this._element.removeEventListener('webkitTransitionEnd', this.disposeListener);

        if (this._wrap && this._wrap.parentNode) {
            this._element.classList.remove(ZOOMED_CLASS);
            this._element.style.width = '';
            this._element.setAttribute(ZOOM_FUNCTION_KEY, ZOOM_IN_VALUE);

            this._clone.parentNode.replaceChild(this._element, this._clone);
            this._wrap.parentNode.removeChild(this._wrap);
            this._overlay.parentNode.removeChild(this._overlay);

            document.body.classList.remove(OVERLAY_TRANSITIONING_CLASS);
            this.disposed();
        }
    }

    protected abstract zoomedIn(src: string): void;
    protected abstract disposed(): void;
    protected abstract width(): number;

    protected zoomOriginal(width: number, height: number): void {
        this._wrap = document.createElement('div');
        this._wrap.className = WRAP_CLASS;
        this._wrap.style.position = 'absolute';

        const position: Position = Position.of(this._element);
        this._wrap.style.top = position._top + 'px';
        this._wrap.style.left = position._left + 'px';

        this._clone = this._element.cloneNode() as Zoomable;
        this._clone.style.visibility = 'hidden';

        this._element.style.width = this._element.offsetWidth + 'px';
        this._element.parentNode.replaceChild(this._clone, this._element);

        document.body.appendChild(this._wrap);
        this._wrap.appendChild(this._element);

        this._element.classList.add(ZOOMED_CLASS);
        this._element.setAttribute(ZOOM_FUNCTION_KEY, ZOOM_OUT_VALUE);

        this._overlay = document.createElement('div');
        this._overlay.className = OVERLAY_CLASS;

        document.body.appendChild(this._overlay);

        ZoomedElement.transformStyle(this._element, this.scale(width, height));
        ZoomedElement.transformStyle(this._wrap, this.translate());

        document.body.classList.add(OVERLAY_OPEN_CLASS);
    }

    private repaint(): void {
        /* tslint:disable */
        this._element.offsetWidth;
        /* tslint:enable */
    }

    private scale(width: number, height: number): string {
        this.repaint();

        const maxFactor: number = width / this.width();
        const aspectRatio: number = width / height;

        const viewportWidth: number = window.innerWidth;
        const viewportHeight: number = window.innerHeight;
        const viewportAspectRatio: number = viewportWidth / viewportHeight;

        let factor: number;

        if (width < viewportWidth && height < viewportHeight) {
            factor = maxFactor;
        } else if (aspectRatio < viewportAspectRatio) {
            factor = (viewportHeight / height) * maxFactor;
        } else {
            factor = (viewportWidth / width) * maxFactor;
        }

        return 'scale(' + factor + ')';
    }

    private translate(): string {
        this.repaint();

        const viewportX: number = window.innerWidth / 2;
        const viewportY: number = window.scrollY + (window.innerHeight / 2);

        const position: Position = Position.of(this._element);
        const mediaCenterX: number = position._left + ((this._element.width || this._element.offsetWidth) / 2);
        const mediaCenterY: number = position._top + ((this._element.height || this._element.offsetHeight) / 2);

        const translateX: number = Math.round(viewportX - mediaCenterX);
        const translateY: number = Math.round(viewportY - mediaCenterY);

        return 'translate(' + translateX + 'px, ' + translateY + 'px) translateZ(0)';
    }

    private disposeListener: EventListener = () => {
        this.dispose();
    };
}
