import { viewportSize } from '../Document';
import {
    centrePosition,
    minimizeVectors,
    minimumDivisor,
    scaleVector,
    Vector
} from './Vector';

export type Bounds = [Vector, Vector];

export function centreBounds(document: Document, target: Vector, size: Vector, position: Vector): Bounds {
    let viewport: Vector = viewportSize(document);
    let cappedTarget: Vector = minimizeVectors(viewport, target);
    let factor: number = minimumDivisor(cappedTarget, size);

    let scaled: Vector = scaleVector(size, factor);
    let centre: Vector = centrePosition(viewport, scaled, position);

    return [
        centre,
        scaled
    ];
}
