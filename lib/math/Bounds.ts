import {
    centrePosition,
    minimizeVectors,
    minimumScale,
    positionFrom,
    scaleVector,
    sizeFrom,
    Vector
} from './Vector';

export type Bounds = [Vector, Vector];

export function boundsFrom(rect: ClientRect): Bounds {
    return [
        positionFrom(rect),
        sizeFrom(rect)
    ];
}

export function centreBounds(viewport: Vector, target: Vector, size: Vector, position: Vector): Bounds {
    let cappedTarget: Vector = minimizeVectors(viewport, target);
    let factor: number = minimumScale(cappedTarget, size);

    let scaled: Vector = scaleVector(size, factor);
    let centre: Vector = centrePosition(viewport, scaled, position);

    return [
        centre,
        scaled
    ];
}
