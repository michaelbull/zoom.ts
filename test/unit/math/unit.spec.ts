import { pixels } from '../../../src/math';

describe('pixels', () => {
    it('returns the value in pixel units', () => {
        expect(pixels(500)).toBe('500px');
    });
});
