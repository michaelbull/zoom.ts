import {
    addTransitionEndListener,
    hasTransitions,
    removeTransitionEndListener
} from '../../lib/Transition';

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

describe('addTransitionEndListener', () => {
    describe('if the element has transitions', () => {
        let element: any;
        let listener: EventListener;

        beforeAll(() => {
            let computedStyle: any = {
                WebkitTransitionDuration: '100'
            };

            element = {
                style: computedStyle,
                addEventListener: jasmine.createSpy('addEventListener')
            };

            window.getComputedStyle = jasmine.createSpy('getComputedStyle').and.callFake((elt: any) => {
                if (elt === element) {
                    return computedStyle;
                }
            });

            listener = jasmine.createSpy('EventListener');
            addTransitionEndListener(element, listener);
        });

        it('should add an event listener for the transitionend event', () => {
            expect(element.addEventListener).toHaveBeenCalledWith('transitionend', listener);
        });

        it('should add an event listener for the WebkitTransitionEnd event', () => {
            expect(element.addEventListener).toHaveBeenCalledWith('WebkitTransitionEnd', listener);
        });

        it('should add an event listener for the MozTransitionEnd event', () => {
            expect(element.addEventListener).toHaveBeenCalledWith('MozTransitionEnd', listener);
        });

        it('should add an event listener for the msTransitionEnd event', () => {
            expect(element.addEventListener).toHaveBeenCalledWith('msTransitionEnd', listener);
        });

        it('should add an event listener for the OTransitionEnd event', () => {
            expect(element.addEventListener).toHaveBeenCalledWith('OTransitionEnd', listener);
        });
    });

    describe('if the element does not have transitions', () => {
        it('should fire the event immediately', () => {
            let element: any = {
                style: {
                    MozTransitionEnd: '0'
                }
            };
            let listener: any = jasmine.createSpy('EventListener');

            addTransitionEndListener(element, listener);

            let event: Event = listener.calls.mostRecent().args[0];
            expect(event.type).toBe('transitionend');
        });
    });
});

describe('removeEventListener', () => {
    let element: any;
    let listener: EventListener;

    beforeAll(() => {
        element = {
            removeEventListener: jasmine.createSpy('addEventListener')
        };

        listener = jasmine.createSpy('EventListener');
        removeTransitionEndListener(element, listener);
    });

    it('should remove the event listener for the transitionend event', () => {
        expect(element.removeEventListener).toHaveBeenCalledWith('transitionend', listener);
    });

    it('should remove the event listener for the WebkitTransitionEnd event', () => {
        expect(element.removeEventListener).toHaveBeenCalledWith('WebkitTransitionEnd', listener);
    });

    it('should remove the event listener for the MozTransitionEnd event', () => {
        expect(element.removeEventListener).toHaveBeenCalledWith('MozTransitionEnd', listener);
    });

    it('should remove the event listener for the msTransitionEnd event', () => {
        expect(element.removeEventListener).toHaveBeenCalledWith('msTransitionEnd', listener);
    });

    it('should remove the event listener for the OTransitionEnd event', () => {
        expect(element.removeEventListener).toHaveBeenCalledWith('OTransitionEnd', listener);
    });
});
