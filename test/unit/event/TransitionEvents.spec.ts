import {
    addTransitionEndListener,
    removeTransitionEndListener
} from '../../../lib/event/TransitionEvents';

describe('addTransitionEndListener', () => {
    let listener: jasmine.Spy;

    beforeEach(() => {
        listener = jasmine.createSpy('EventListener');
    });

    describe('if the element has transitions', () => {
        let element: any;
        let window: any;

        beforeEach(() => {
            element = {
                style: {
                    WebkitTransitionDuration: '100'
                },
                addEventListener: jasmine.createSpy('addEventListener')
            };

            window = {
                getComputedStyle: jasmine.createSpy('getComputedStyle').and.callFake(() => element.style)
            };
        });

        it('should compute the style of the element', () => {
            addTransitionEndListener(window, element, listener);
            expect(window.getComputedStyle).toHaveBeenCalledWith(element);
        });

        it('should add an event listener for the transitionend event', () => {
            addTransitionEndListener(window, element, listener);
            expect(element.addEventListener).toHaveBeenCalledWith('transitionend', listener);
        });

        it('should add an event listener for the WebkitTransitionEnd event', () => {
            addTransitionEndListener(window, element, listener);
            expect(element.addEventListener).toHaveBeenCalledWith('WebkitTransitionEnd', listener);
        });

        it('should add an event listener for the MozTransitionEnd event', () => {
            addTransitionEndListener(window, element, listener);
            expect(element.addEventListener).toHaveBeenCalledWith('MozTransitionEnd', listener);
        });

        it('should add an event listener for the msTransitionEnd event', () => {
            addTransitionEndListener(window, element, listener);
            expect(element.addEventListener).toHaveBeenCalledWith('msTransitionEnd', listener);
        });

        it('should add an event listener for the OTransitionEnd event', () => {
            addTransitionEndListener(window, element, listener);
            expect(element.addEventListener).toHaveBeenCalledWith('OTransitionEnd', listener);
        });
    });

    describe('if the element does not have transitions', () => {
        let element: any;
        let window: any;

        beforeEach(() => {
            element = { style: {} };
            window = {};
        });

        it('should fire the event immediately', () => {
            addTransitionEndListener(window, element, listener);
            let event: Event = listener.calls.mostRecent().args[0];
            expect(event.type).toBe('transitionend');
        });
    });
});

describe('removeTransitionEndListener', () => {
    let element: any;
    let listener: jasmine.Spy;

    beforeEach(() => {
        element = {
            removeEventListener: jasmine.createSpy('addEventListener')
        };

        listener = jasmine.createSpy('EventListener');
    });

    it('should remove the event listener for the transitionend event', () => {
        removeTransitionEndListener(element, listener);
        expect(element.removeEventListener).toHaveBeenCalledWith('transitionend', listener);
    });

    it('should remove the event listener for the WebkitTransitionEnd event', () => {
        removeTransitionEndListener(element, listener);
        expect(element.removeEventListener).toHaveBeenCalledWith('WebkitTransitionEnd', listener);
    });

    it('should remove the event listener for the MozTransitionEnd event', () => {
        removeTransitionEndListener(element, listener);
        expect(element.removeEventListener).toHaveBeenCalledWith('MozTransitionEnd', listener);
    });

    it('should remove the event listener for the msTransitionEnd event', () => {
        removeTransitionEndListener(element, listener);
        expect(element.removeEventListener).toHaveBeenCalledWith('msTransitionEnd', listener);
    });

    it('should remove the event listener for the OTransitionEnd event', () => {
        removeTransitionEndListener(element, listener);
        expect(element.removeEventListener).toHaveBeenCalledWith('OTransitionEnd', listener);
    });
});
