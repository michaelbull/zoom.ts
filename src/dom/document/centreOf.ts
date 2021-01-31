import {
    Bounds,
    centreOffset,
    min,
    minDivisor,
    scale,
    Vector2
} from '../../math';
import { viewportSize } from './viewportSize';

export function centreOf(document: Document, target: Vector2, bounds: Bounds): Bounds {
    let viewport = viewportSize(document);
    let cappedTarget = min(viewport, target);
    let factor = minDivisor(cappedTarget, bounds.size);

    let scaled = scale(bounds.size, factor);

    let centre = centreOffset(viewport, {
        position: bounds.position,
        size: scaled
    });

    return {
        position: centre,
        size: scaled
    };
}
