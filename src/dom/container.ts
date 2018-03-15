import { Features } from '../browser/features';
import { ScaleAndTranslate } from '../element/scale-and-translate';
import {
    resetStyle,
    setBounds
} from '../element/style';
import { Bounds } from '../math/bounds';
import { Vector2 } from '../math/vector2';

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

    clone(): HTMLImageElement {
        return this.element.children.item(1) as HTMLImageElement;
    }

    setBounds(bounds: Bounds): void {
        bounds.applyTo(this.element.style);
    }

    resetBounds(): void {
        setBounds(this.element.style, '', '', '', '');
    }

    resetStyle(property: string): void {
        resetStyle(this.element.style, property);
    }

    fillViewport(features: Features, target: Vector2, bounds: Bounds): void {
        let transform = ScaleAndTranslate.centreOf(target, bounds);
        let transformProperty = features.transformProperty!;

        let style: any = this.element.style;
        if (features.hasTransform3d) {
            style[transformProperty] = transform.toString3d();
        } else {
            style[transformProperty] = transform.toString2d();
        }
    }
}
