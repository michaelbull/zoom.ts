import {
    translate,
    translate3d,
    hasTranslate3d
} from '../../lib/Translate';

describe('translate', () => {
    it('should return the correct value', () => {
        expect(translate(90, 35)).toBe('translate(90px, 35px)');
    });
});

describe('translate3d', () => {
    it('should return the correct value', () => {
        expect(translate3d(50, 120)).toBe('translate3d(50px, 120px, 0)');
    });
});

describe('hasTranslate3d', () => {
    let element: any;
    let child: any;
    let computedStyle: any;

    beforeEach(() => {
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
        hasTranslate3d(element, 'WebkitTransform');
        expect(document.createElement).toHaveBeenCalledWith('div');
    });

    it('should assign the translate3d property to the child element', () => {
        hasTranslate3d(element, 'transform');
        expect(child.style['transform']).toBe('translate3d(1px,1px,1px)');
    });

    it('should add the child to the element', () => {
        hasTranslate3d(element, 'transform');
        expect(element.insertBefore).toHaveBeenCalledWith(child, null);
    });

    it('should compute the style of the child', () => {
        hasTranslate3d(element, 'OTransform');
        expect(window.getComputedStyle).toHaveBeenCalledWith(child);
    });

    it('should remove the child from the element', () => {
        hasTranslate3d(element, 'msTransform');
        expect(element.removeChild).toHaveBeenCalledWith(child);
    });

    it('should return true if the transform property is present', () => {
        expect(hasTranslate3d(element, 'OTransform')).toBe(true);
    });

    it('should return false if the transform property is absent', () => {
        expect(hasTranslate3d(element, 'WebkitTransform')).toBe(false);
    });

    it('should return false if the transform property resolves to "none"', () => {
        expect(hasTranslate3d(element, 'msTransform')).toBe(false);
    });
});
