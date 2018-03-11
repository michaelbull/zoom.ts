import {
    fireEventListener,
    removeEventListener
} from '../../../src/event/util';

describe('fireEventListener', () => {
    it('should call the listener if the listener is an EventListener', () => {
        let called = false;
        let target: any = jasmine.createSpy('target');
        let event: any = jasmine.createSpy('event');
        let listener: EventListener = (evt: Event) => {
            if (evt === event) {
                called = true;
            } else {
                fail();
            }
        };

        fireEventListener(target, listener, event);

        expect(called).toEqual(true);
    });

    it('should call the handleEvent method if the listener is an EventListenerObject', () => {
        let called = false;
        let target: any = jasmine.createSpy('target');
        let event: any = jasmine.createSpy('event');
        let listener: EventListenerObject = {
            handleEvent: (evt: Event) => {
                if (evt === event) {
                    called = true;
                } else {
                    fail();
                }
            }
        };

        fireEventListener(target, listener, event);

        expect(called).toEqual(true);
    });
});

describe('removeEventListener', () => {
    it('should call removeEventListener on the target', () => {
        let target: any = { removeEventListener: jasmine.createSpy('removeEventListener') };
        let type = 'event-type';
        let listener: any = jasmine.createSpy('listener');

        removeEventListener(target, type, listener);

        expect(target.removeEventListener).toHaveBeenCalledWith(type, listener);
    });
});
