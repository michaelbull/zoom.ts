import {
    FULL_SRC_KEY,
    ZOOM_FUNCTION_KEY,
    ZOOM_IN_VALUE,
    ZOOM_OUT_VALUE
} from './Attributes';
import {
    OVERLAY_LOADING_CLASS,
    OVERLAY_OPEN_CLASS,
    OVERLAY_TRANSITIONING_CLASS,
    WRAP_CLASS
} from './Classes';
import { Zoomable } from './Zoomable';

export abstract class ZoomedElement {
    private static transformStyle(element: HTMLElement, style: string): void {
        element.style.webkitTransform = style;
        element.style.transform = style;
    }

    protected _element: Zoomable;
    protected _fullSrc: string;
    protected _wrap: HTMLDivElement;

    constructor(element: Zoomable) {
        this._element = element;
        this._fullSrc = element.getAttribute(FULL_SRC_KEY) || element.currentSrc || element.src;
    }

    open(): void {
        document.body.classList.add(OVERLAY_LOADING_CLASS);

        this.zoomedIn();
        this._element.src = this._fullSrc;

        if ('transition' in document.body.style) {
            const element: HTMLElement = this._element as HTMLElement;
            element.addEventListener('transitionend', this.openedListener);
            element.addEventListener('webkitTransitionEnd', this.openedListener);
        } else {
            this.opened();
        }
    }

    close(): void {
        document.body.classList.remove(OVERLAY_OPEN_CLASS);
        document.body.classList.add(OVERLAY_TRANSITIONING_CLASS);

        ZoomedElement.transformStyle(this._element, '');
        ZoomedElement.transformStyle(this._wrap, '');

        if ('transition' in document.body.style) {
            const element: HTMLElement = this._element as HTMLElement;
            element.addEventListener('transitionend', this.closedListener);
            element.addEventListener('webkitTransitionEnd', this.closedListener);
        } else {
            this.closed();
        }
    }

    protected abstract zoomedIn(): void;

    protected abstract disposed(): void;

    protected abstract width(): number;

    protected loaded(width: number, height: number): void {
        document.body.classList.remove(OVERLAY_LOADING_CLASS);
        document.body.classList.add(OVERLAY_TRANSITIONING_CLASS);
        document.body.classList.add(OVERLAY_OPEN_CLASS);

        this._wrap = document.createElement('div');
        this._wrap.className = WRAP_CLASS;

        this._element.parentNode.insertBefore(this._wrap, this._element);
        this._wrap.appendChild(this._element);

        this._element.setAttribute(ZOOM_FUNCTION_KEY, ZOOM_OUT_VALUE);

        this.scale(width, height);
        this.translate();
    }

    private repaint(): void {
        /* tslint:disable */
        this._element.offsetWidth;
        /* tslint:enable */
    }

    private scale(width: number, height: number): void {
        this.repaint();

        const maxScaleFactor: number = width / this.width();
        const aspectRatio: number = width / height;

        const viewportWidth: number = window.innerWidth || document.documentElement.clientWidth || 0;
        const viewportHeight: number = window.innerHeight || document.documentElement.clientHeight || 0;
        const viewportAspectRatio: number = viewportWidth / viewportHeight;

        let scaleFactor: number;

        if (width < viewportWidth && height < viewportHeight) {
            scaleFactor = maxScaleFactor;
        } else if (aspectRatio < viewportAspectRatio) {
            scaleFactor = (viewportHeight / height) * maxScaleFactor;
        } else {
            scaleFactor = (viewportWidth / width) * maxScaleFactor;
        }

        ZoomedElement.transformStyle(this._element, 'scale(' + scaleFactor + ')');
    }

    private translate(): void {
        this.repaint();

        const scrollTop: number = window.pageYOffset || document.documentElement.scrollTop || 0;
        const scrollLeft: number = window.pageXOffset || document.documentElement.scrollLeft || 0;

        const viewportWidth: number = window.innerWidth || document.documentElement.clientWidth || 0;
        const viewportHeight: number = window.innerHeight || document.documentElement.clientHeight || 0;

        const viewportX: number = viewportWidth / 2;
        const viewportY: number = scrollTop + (viewportHeight / 2);

        const rect: ClientRect = this._element.getBoundingClientRect();
        const centerX: number = rect.left + scrollLeft + ((this._element.width || this._element.offsetWidth) / 2);
        const centerY: number = rect.top + scrollTop + ((this._element.height || this._element.offsetHeight) / 2);

        const x: number = Math.round(viewportX - centerX);
        const y: number = Math.round(viewportY - centerY);

        ZoomedElement.transformStyle(this._wrap, 'translate(' + x + 'px, ' + y + 'px) translateZ(0)');
    }

    private opened(): void {
        this._element.removeEventListener('transitionend', this.openedListener);
        this._element.removeEventListener('webkitTransitionEnd', this.openedListener);

        document.body.classList.remove(OVERLAY_TRANSITIONING_CLASS);
    }

    private closed(): void {
        this._element.removeEventListener('transitionend', this.closedListener);
        this._element.removeEventListener('webkitTransitionEnd', this.closedListener);

        if (this._wrap && this._wrap.parentNode) {
            this._element.setAttribute(ZOOM_FUNCTION_KEY, ZOOM_IN_VALUE);

            this._wrap.parentNode.replaceChild(this._element, this._wrap);

            document.body.classList.remove(OVERLAY_TRANSITIONING_CLASS);
            this.disposed();
        }
    }

    private openedListener: EventListener = () => {
        this.opened();
    };

    private closedListener: EventListener = () => {
        this.closed();
    };
}
