import { viewportSize } from '../browser/Document';
import { Features } from '../browser/Features';
import { vendorProperty } from '../browser/Vendor';
import { pixels } from '../math/Unit';
import {
    centreTranslation,
    minimizeVectors,
    minimumDivisor,
    Vector
} from '../math/Vector';
import { Bounds } from './Bounds';

export const TRANSFORM_PROPERTIES: { [key: string]: string } = {
    'WebkitTransform': '-webkit-transform',
    'MozTransform': '-moz-transform',
    'msTransform': '-ms-transform',
    'OTransform': '-o-transform',
    'transform': 'transform'
};

export function translate(translation: Vector): string {
    return `translate(${translation[0]}px, ${translation[1]}px)`;
}

export function translate3d(translation: Vector): string {
    return `translate3d(${translation[0]}px, ${translation[1]}px, 0)`;
}

export function scaleBy(amount: number): string {
    return `scale(${amount})`;
}

export interface ScaleAndTranslate {
    readonly scale: number;
    readonly translation: Vector;
}

export function scaleTranslate(transformation: ScaleAndTranslate): string {
    return `${scaleBy(transformation.scale)} ${translate(transformation.translation)}`;
}

export function scaleTranslate3d(transformation: ScaleAndTranslate): string {
    return `${scaleBy(transformation.scale)} ${translate3d(transformation.translation)}`;
}

export function centreTransformation(target: Vector, bounds: Bounds): ScaleAndTranslate {
    let viewport: Vector = viewportSize(document);
    let cappedTarget: Vector = minimizeVectors(viewport, target);
    let scale: number = minimumDivisor(cappedTarget, bounds.size);
    let translation: Vector = centreTranslation(viewport, bounds, scale);

    return {
        scale,
        translation
    };
}

export function expandToViewport(capabilities: Features, element: HTMLElement, target: Vector, bounds: Bounds): void {
    let transformation: ScaleAndTranslate = centreTransformation(target, bounds);
    let style: any = element.style;

    if (capabilities.hasTranslate3d) {
        style[capabilities.transformProperty as string] = scaleTranslate3d(transformation);
    } else {
        style[capabilities.transformProperty as string] = scaleTranslate(transformation);
    }
}

export function supportsTranslate3d(transformProperty: string): boolean {
    let computeStyle: any = window.getComputedStyle;
    let property: string = TRANSFORM_PROPERTIES[transformProperty];

    if (typeof computeStyle === 'function' && property !== undefined) {
        let child: HTMLParagraphElement = document.createElement('p');
        (child.style as any)[transformProperty] = 'translate3d(1px,1px,1px)';

        document.body.appendChild(child);
        let value: string = computeStyle(child).getPropertyValue(property);
        document.body.removeChild(child);

        return value.length > 0 && value !== 'none';
    } else {
        return false;
    }
}

export function supports3dTransformations(): boolean {
    let body: HTMLElement = document.body;
    let bodyStyle: CSSStyleDeclaration = body.style;
    let perspectiveProperty: string | undefined = vendorProperty(bodyStyle, 'perspective');

    if (perspectiveProperty !== undefined) {

        // Account for Webkit false positive
        if ('WebkitPerspective' in bodyStyle) {
            const ID: string = 'test3d';
            const WIDTH: number = 4;
            const HEIGHT: number = 8;

            let element: HTMLParagraphElement = document.createElement('p');
            element.id = ID;

            let style: HTMLStyleElement = document.createElement('style');
            style.textContent = `@media (-webkit-transform-3d){#${ID}{width:${pixels(WIDTH)};height:${pixels(HEIGHT)};margin:0;padding:0;border:0}}`;

            body.appendChild(style);
            body.appendChild(element);

            let offsetWidth: number = element.offsetWidth;
            let offsetHeight: number = element.offsetHeight;

            body.removeChild(style);
            body.removeChild(element);

            return offsetWidth === WIDTH && offsetHeight === HEIGHT;
        } else {
            return true;
        }
    }

    return false;
}
