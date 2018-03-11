import { targetDimension } from '../../../src/zoom';

describe('targetDimension', () => {
    it('should return Infinity if the attribute is null', () => {
        let element: any = {
            getAttribute: () => null
        };

        expect(targetDimension(element, '')).toBe(Infinity);
    });

    it('should return Infinity if the attribute is NaN', () => {
        let element: any = {
            getAttribute: () => 'not a number'
        };

        expect(targetDimension(element, '')).toBe(Infinity);
    });

    it('should return the numeric value if the attribute is a number', () => {
        let element: any = {
            getAttribute: () => '503'
        };

        expect(targetDimension(element, '')).toBe(503);
    });
});
