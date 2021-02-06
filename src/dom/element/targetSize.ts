import { Vector2 } from '../../math';
import { targetDimension } from './targetDimension';

export function targetSize(element: Element, widthAttribute: string, heightAttribute: string): Vector2 {
    return {
        x: targetDimension(element, widthAttribute),
        y: targetDimension(element, heightAttribute)
    };
}
