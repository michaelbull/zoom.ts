import {
    Bounds,
    createBounds
} from '../element/Bounds';

export type Vector = [number, number];

export function positionFrom(rect: ClientRect): Vector {
    return [
        rect.left,
        rect.top
    ];
}

export function sizeFrom(rect: ClientRect): Vector {
    return [
        rect.width,
        rect.height
    ];
}

export function scaleVector(vector: Vector, amount: number): Vector {
    return [
        vector[0] * amount,
        vector[1] * amount
    ];
}

export function shrinkVector(vector: Vector, amount: number): Vector {
    return [
        vector[0] / amount,
        vector[1] / amount
    ];
}

export function addVectors(x: Vector, y: Vector): Vector {
    return [
        x[0] + y[0],
        x[1] + y[1]
    ];
}

export function subtractVectors(x: Vector, y: Vector): Vector {
    return [
        x[0] - y[0],
        x[1] - y[1]
    ];
}

export function divideVectors(x: Vector, y: Vector): Vector {
    return [
        x[0] / y[0],
        x[1] / y[1]
    ];
}

export function minimizeVectors(x: Vector, y: Vector): Vector {
    return [
        Math.min(x[0], y[0]),
        Math.min(x[1], y[1])
    ];
}

export function minimumDivisor(x: Vector, y: Vector): number {
    let scaled: Vector = divideVectors(x, y);
    return Math.min(scaled[0], scaled[1]);
}

/**
 * Calculates the padding that must be applied to an inner vector for it to appear in the centre of an outer vector.
 * @param outer The outer vector.
 * @param inner The inner vector.
 * @returns {Vector} The padding.
 */
export function centrePadding(outer: Vector, inner: Vector): Vector {
    return shrinkVector(subtractVectors(outer, inner), 2);
}

/**
 * Calculates the position that must be applied to an inner vector for it to appear in the centre of an outer vector.
 * @param outer The outer vector.
 * @param inner The inner vector.
 * @param innerPosition The current position of the inner vector.
 * @returns {Vector} The new position of the inner vector.
 */
export function centrePosition(outer: Vector, bounds: Bounds): Vector {
    return subtractVectors(centrePadding(outer, bounds.size), bounds.position);
}

/**
 * Calculates the translation required for an inner vector to appear in the centre of an outer vector.
 * @param outer The outer vector.
 * @param inner The inner vector.
 * @param innerPosition The position of the inner vector.
 * @param innerScale The scale of the inner vector.
 * @returns {Vector} The translation.
 */
export function centreTranslation(outer: Vector, bounds: Bounds, innerScale: number): Vector {
    let scaled: Vector = scaleVector(bounds.size, innerScale);
    let centredWithinScaled: Vector = addVectors(bounds.position, centrePadding(bounds.size, scaled));
    let centeredWithinOuter: Vector = centrePosition(outer, createBounds(centredWithinScaled, scaled));
    return shrinkVector(centeredWithinOuter, innerScale);
}
