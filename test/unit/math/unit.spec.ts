import { pixels } from '../../../src/zoom';

describe('pixels', () => {
    it('should return the value in pixel units', () => {
        expect(pixels(500)).toBe('500px');
    });
});
