import { Vector2 } from './vector2';
export declare class Bounds {
    static of(element: HTMLElement): Bounds;
    static centreOffset(vector: Vector2, bounds: Bounds): Vector2;
    static centreTranslation(outer: Vector2, bounds: Bounds, innerScale: number): Vector2;
    static centreOf(document: Document, target: Vector2, bounds: Bounds): Bounds;
    readonly position: Vector2;
    readonly size: Vector2;
    constructor(position: Vector2, size: Vector2);
    applyTo(style: CSSStyleDeclaration): void;
}
