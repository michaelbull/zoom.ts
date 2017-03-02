import { hasTransitions } from '../../lib/Transition';

describe('hasTransitions', () => {
    it('should compute the style of the element', () => {
        let computedStyle: any = {
            MozTransitionDuration: '55'
        };

        let element: any = {
            style: computedStyle
        };

        window.getComputedStyle = jasmine.createSpy('getComputedStyle').and.callFake((elt: any) => {
            if (elt === element) {
                return computedStyle;
            }
        });

        hasTransitions(element);
        expect(window.getComputedStyle).toHaveBeenCalledWith(element);
    });

    it('should return false if no transitionDuration property is present', () => {
        let element: any = {
            style: []
        };

        expect(hasTransitions(element)).toBe(false);
    });

    it('should return false if the duration is an empty string', () => {
        let computedStyle: any = {
            WebkitTransitionDuration: ''
        };

        let element: any = {
            style: computedStyle
        };

        window.getComputedStyle = jasmine.createSpy('getComputedStyle').and.callFake((elt: any) => {
            if (elt === element) {
                return computedStyle;
            }
        });

        expect(hasTransitions(element)).toBe(false);
    });

    it('should return false if the duration is not a number', () => {
        let computedStyle: any = {
            WebkitTransitionDuration: 'this is NaN'
        };

        let element: any = {
            style: computedStyle
        };

        window.getComputedStyle = jasmine.createSpy('getComputedStyle').and.callFake((elt: any) => {
            if (elt === element) {
                return computedStyle;
            }
        });

        expect(hasTransitions(element)).toBe(false);
    });

    it('should return false if the duration is zero', () => {
        let computedStyle: any = {
            WebkitTransitionDuration: '0'
        };

        let element: any = {
            style: computedStyle
        };

        window.getComputedStyle = jasmine.createSpy('getComputedStyle').and.callFake((elt: any) => {
            if (elt === element) {
                return computedStyle;
            }
        });

        expect(hasTransitions(element)).toBe(false);
    });

    it('should return true if the duration is a non-zero number', () => {
        let computedStyle: any = {
            WebkitTransitionDuration: '100'
        };

        let element: any = {
            style: computedStyle
        };

        window.getComputedStyle = jasmine.createSpy('getComputedStyle').and.callFake((elt: any) => {
            if (elt === element) {
                return computedStyle;
            }
        });

        expect(hasTransitions(element)).toBe(true);
    });
});
