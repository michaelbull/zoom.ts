export declare class Vector2 {
    static fromPosition(rect: ClientRect): Vector2;
    static fromSize(rect: ClientRect): Vector2;
    readonly x: number;
    readonly y: number;
    constructor(x: number, y: number);
    add(other: Vector2): Vector2;
    subtract(other: Vector2): Vector2;
    multiply(scale: number): Vector2;
    divide(scale: number): Vector2;
    scale(other: Vector2): Vector2;
    shrink(other: Vector2): Vector2;
    minDivisor(other: Vector2): number;
    static min(left: Vector2, right: Vector2): Vector2;
    static halfMidpoint(left: Vector2, right: Vector2): Vector2;
    static fromTargetSize(element: HTMLElement): Vector2;
    static fromClientSize(element: HTMLElement): Vector2;
}
