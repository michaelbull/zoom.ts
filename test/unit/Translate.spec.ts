import {
    translate,
    translate3d,
    supportsTranslate3d
} from '../../lib/Translate';

describe('translate3d', () => {
    it('should return the correct string', () => {
        expect(translate3d(50, 120)).toBe('translate3d(50px, 120px, 0)');
    });
});

describe('translate', () => {
    it('should return the correct string', () => {
        expect(translate(90, 35)).toBe('translate(90px, 35px)');
    });
});

describe('supportsTranslate3d', () => {
    let element: any;
    let child: any;
    let computedStyle: any;

    beforeAll(() => {
        element = {
            insertBefore: jasmine.createSpy('insertBefore'),
            removeChild: jasmine.createSpy('removeChild')
        };

        child = {
            style: []
        };

        computedStyle = {
            getPropertyValue: (name: string): string => {
                if (name === '-o-transform') {
                    return 'example';
                } else if (name === 'o-ms-transform') {
                    return 'none';
                } else {
                    return '';
                }
            }
        };

        document.createElement = jasmine.createSpy('createElement').and.callFake((tagName: string) => {
            if (tagName === 'div') {
                return child;
            }
        });

        window.getComputedStyle = jasmine.createSpy('getComputedStyle').and.callFake(() => computedStyle);
    });

    it('should create a child element with a tagName of "div"', () => {
        supportsTranslate3d(element, 'WebkitTransform');
        expect(document.createElement).toHaveBeenCalledWith('div');
    });

    it('should assign the translate3d property to the child element', () => {
        supportsTranslate3d(element, 'transform');
        expect(child.style['transform']).toBe('translate3d(1px,1px,1px)');
    });

    it('should add the child to the element', () => {
        supportsTranslate3d(element, 'transform');
        expect(element.insertBefore).toHaveBeenCalledWith(child, null);
    });

    it('should compute the style of the child', () => {
        supportsTranslate3d(element, '-o-transform');
        expect(window.getComputedStyle).toHaveBeenCalledWith(child);
    });

    it('should remove the child from the element', () => {
        supportsTranslate3d(element, '-ms-transform');
        expect(element.removeChild).toHaveBeenCalledWith(child);
    });

    it('should return true if the transform property is present', () => {
        expect(supportsTranslate3d(element, 'OTransform')).toBe(true);
    });

    it('should return false if the transform property is absent', () => {
        expect(supportsTranslate3d(element, 'WebkitTransform')).toBe(false);
    });

    it('should return false if the transform property resolves to "none"', () => {
        expect(supportsTranslate3d(element, 'msTransform')).toBe(false);
    });
});
