import {
    addEventListener,
    fireEventListener,
    PotentialEventListener,
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
        let added: PotentialEventListener = addEventListener(element, 'click', listener);

        expect(element.addEventListener).toHaveBeenCalledWith('click', added, false);
    });

    it('should use attachEvent if present', () => {
        let element: any = {
            attachEvent: jasmine.createSpy('attachEvent').and.returnValue(true)
        };
        let added: PotentialEventListener = addEventListener(element, 'click', listener);

        expect(element.attachEvent).toHaveBeenCalledWith('onclick', added);
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

        removeEventListener(element, 'click', listener);

        expect(element.removeEventListener).toHaveBeenCalledWith('click', listener);
    });

    it('should return true if removeEventListener was called', () => {
        let element: any = {
            removeEventListener: jasmine.createSpy('removeEventListener')
        };

        let removed: boolean = removeEventListener(element, 'click', listener);

        expect(removed).toBe(true);
    });

    it('should use detachEvent if present', () => {
        let element: any = {
            detachEvent: jasmine.createSpy('detachEvent')
        };

        removeEventListener(element, 'click', listener);

        expect(element.detachEvent).toHaveBeenCalledWith('click', listener);
    });

    it('should return true if detachEvent was called', () => {
        let element: any = {
            detachEvent: jasmine.createSpy('detachEvent')
        };

        let removed: boolean = removeEventListener(element, 'click', listener);

        expect(removed).toBe(true);
    });

    it('should return false otherwise', () => {
        let element: any = {};
        expect(removeEventListener(element, 'click', listener)).toBe(false);
    });
});
