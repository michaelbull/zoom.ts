import { Vector2 } from '../../math';
import { targetDimension } from './targetDimension';

export function targetSize(element: Element): Vector2 {
    return {
        x: targetDimension(element, 'width'),
        y: targetDimension(element, 'height')
    };
}
