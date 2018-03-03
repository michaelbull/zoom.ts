import { Features } from '../browser/Features';
import {
    resetStyle,
    setBounds
} from '../element/Element';
import { ScaleAndTranslate } from '../element/ScaleAndTranslate';
import { Bounds } from '../math/Bounds';
import { Vector2 } from '../math/Vector2';

export class Container {
    static readonly CLASS = 'zoom__container';

    static create(): Container {
        let element = document.createElement('div');
        element.className = Container.CLASS;
        return new Container(element);
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
        let transform = ScaleAndTranslate.centreOf(target, bounds);
        let transformProperty = features.transformProperty as string;

        let style: any = this.element.style;
        if (features.hasTransform3d) {
            style[transformProperty] = transform.toString3d();
        } else {
            style[transformProperty] = transform.toString2d();
        }
    }

    resetStyle(property: string): void {
        resetStyle(this.element.style, property);
    }
}
