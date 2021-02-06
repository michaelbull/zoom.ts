import { viewportSize } from '../dom/document';
import {
    centreTranslation,
    min,
    minDivisor,
    Vector2
} from '../math';
import { Transformation } from './Transformation';

export function transformToCentre(position: Vector2, size: Vector2, targetSize: Vector2): Transformation {
    let viewport = viewportSize();
    let cappedTarget = min(viewport, targetSize);
    let scale = minDivisor(cappedTarget, size);
    let translate = centreTranslation(viewport, position, size, scale);

    return {
        scale,
        translate
    };
}
