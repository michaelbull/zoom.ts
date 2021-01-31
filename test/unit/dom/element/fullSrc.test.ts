import { fullSrc } from '../../../../src/dom/element';

describe('fullSrc', () => {
    it('returns the value of the data-src attribute if non-null', () => {
        let image: any = {
            src: 'example-src',
            getAttribute: (name: string) => {
                if (name === 'data-src') {
                    return 'example-full-src';
                } else {
                    throw Error();
                }
            }
        };

        expect(fullSrc(image)).toEqual('example-full-src');
    });

    it('returns the value of the src attribute if the data-src is null', () => {
        let image: any = {
            src: 'example-src',
            getAttribute: (name: string) => {
                if (name === 'data-src') {
                    return null;
                } else {
                    throw Error();
                }
            }
        };

        expect(fullSrc(image)).toEqual('example-src');
    });
});
