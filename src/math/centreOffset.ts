import {
    halfMidpoint,
    subtract,
    Vector2
} from './Vector2';

export function centreOffset(vector: Vector2, position: Vector2, size: Vector2): Vector2 {
    return subtract(halfMidpoint(size, vector), position);
}
