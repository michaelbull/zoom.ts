import {
    scale,
    scale3d
} from '../../../src/style';

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
