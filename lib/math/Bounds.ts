import {
    centrePosition,
    Vector,
    minimizeVectors,
    minimumScale,
    scaleVector
} from './Vector';

export type Bounds = [number, number, number, number];

export function boundsFrom(rect: ClientRect): Bounds {
    return [
        rect.left, rect.top,
        rect.width, rect.height
    ];
}

export function centreBounds(viewport: Vector, target: Vector, size: Vector, position: Vector): Bounds {
    let cappedTarget: Vector = minimizeVectors(viewport, target);
    let factor: number = minimumScale(cappedTarget, size);

    let scaled: Vector = scaleVector(size, factor);
    let centre: Vector = centrePosition(viewport, scaled, position);

    return [
        centre[0], centre[1],
        scaled[0], scaled[1]
    ];
}
