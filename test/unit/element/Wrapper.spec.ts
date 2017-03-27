import { resolveSrc } from '../../../lib/element/Wrapper';

describe('resolveSrc', () => {
    let element: HTMLElement;

    beforeEach(() => {
        element = document.createElement('div');
    });

    it('should return the value of the data-src attribute if present', () => {
        let image: any = {};

        element.setAttribute('data-src', 'test-value');
        expect(resolveSrc(element, image)).toBe('test-value');
    });

    it('should return the src of the image if the data-src attribute is absent', () => {
        let image: any = {
            src: 'example-src'
        };

        expect(resolveSrc(element, image)).toBe('example-src');
    });
});
