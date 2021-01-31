import {
    Bounds,
    pixels
} from '../math';
import { setBounds } from './index';

export function applyBounds(style: CSSStyleDeclaration, bounds: Bounds): void {
    let {
        x,
        y
    } = bounds.position;

    let width = bounds.size.x;
    let height = bounds.size.y;

    setBounds(style, pixels(x), pixels(y), pixels(width), pixels(height));
}
