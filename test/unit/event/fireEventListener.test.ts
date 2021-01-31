import { fireEventListener } from '../../../src/event';

describe('fireEventListener', () => {
    it('calls the listener if the listener is an EventListener', () => {
        let called = false;
        let target: any = jest.fn();
        let event: any = jest.fn();
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

    it('calls the handleEvent method if the listener is an EventListenerObject', () => {
        let called = false;
        let target: any = jest.fn();
        let event: any = jest.fn();
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
