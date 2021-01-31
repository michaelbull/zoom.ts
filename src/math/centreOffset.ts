import { Bounds } from './Bounds';
import {
    halfMidpoint,
    subtract,
    Vector2
} from './Vector2';

export function centreOffset(vector: Vector2, bounds: Bounds): Vector2 {
    return subtract(halfMidpoint(bounds.size, vector), bounds.position);
}
