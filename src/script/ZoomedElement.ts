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

const wrap: HTMLDivElement = document.createElement('div');
wrap.className = WRAP_CLASS;

export abstract class ZoomedElement {
    private static transformStyle(element: HTMLElement, style: string): void {
        element.style.webkitTransform = style;
        element.style.transform = style;
    }

    private static addTransitionEndListener(element: HTMLElement, listener: EventListener): void {
        if ('transition' in document.body.style) {
            element.addEventListener('transitionend', listener);
            element.addEventListener('webkitTransitionEnd', listener);
        } else {
            listener(undefined);
        }
    }

    private static removeTransitionEndListener(element: HTMLElement, listener: EventListener): void {
        element.removeEventListener('transitionend', listener);
        element.removeEventListener('webkitTransitionEnd', listener);
    }

    private static scrollOffsets(): [number, number] {
        const documentElement: HTMLElement = document.documentElement;
        return [
            window.pageXOffset || documentElement.scrollLeft || 0,
            window.pageYOffset || documentElement.scrollTop || 0
        ];
    }

    private static viewportDimensions(): [number, number] {
        const documentElement: HTMLElement = document.documentElement;
        return [
            window.innerWidth || documentElement.clientWidth || 0,
            window.innerHeight || documentElement.clientHeight || 0
        ];
    }

    protected _fullSrc: string;
    private _element: Zoomable;

    constructor(element: Zoomable) {
        this._fullSrc = element.getAttribute(FULL_SRC_KEY) || element.currentSrc || element.src;
        this._element = element;
    }

    open(): void {
        document.body.classList.add(OVERLAY_LOADING_CLASS);

        this.zoomedIn();
        this._element.src = this._fullSrc;

        ZoomedElement.addTransitionEndListener(this._element, this.openedListener);
    }

    close(): void {
        const bodyClassList: DOMTokenList = document.body.classList;
        bodyClassList.remove(OVERLAY_OPEN_CLASS);
        bodyClassList.add(OVERLAY_TRANSITIONING_CLASS);

        ZoomedElement.transformStyle(this._element, '');
        ZoomedElement.transformStyle(wrap, '');
        ZoomedElement.addTransitionEndListener(this._element, this.closedListener);
    }

    protected abstract zoomedIn(): void;

    protected abstract disposed(): void;

    protected abstract width(): number;

    protected loaded(width: number, height: number): void {
        const bodyClassList: DOMTokenList = document.body.classList;
        bodyClassList.remove(OVERLAY_LOADING_CLASS);
        bodyClassList.add(OVERLAY_TRANSITIONING_CLASS);
        bodyClassList.add(OVERLAY_OPEN_CLASS);

        this._element.parentNode.insertBefore(wrap, this._element);
        wrap.appendChild(this._element);

        this._element.setAttribute(ZOOM_FUNCTION_KEY, ZOOM_OUT_VALUE);

        this.scaleElement(width, height);
        this.translateWrap();
    }

    private repaint(): void {
        /* tslint:disable */
        this._element.offsetWidth;
        /* tslint:enable */
    }

    private scaleElement(width: number, height: number): void {
        this.repaint();

        const viewportDimensions: [number, number] = ZoomedElement.viewportDimensions();
        const viewportWidth: number = viewportDimensions[0];
        const viewportHeight: number = viewportDimensions[1];

        const viewportAspectRatio: number = viewportWidth / viewportHeight;

        const maxScaleFactor: number = width / this.width();
        const aspectRatio: number = width / height;

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

    private translateWrap(): void {
        this.repaint();

        const scrollOffsets: [number, number] = ZoomedElement.scrollOffsets();
        const scrollX: number = scrollOffsets[0];
        const scrollY: number = scrollOffsets[1];

        const viewportDimensions: [number, number] = ZoomedElement.viewportDimensions();
        const viewportWidth: number = viewportDimensions[0];
        const viewportHeight: number = viewportDimensions[1];

        const viewportX: number = viewportWidth / 2;
        const viewportY: number = scrollY + (viewportHeight / 2);

        const element: Zoomable = this._element;
        const rect: ClientRect = element.getBoundingClientRect();
        const centerX: number = rect.left + scrollX + ((element.width || element.offsetWidth) / 2);
        const centerY: number = rect.top + scrollY + ((element.height || element.offsetHeight) / 2);

        const x: number = Math.round(viewportX - centerX);
        const y: number = Math.round(viewportY - centerY);

        ZoomedElement.transformStyle(wrap, 'translate(' + x + 'px, ' + y + 'px) translateZ(0)');
    }

    private opened(): void {
        ZoomedElement.removeTransitionEndListener(this._element, this.openedListener);
        document.body.classList.remove(OVERLAY_TRANSITIONING_CLASS);
    }

    private closed(): void {
        ZoomedElement.removeTransitionEndListener(this._element, this.closedListener);

        if (wrap.parentNode) {
            this._element.setAttribute(ZOOM_FUNCTION_KEY, ZOOM_IN_VALUE);
            wrap.parentNode.replaceChild(this._element, wrap);
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
