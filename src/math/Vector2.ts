export interface Vector2 {
    readonly x: number;
    readonly y: number;
}

export function add(a: Vector2, b: Vector2): Vector2 {
    return {
        x: a.x + b.x,
        y: a.y + b.y
    };
}

export function subtract(a: Vector2, b: Vector2): Vector2 {
    return {
        x: a.x - b.x,
        y: a.y - b.y
    };
}

export function multiply(a: Vector2, b: Vector2): Vector2 {
    return {
        x: a.x * b.x,
        y: a.y * b.y
    };
}

export function divide(a: Vector2, b: Vector2): Vector2 {
    return {
        x: a.x / b.x,
        y: a.y / b.y
    };
}

export function min(a: Vector2, b: Vector2): Vector2 {
    return {
        x: Math.min(a.x, b.x),
        y: Math.min(a.y, b.y)
    };
}

export function minDivisor(a: Vector2, b: Vector2): number {
    let scaled = divide(a, b);
    return Math.min(scaled.x, scaled.y);
}

export function halfMidpoint(a: Vector2, b: Vector2): Vector2 {
    let midpoint = subtract(b, a);
    return shrink(midpoint, 2);
}

export function scale(a: Vector2, scale: number): Vector2 {
    return {
        x: a.x * scale,
        y: a.y * scale
    };
}

export function shrink(a: Vector2, scale: number): Vector2 {
    return {
        x: a.x / scale,
        y: a.y / scale
    };
}
