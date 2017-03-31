import {
    addEventListener,
    fireEventListener,
    removeEventListener
} from '../../../lib/event/EventListener';

describe('fireEventListener', () => {
    it('should call the listener if the listener is an EventListener', () => {
        let listener: any = jasmine.createSpy('EventListener');
        let event: any = jasmine.createSpy('Event');
        fireEventListener(listener, event);
        expect(listener).toHaveBeenCalledWith(event);
    });

    it('should call handleEvent if the listener is EventListenerObject', () => {
        let listener: any = {
            handleEvent: jasmine.createSpy('handleEvent')
        };
        let event: any = jasmine.createSpy('Event');
        fireEventListener(listener, event);
        expect(listener.handleEvent).toHaveBeenCalledWith(event);
    });

});

describe('addEventListener', () => {
    let listener: jasmine.Spy;

    beforeEach(() => {
        listener = jasmine.createSpy('EventListener');
    });

    it('should use addEventListener if present', () => {
        let element: any = {
            addEventListener: jasmine.createSpy('addEventListener')
        };

        addEventListener(element, 'click', listener);
        expect(element.addEventListener).toHaveBeenCalled();
    });

    it('should use attachEvent if present', () => {
        let element: any = {
            attachEvent: jasmine.createSpy('attachEvent')
        };

        addEventListener(element, 'click', listener);
        expect(element.attachEvent).toHaveBeenCalled();
    });

    it('should return undefined otherwise', () => {
        let element: any = {};
        expect(addEventListener(element, 'click', listener)).toBeUndefined();
    });
});

describe('removeEventListener', () => {
    let listener: jasmine.Spy;

    beforeEach(() => {
        listener = jasmine.createSpy('EventListener');
    });

    it('should use removeEventListener if present', () => {
        let element: any = {
            removeEventListener: jasmine.createSpy('removeEventListener')
        };

        expect(removeEventListener(element, 'click', listener)).toBe(true);
        expect(element.removeEventListener).toHaveBeenCalled();
    });

    it('should use detachEvent if present', () => {
        let element: any = {
            detachEvent: jasmine.createSpy('detachEvent')
        };

        expect(removeEventListener(element, 'click', listener)).toBe(true);
        expect(element.detachEvent).toHaveBeenCalled();
    });

    it('should return false otherwise', () => {
        let element: any = {};
        expect(removeEventListener(element, 'click', listener)).toBe(false);
    });
});
