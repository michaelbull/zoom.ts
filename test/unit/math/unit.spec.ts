import { pixels } from '../../../src/math/unit';

describe('pixels', () => {
    it('should return the value in pixel units', () => {
        expect(pixels(500)).toBe('500px');
    });
});
