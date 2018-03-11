import {
    fullSrc,
    targetDimension
} from '../../../src/zoom';

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

describe('fullSrc', () => {
    it('should return the value of the data-src attribute if non-null', () => {
        let image: any = {
            src: 'example-src',
            getAttribute: (name: string) => {
                if (name === 'data-src') {
                    return 'example-full-src';
                } else {
                    fail();
                }
            }
        };

        expect(fullSrc(image)).toEqual('example-full-src');
    });

    it('should return the value of the src attribute if the data-src is null', () => {
        let image: any = {
            src: 'example-src',
            getAttribute: (name: string) => {
                if (name === 'data-src') {
                    return null;
                } else {
                    fail();
                }
            }
        };

        expect(fullSrc(image)).toEqual('example-src');
    });
});
