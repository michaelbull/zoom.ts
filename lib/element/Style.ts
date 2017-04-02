import { viewportSize } from '../Document';
import { Bounds } from '../math/Bounds';
import {
    centreTranslation,
    minimizeVectors,
    minimumDivisor,
    Vector
} from '../math/Vector';
import { pixels } from '../math/Unit';

function setBounds(style: CSSStyleDeclaration, x: string, y: string, width: string, height: string): void {
    style.left = x;
    style.top = y;
    style.width = width;
    style.maxWidth = width;
    style.height = height;
}

export function resetBounds(style: CSSStyleDeclaration): void {
    setBounds(style, '', '', '', '');
}

export function setBoundsPx(style: CSSStyleDeclaration, bounds: Bounds): void {
    let position: Vector = bounds[0];
    let size: Vector = bounds[1];
    setBounds(style, pixels(position[0]), pixels(position[1]), pixels(size[0]), pixels(size[1]));
}

export function translate(position: Vector, use3d: boolean): string {
    if (use3d) {
        return `translate3d(${position[0]}px, ${position[1]}px, 0)`;
    } else {
        return `translate(${position[0]}px, ${position[1]}px)`;
    }
}

export function scaleBy(amount: number): string {
    return `scale(${amount})`;
}

export function scaleAndTranslate(scale: number, translation: Vector, use3d: boolean): string {
    return `${scaleBy(scale)} ${translate(translation, use3d)}`;
}

export function centreTransformation(document: Document, target: Vector, size: Vector, position: Vector, use3d: boolean): string {
    let viewport: Vector = viewportSize(document);
    let cappedTarget: Vector = minimizeVectors(viewport, target);
    let scale: number = minimumDivisor(cappedTarget, size);
    let translation: Vector = centreTranslation(viewport, size, position, scale);
    return scaleAndTranslate(scale, translation, use3d);
}
