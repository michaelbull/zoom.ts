import {
    Bounds,
    centreOffset,
    min,
    minDivisor,
    scale,
    Vector2
} from '../../math';
import { viewportSize } from './viewportSize';

export function centreOf(document: Document, position: Vector2, size: Vector2, targetSize: Vector2): Bounds {
    let viewport = viewportSize(document);
    let cappedTarget = min(viewport, targetSize);
    let factor = minDivisor(cappedTarget, size);
    let scaled = scale(size, factor);
    let centre = centreOffset(viewport, position, scaled);

    return {
        position: centre,
        size: scaled
    };
}
