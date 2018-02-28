import { viewportSize } from '../browser/Document';
import {
    Bounds,
    createBounds
} from '../element/Bounds';
import {
    addVectors,
    minimizeVectors,
    minimumDivisor,
    scaleVector,
    shrinkVector,
    subtractVectors,
    Vector
} from './Vector';

/**
 * Calculates the padding that must be applied to an inner vector for it to appear in the centre of an outer vector.
 * @param outer The outer vector.
 * @param inner The inner vector.
 * @returns {Vector} The padding.
 */
export function centrePadding(outer: Vector, inner: Vector): Vector {
    return shrinkVector(subtractVectors(outer, inner), 2);
}

export function centrePosition(outer: Vector, bounds: Bounds): Vector {
    return subtractVectors(centrePadding(outer, bounds.size), bounds.position);
}

export function centreTranslation(outer: Vector, bounds: Bounds, innerScale: number): Vector {
    let scaled = scaleVector(bounds.size, innerScale);
    let centredWithinScaled = addVectors(bounds.position, centrePadding(bounds.size, scaled));
    let centeredWithinOuter = centrePosition(outer, createBounds(centredWithinScaled, scaled));
    return shrinkVector(centeredWithinOuter, innerScale);
}

export function centreBounds(document: Document, target: Vector, bounds: Bounds): Bounds {
    let viewport = viewportSize(document);
    let cappedTarget = minimizeVectors(viewport, target);
    let factor = minimumDivisor(cappedTarget, bounds.size);

    let scaled = scaleVector(bounds.size, factor);
    let centre = centrePosition(viewport, createBounds(bounds.position, scaled));

    return {
        position: centre,
        size: scaled
    };
}
