import {
    addTransitionEndListener,
    hasTransitions,
    removeTransitionEndListener
} from '../../lib/Transition';

describe('hasTransitions', () => {
    it('should return false if window.getComputedStyle is undefined', () => {
        let window: any = {};
        let element: any = {};
        expect(hasTransitions(window, element)).toBe(false);
    });

    it('should return false if no transitionDuration property is present', () => {
        let element: any = {
            style: []
        };
        let window: any = {};

        expect(hasTransitions(window, element)).toBe(false);
    });

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

        hasTransitions(window, element);
        expect(window.getComputedStyle).toHaveBeenCalledWith(element);
    });

    it('should return false if the duration is an empty string', () => {
        let computedStyle: any = {
            WebkitTransitionDuration: ''
        };

        let element: any = {
            style: computedStyle
        };

        let window: any = {
            getComputedStyle: jasmine.createSpy('getComputedStyle').and.callFake((elt: any) => {
                if (elt === element) {
                    return computedStyle;
                }
            })
        };

        expect(hasTransitions(window, element)).toBe(false);
    });

    it('should return false if the duration is not a number', () => {
        let computedStyle: any = {
            WebkitTransitionDuration: 'this is NaN'
        };

        let element: any = {
            style: computedStyle
        };

        let window: any = {
            getComputedStyle: jasmine.createSpy('getComputedStyle').and.callFake((elt: any) => {
                if (elt === element) {
                    return computedStyle;
                }
            })
        };

        expect(hasTransitions(window, element)).toBe(false);
    });

    it('should return false if the duration is zero', () => {
        let computedStyle: any = {
            WebkitTransitionDuration: '0'
        };

        let element: any = {
            style: computedStyle
        };

        let window: any = {
            getComputedStyle: jasmine.createSpy('getComputedStyle').and.callFake((elt: any) => {
                if (elt === element) {
                    return computedStyle;
                }
            })
        };

        expect(hasTransitions(window, element)).toBe(false);
    });

    it('should return true if the duration is a non-zero number', () => {
        let computedStyle: any = {
            WebkitTransitionDuration: '100'
        };

        let element: any = {
            style: computedStyle
        };

        let window: any = {
            getComputedStyle: jasmine.createSpy('getComputedStyle').and.callFake((elt: any) => {
                if (elt === element) {
                    return computedStyle;
                }
            })
        };

        expect(hasTransitions(window, element)).toBe(true);
    });
});

describe('addTransitionEndListener', () => {
    describe('if the element has transitions', () => {
        let element: any;
        let window: any;
        let listener: EventListener;

        beforeAll(() => {
            let computedStyle: any = {
                WebkitTransitionDuration: '100'
            };

            element = {
                style: computedStyle,
                addEventListener: jasmine.createSpy('addEventListener')
            };

            window = {
                getComputedStyle: jasmine.createSpy('getComputedStyle').and.callFake((elt: any) => {
                    if (elt === element) {
                        return computedStyle;
                    }
                })
            };

            listener = jasmine.createSpy('EventListener');
            addTransitionEndListener(window, element, listener);
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
            let element: any = {};
            let window: any = {};
            let listener: any = jasmine.createSpy('EventListener');

            addTransitionEndListener(window, element, listener);

            let event: Event = listener.calls.mostRecent().args[0];
            expect(event.type).toBe('transitionend');
        });
    });
});

describe('removeTransitionEndListener', () => {
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
