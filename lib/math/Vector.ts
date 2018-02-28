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
    let scaled = divideVectors(x, y);
    return Math.min(scaled[0], scaled[1]);
}
