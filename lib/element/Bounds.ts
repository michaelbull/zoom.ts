import { pixels } from '../math/Unit';
import {
    centrePosition,
    minimizeVectors,
    minimumDivisor,
    scaleVector,
    Vector
} from '../math/Vector';
import { viewportSize } from '../window/Document';

export interface Bounds {
    position: Vector;
    size: Vector;
}

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
    let position: Vector = bounds.position;
    let size: Vector = bounds.size;
    setBounds(style, pixels(position[0]), pixels(position[1]), pixels(size[0]), pixels(size[1]));
}

export function centreBounds(document: Document, target: Vector, size: Vector, position: Vector): Bounds {
    let viewport: Vector = viewportSize(document);
    let cappedTarget: Vector = minimizeVectors(viewport, target);
    let factor: number = minimumDivisor(cappedTarget, size);

    let scaled: Vector = scaleVector(size, factor);
    let centre: Vector = centrePosition(viewport, scaled, position);

    return {
        position: centre,
        size: scaled
    };
}
