import { pixels } from '../math/Unit';
import {
    positionFrom,
    sizeFrom,
    Vector
} from '../math/Vector';

export interface Bounds {
    readonly position: Vector;
    readonly size: Vector;
}

export function createBounds(position: Vector, size: Vector): Bounds {
    return {
        position,
        size
    };
}

export function boundsOf(element: HTMLElement): Bounds {
    let rect: ClientRect = element.getBoundingClientRect();
    return createBounds(positionFrom(rect), sizeFrom(rect));
}

export function setBounds(style: CSSStyleDeclaration, x: string, y: string, width: string, height: string): void {
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
