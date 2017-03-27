export type Matrix = [number, number];

export function positionOf(rect: ClientRect): Matrix {
    return [
        rect.left,
        rect.top
    ];
}

export function sizeOf(rect: ClientRect): Matrix {
    return [
        rect.width,
        rect.height
    ];
}

export function multiplyMatrix(x: Matrix, amount: number): Matrix {
    return [
        x[0] * amount,
        x[1] * amount
    ];
}

export function divideMatrix(x: Matrix, amount: number): Matrix {
    return [
        x[0] / amount,
        x[1] / amount
    ];
}

export function addMatrices(x: Matrix, y: Matrix): Matrix {
    return [
        x[0] + y[0],
        x[1] + y[1]
    ];
}

export function subtractMatrices(x: Matrix, y: Matrix): Matrix {
    return [
        x[0] - y[0],
        x[1] - y[1]
    ];
}

export function divideMatrices(x: Matrix, y: Matrix): Matrix {
    return [
        x[0] / y[0],
        x[1] / y[1]
    ];
}

export function minimizeMatrices(x: Matrix, y: Matrix): Matrix {
    return [
        Math.min(x[0], y[0]),
        Math.min(x[1], y[1])
    ];
}

export function minimumScale(x: Matrix, y: Matrix): number {
    let scaled: Matrix = divideMatrices(x, y);
    return Math.min(scaled[0], scaled[1]);
}

/**
 * Calculates the padding that must be applied to an inner matrix for it to appear in the centre of an outer matrix.
 * @param outer The outer matrix.
 * @param inner The inner matrix.
 * @returns {Matrix} The padding.
 */
export function centrePadding(outer: Matrix, inner: Matrix): Matrix {
    return divideMatrix(subtractMatrices(outer, inner), 2);
}

/**
 * Calculates the position that must be applied to an inner matrix for it to appear in the centre of an outer matrix.
 * @param outer The outer matrix.
 * @param inner The inner matrix.
 * @param innerPosition The current position of the inner matrix.
 * @returns {Matrix} The new position of the inner matrix.
 */
export function centrePosition(outer: Matrix, inner: Matrix, innerPosition: Matrix): Matrix {
    return subtractMatrices(centrePadding(outer, inner), innerPosition);
}

/**
 * Calculates the translation required for an inner matrix to appear in the centre of an outer matrix.
 * @param outer The outer matrix.
 * @param inner The inner matrix.
 * @param innerPosition The position of the inner matrix.
 * @param innerScale The scale of the inner matrix.
 * @returns {Matrix} The translation.
 */
export function translateToCentre(outer: Matrix, inner: Matrix, innerPosition: Matrix, innerScale: number): Matrix {
    let scaled: Matrix = multiplyMatrix(inner, innerScale);
    let innerCentredWithinScaled: Matrix = addMatrices(innerPosition, centrePadding(inner, scaled));
    let scaledCenteredWithinOuter: Matrix = centrePosition(outer, scaled, innerCentredWithinScaled);
    return divideMatrix(scaledCenteredWithinOuter, innerScale);
}
