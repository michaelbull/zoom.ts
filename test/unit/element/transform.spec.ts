import {
    scale,
    scale3d,
    translate,
    translate3d
} from '../../../src/element';
import { Vector2 } from '../../../src/math';

describe('translate', () => {
    it('returns the transformation', () => {
        expect(translate(new Vector2(50, 60))).toBe('translate(50px, 60px)');
    });
});

describe('translate3d', () => {
    it('returns the transformation', () => {
        expect(translate3d(new Vector2(70, 80))).toBe('translate3d(70px, 80px, 0)');
    });
});

describe('scale', () => {
    it('returns the transformation', () => {
        expect(scale(50)).toBe('scale(50)');
    });
});

describe('scale3d', () => {
    it('returns the transformation', () => {
        expect(scale3d(150)).toBe('scale3d(150, 150, 1)');
    });
});
