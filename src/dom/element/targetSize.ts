import { Vector2 } from '../../math';
import { targetDimension } from './targetDimension';

export function targetSize(element: Element): Vector2 {
    let targetWidth = targetDimension(element, 'width');
    let targetHeight = targetDimension(element, 'height');

    return {
        x: targetWidth,
        y: targetHeight
    };
}
