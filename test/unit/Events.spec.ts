import {
    addEventListener,
    removeEventListener,
    fireEventListener
} from '../../lib/Events';

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

    it('should execute immediately otherwise', () => {
        let element: any = {};

        addEventListener(element, 'click', listener);

        let event: Event = listener.calls.mostRecent().args[0];
        expect(event.type).toBe('click');
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
        expect(element.removeEventListener).toHaveBeenCalled();
    });

    it('should use detachEvent if present', () => {
        let element: any = {
            detachEvent: jasmine.createSpy('detachEvent')
        };

        removeEventListener(element, 'click', listener);
        expect(element.detachEvent).toHaveBeenCalled();
    });
});

describe('fireEventListener', () => {
    it('should call the listener with a new event', () => {
        let listener: any = jasmine.createSpy('EventLister');

        fireEventListener('example', listener);

        let event: Event = listener.calls.mostRecent().args[0];
        expect(listener).toHaveBeenCalledWith(event);
    });
});
