import { Bounds } from '../math/Bounds';
import { pixels } from '../math/Unit';
import { Vector } from '../math/Vector';

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
