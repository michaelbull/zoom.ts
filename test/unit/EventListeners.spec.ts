import { listeners } from '../../lib/EventListeners';

describe('EventListeners', () => {
    let dummyListener: EventListener = (): any => {
        /* empty */
    };

    describe('add', () => {
        it('should use addEventListener if present', () => {
            let element: any = {
                addEventListener: jasmine.createSpy('addEventListener')
            };

            listeners.add(element, 'click', dummyListener);
            expect(element.addEventListener).toHaveBeenCalled();
        });

        it('should use attachEvent if present', () => {
            let element: any = {
                attachEvent: jasmine.createSpy('attachEvent')
            };

            listeners.add(element, 'click', dummyListener);
            expect(element.attachEvent).toHaveBeenCalled();
        });

        it('should execute immediately otherwise', () => {
            let element: any = {};
            let listener: any = jasmine.createSpy('EventListener');

            listeners.add(element, 'click', listener);

            let event: Event = listener.calls.mostRecent().args[0];
            expect(event.type).toBe('click');
        });
    });

    describe('remove', () => {
        it('should use removeEventListener if present', () => {
            let element: any = {
                removeEventListener: jasmine.createSpy('removeEventListener')
            };

            listeners.remove(element, 'click', dummyListener);
            expect(element.removeEventListener).toHaveBeenCalled();
        });

        it('should use detachEvent if present', () => {
            let element: any = {
                detachEvent: jasmine.createSpy('detachEvent')
            };

            listeners.remove(element, 'click', dummyListener);
            expect(element.detachEvent).toHaveBeenCalled();
        });

        it('should execute immediately otherwise', () => {
            let element: any = {};
            let listener: any = jasmine.createSpy('EventListener');

            listeners.remove(element, 'click', listener);

            let event: Event = listener.calls.mostRecent().args[0];
            expect(event.type).toBe('click');
        });
    });
});
