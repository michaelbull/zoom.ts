import { targetDimension } from '../element/element';

export class Vector2 {
    static fromPosition(rect: ClientRect): Vector2 {
        return new Vector2(rect.left, rect.top);
    }

    static fromSize(rect: ClientRect): Vector2 {
        return new Vector2(rect.width, rect.height);
    }

    readonly x: number;
    readonly y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    add(other: Vector2): Vector2 {
        return new Vector2(this.x + other.x, this.y + other.y);
    }

    subtract(other: Vector2): Vector2 {
        return new Vector2(this.x - other.x, this.y - other.y);
    }

    multiply(scale: number): Vector2 {
        return new Vector2(this.x * scale, this.y * scale);
    }

    divide(scale: number): Vector2 {
        return new Vector2(this.x / scale, this.y / scale);
    }

    scale(other: Vector2): Vector2 {
        return new Vector2(this.x * other.x, this.y * other.y);
    }

    shrink(other: Vector2): Vector2 {
        return new Vector2(this.x / other.x, this.y / other.y);
    }

    minDivisor(other: Vector2): number {
        let scaled = this.shrink(other);
        return Math.min(scaled.x, scaled.y);
    }

    static min(left: Vector2, right: Vector2): Vector2 {
        return new Vector2(Math.min(left.x, right.x), Math.min(left.y, right.y));
    }

    static halfMidpoint(left: Vector2, right: Vector2): Vector2 {
        let midpoint = right.subtract(left);
        return midpoint.divide(2);
    }

    static fromTargetSize(element: HTMLElement): Vector2 {
        return new Vector2(targetDimension(element, 'width'), targetDimension(element, 'height'));
    }

    static fromClientSize(element: HTMLElement): Vector2 {
        return new Vector2(element.clientWidth, element.clientHeight);
    }
}
