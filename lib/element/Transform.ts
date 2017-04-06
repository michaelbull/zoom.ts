import {
    centreTranslation,
    minimizeVectors,
    minimumDivisor,
    Vector
} from '../math/Vector';
import { viewportSize } from '../window/Document';
import { Bounds } from './Bounds';
import { WindowCapabilities } from '../window/WindowCapabilities';

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

export function centreTransformation(document: Document, target: Vector, bounds: Bounds): ScaleAndTranslate {
    let viewport: Vector = viewportSize(document);
    let cappedTarget: Vector = minimizeVectors(viewport, target);
    let scale: number = minimumDivisor(cappedTarget, bounds.size);
    let translation: Vector = centreTranslation(viewport, bounds, scale);

    return {
        scale,
        translation
    };
}

export function expandToViewport(element: HTMLElement, target: Vector, bounds: Bounds, capabilities: WindowCapabilities, document: Document) {
    let transformation: ScaleAndTranslate = centreTransformation(document, target, bounds);
    let style: any = element.style;

    if (capabilities.hasTranslate3d) {
        style[capabilities.transformProperty as string] = scaleTranslate3d(transformation);
    } else {
        style[capabilities.transformProperty as string] = scaleTranslate(transformation);
    }
}
