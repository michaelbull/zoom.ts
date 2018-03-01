import { createDiv } from '../browser/Document';
import { Features } from '../browser/Features';
import { pageScrollY } from '../browser/Window';
import { Config } from '../Config';
import { resetStyle } from '../element/Element';
import {
    escKeyPressed,
    scrolled
} from '../element/EventListeners';
import {
    centreTransformation,
    scaleTranslate,
    scaleTranslate3d
} from '../element/style/Transform';
import {
    Bounds,
    setBounds
} from '../math/Bounds';
import { Vector2 } from '../math/Vector2';

export class Container {
    static readonly CLASS = 'zoom__container';

    static create(): Container {
        let element = createDiv(Container.CLASS);
        return new Container(element);
    }

    static isContainer(element: HTMLElement): boolean {
        return element.classList.contains(Container.CLASS);
    }

    readonly element: HTMLElement;

    constructor(element: HTMLElement) {
        this.element = element;
    }

    parent(): HTMLElement {
        return this.element.parentElement as HTMLElement;
    }

    clone(): HTMLImageElement {
        return this.element.children.item(1) as HTMLImageElement;
    }

    setBounds(bounds: Bounds): void {
        bounds.applyTo(this.element.style);
    }

    resetBounds(): void {
        setBounds(this.element.style, '', '', '', '');
    }

    fillViewport(features: Features, target: Vector2, bounds: Bounds): void {
        let transform = centreTransformation(target, bounds);
        let transformProperty = features.transformProperty as string;

        let style: any = this.element.style;
        if (features.hasTransform3d) {
            style[transformProperty] = scaleTranslate3d(transform);
        } else {
            style[transformProperty] = scaleTranslate(transform);
        }
    }

    resetStyle(property: string): void {
        resetStyle(this.element, property);
    }

    addDismissListeners(config: Config, collapseListener: EventListener): () => void {
        let initialScrollY = pageScrollY();

        let escListener = escKeyPressed(document, collapseListener);
        let scrollListener = scrolled(window, initialScrollY, config.scrollDismissPx, pageScrollY, collapseListener);

        window.addEventListener('scroll', scrollListener);
        document.addEventListener('keyup', escListener);
        this.element.addEventListener('click', collapseListener);

        return (): void => {
            window.removeEventListener('scroll', scrollListener);
            document.removeEventListener('keyup', escListener);
            this.element.removeEventListener('click', collapseListener);
        };
    }
}
