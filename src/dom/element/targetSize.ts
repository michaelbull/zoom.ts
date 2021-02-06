import { AttributeNames } from '../../config';
import { Vector2 } from '../../math';
import { targetDimension } from './targetDimension';

export function targetSize(element: Element, attributeNames: AttributeNames): Vector2 {
    return {
        x: targetDimension(element, attributeNames.width),
        y: targetDimension(element, attributeNames.height)
    };
}
