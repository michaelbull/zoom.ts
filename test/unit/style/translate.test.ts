import { Vector2 } from '../../../src/math';
import {
    translate,
    translate3d
} from '../../../src/style';

describe('translate', () => {
    it('returns the transformation', () => {
        let vector: Vector2 = {
            x: 50,
            y: 60
        };

        expect(translate(vector)).toBe('translate(50px, 60px)');
    });
});

describe('translate3d', () => {
    it('returns the transformation', () => {
        let vector: Vector2 = {
            x: 70,
            y: 80
        };

        expect(translate3d(vector)).toBe('translate3d(70px, 80px, 0)');
    });
});
