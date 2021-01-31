import { viewportSize } from '../dom/document';
import {
    Bounds,
    centreTranslation,
    min,
    minDivisor,
    Vector2
} from '../math';
import { Transformation } from './Transformation';

export function transformToCentre(target: Vector2, bounds: Bounds): Transformation {
    let viewport = viewportSize();
    let cappedTarget = min(viewport, target);
    let scale = minDivisor(cappedTarget, bounds.size);
    let translate = centreTranslation(viewport, bounds, scale);

    return {
        scale,
        translate
    };
}
