import {
    Bounds,
    Vector2
} from '../math';
import {
    applyBounds,
    Features,
    resetStyle,
    setBounds,
    transform,
    transform3d,
    transformToCentre
} from '../style';

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
        applyBounds(this.element.style, bounds);
    }

    resetBounds(): void {
        setBounds(this.element.style, '', '', '', '');
    }

    resetStyle(property: string): void {
        resetStyle(this.element.style, property);
    }

    fillViewport(features: Features, target: Vector2, bounds: Bounds): void {
        let transformation = transformToCentre(target, bounds);
        let transformProperty = features.transformProperty!;

        let style: any = this.element.style;
        if (features.transform3d) {
            style[transformProperty] = transform3d(transformation);
        } else {
            style[transformProperty] = transform(transformation);
        }
    }
}
