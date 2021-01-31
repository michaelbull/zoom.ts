import { viewportSize } from '../browser';
import { setBounds } from '../element';
import { pixels } from './unit';
import { Vector2 } from './vector2';

export class Bounds {
    static of(element: HTMLElement): Bounds {
        let rect = element.getBoundingClientRect();
        let position = Vector2.fromPosition(rect);
        let size = Vector2.fromSize(rect);
        return new Bounds(position, size);
    }

    static centreOffset(vector: Vector2, bounds: Bounds): Vector2 {
        let halfMidpoint = Vector2.halfMidpoint(bounds.size, vector);
        return halfMidpoint.subtract(bounds.position);
    }

    static centreTranslation(outer: Vector2, bounds: Bounds, innerScale: number): Vector2 {
        let scaled = bounds.size.multiply(innerScale);
        let centredWithinScaled = bounds.position.add(Vector2.halfMidpoint(scaled, bounds.size));
        let centeredWithinOuter = this.centreOffset(outer, new Bounds(centredWithinScaled, scaled));
        return centeredWithinOuter.divide(innerScale);
    }

    static centreOf(document: Document, target: Vector2, bounds: Bounds): Bounds {
        let viewport = viewportSize(document);
        let cappedTarget = Vector2.min(viewport, target);
        let factor = cappedTarget.minDivisor(bounds.size);

        let scaled = bounds.size.multiply(factor);
        let centre = this.centreOffset(viewport, new Bounds(bounds.position, scaled));

        return new Bounds(centre, scaled);
    }

    readonly position: Vector2;
    readonly size: Vector2;

    constructor(position: Vector2, size: Vector2) {
        this.position = position;
        this.size = size;
    }

    applyTo(style: CSSStyleDeclaration): void {
        setBounds(style, pixels(this.position.x), pixels(this.position.y), pixels(this.size.x), pixels(this.size.y));
    }
}
