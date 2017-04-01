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

export function minimumScale(x: Vector, y: Vector): number {
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
export function centrePosition(outer: Vector, inner: Vector, innerPosition: Vector): Vector {
    return subtractVectors(centrePadding(outer, inner), innerPosition);
}

/**
 * Calculates the translation required for an inner vector to appear in the centre of an outer vector.
 * @param outer The outer vector.
 * @param inner The inner vector.
 * @param innerPosition The position of the inner vector.
 * @param innerScale The scale of the inner vector.
 * @returns {Vector} The translation.
 */
export function translateToCentre(outer: Vector, inner: Vector, innerPosition: Vector, innerScale: number): Vector {
    let scaled: Vector = scaleVector(inner, innerScale);
    let innerCentredWithinScaled: Vector = addVectors(innerPosition, centrePadding(inner, scaled));
    let scaledCenteredWithinOuter: Vector = centrePosition(outer, scaled, innerCentredWithinScaled);
    return shrinkVector(scaledCenteredWithinOuter, innerScale);
}

export type ScaleAndTranslate = [number, Vector];

export function scaleTranslateToCentre(viewport: Vector, target: Vector, imageSize: Vector, imagePosition: Vector): ScaleAndTranslate {
    let cappedTarget: Vector = minimizeVectors(viewport, target);
    let factor: number = minimumScale(cappedTarget, imageSize);

    let translation: Vector = translateToCentre(viewport, imageSize, imagePosition, factor);
    return [factor, translation];
}
