import { viewportSize } from '../window/Document';
import {
    centreTranslation,
    minimizeVectors,
    minimumDivisor,
    Vector
} from '../math/Vector';

export function translate(translation: Vector): string {
    return `translate(${translation[0]}px, ${translation[1]}px)`;
}

export function translate3d(translation: Vector): string {
    return `translate3d(${translation[0]}px, ${translation[1]}px, 0)`;
}

export function scaleBy(amount: number): string {
    return `scale(${amount})`;
}

export type ScaleAndTranslate = [number, Vector];

export function scaleTranslate(transformation: ScaleAndTranslate): string {
    return `${scaleBy(transformation[0])} ${translate(transformation[1])}`;
}

export function scaleTranslate3d(transformation: ScaleAndTranslate): string {
    return `${scaleBy(transformation[0])} ${translate3d(transformation[1])}`;
}

export function centreTransformation(document: Document, target: Vector, size: Vector, position: Vector): ScaleAndTranslate {
    let viewport: Vector = viewportSize(document);
    let cappedTarget: Vector = minimizeVectors(viewport, target);
    let scale: number = minimumDivisor(cappedTarget, size);
    let translation: Vector = centreTranslation(viewport, size, position, scale);
    return [scale, translation];
}
