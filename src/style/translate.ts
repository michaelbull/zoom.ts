import {
    pixels,
    Vector2
} from '../math';

export function translate(vector: Vector2): string {
    return `translate(${pixels(vector.x)}, ${pixels(vector.y)})`;
}

export function translate3d(vector: Vector2): string {
    return `translate3d(${pixels(vector.x)}, ${pixels(vector.y)}, 0)`;
}
