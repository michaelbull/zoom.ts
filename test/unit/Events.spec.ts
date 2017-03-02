import {
    addEventListener,
    removeEventListener
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
