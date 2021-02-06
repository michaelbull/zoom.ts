import { ContainerConfig } from '../config';
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
import { centreOf } from './document';
import { ignoreTransitions } from './element';

export class Container {
    static create(config: ContainerConfig, features: Features): Container {
        let element = document.createElement('div');
        element.className = config.classNames.base;
        return new Container(element, features);
    }

    readonly element: HTMLElement;
    private readonly features: Features;

    constructor(element: HTMLElement, features: Features) {
        this.element = element;
        this.features = features;
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

    addClickListener(listener: EventListenerOrEventListenerObject): void {
        this.element.addEventListener('click', listener);
    }

    removeClickListener(listener: EventListenerOrEventListenerObject): void {
        this.element.removeEventListener('click', listener);
    }

    addTransitionEndListener(listener: EventListenerOrEventListenerObject): void {
        let event = this.features.transitionEndEvent;

        if (event !== undefined) {
            this.element.addEventListener(event, listener);
        }
    }

    removeTransitionEndListener(listener: EventListenerOrEventListenerObject): void {
        let event = this.features.transitionEndEvent;

        if (event !== undefined) {
            this.element.removeEventListener(event, listener);
        }
    }

    fill(target: Vector2, bounds: Bounds): void {
        let transitionProperty = this.features.transitionProperty;
        if (transitionProperty === undefined) {
            return;
        }

        ignoreTransitions(this.element, transitionProperty, () => {
            this.fillViewport(this.features, target, bounds);
        });
    }

    expanded(target: Vector2, bounds: Bounds): void {
        let transitionProperty = this.features.transitionProperty;
        if (transitionProperty === undefined) {
            return;
        }

        ignoreTransitions(this.element, transitionProperty, () => {
            this.resetStyle(this.features.transformProperty!);
            this.setBounds(centreOf(document, target, bounds));
        });
    }
}
