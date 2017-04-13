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

export function translate(translation: Vector): string {
    return `translate(${translation[0]}px, ${translation[1]}px)`;
}

export function translate3d(translation: Vector): string {
    return `translate3d(${translation[0]}px, ${translation[1]}px, 0)`;
}

export function scale(amount: number): string {
    return `scale(${amount})`;
}

export function scale3d(amount: number): string {
    return `scale3d(${amount}, ${amount}, 1)`;
}

export interface ScaleAndTranslate {
    readonly scale: number;
    readonly translation: Vector;
}

export function scaleTranslate(transformation: ScaleAndTranslate): string {
    return `${scale(transformation.scale)} ${translate(transformation.translation)}`;
}

export function scaleTranslate3d(transformation: ScaleAndTranslate): string {
    return `${scale3d(transformation.scale)} ${translate3d(transformation.translation)}`;
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

export function expandToViewport(features: Features, element: HTMLElement, target: Vector, bounds: Bounds): void {
    let transformation: ScaleAndTranslate = centreTransformation(target, bounds);
    let style: any = element.style;

    if (features.hasTransform3d) {
        style[features.transformProperty as string] = scaleTranslate3d(transformation);
    } else {
        style[features.transformProperty as string] = scaleTranslate(transformation);
    }
}

export function supports3dTransformations(style: CSSStyleDeclaration): boolean {
    let perspectiveProperty: string | undefined = vendorProperty(style, 'perspective');

    if (perspectiveProperty !== undefined) {
        if ('WebkitPerspective' in style) {
            return testWebkitTransform3d();
        } else {
            return true;
        }
    }

    return false;
}

export const TEST3D_ID: string = 'test3d';
export const TEST3D_WIDTH: number = 4;
export const TEST3D_HEIGHT: number = 8;
export const TEST3D_STYLE: string = `` +
    `#${TEST3D_ID}{margin:0;padding:0;border:0;width:0;height:0}` +
    `@media (transform-3d),(-webkit-transform-3d){` +
    `#${TEST3D_ID}{width:${pixels(TEST3D_WIDTH)};height:${pixels(TEST3D_HEIGHT)}}` +
    `}`;

function testWebkitTransform3d(): boolean {
    let element: HTMLDivElement = document.createElement('div');
    element.id = TEST3D_ID;
    element.style.position = 'absolute'; // remove the test element from the document flow to avoid affecting document size

    let style: HTMLStyleElement = document.createElement('style');
    style.textContent = TEST3D_STYLE;

    let body: HTMLElement = document.body;
    body.appendChild(style);
    body.appendChild(element);

    let offsetWidth: number = element.offsetWidth;
    let offsetHeight: number = element.offsetHeight;

    body.removeChild(style);
    body.removeChild(element);

    return offsetWidth === TEST3D_WIDTH && offsetHeight === TEST3D_HEIGHT;
}
