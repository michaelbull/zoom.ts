import {
    currentEvent,
    polyfillEvent
} from '../../../lib/event/Event';

describe('currentEvent', () => {
    it('should return the input event if not undefined', () => {
        let event: any = jasmine.createSpy('Event');
        expect(currentEvent(event)).toBe(event);
    });

    it('should return window.event if the input event is undefined', () => {
        window.event = jasmine.createSpy('Event') as any;
        expect(currentEvent(undefined)).toBe(window.event);
    });

    it('should throw an error otherwise', () => {
        window.event = undefined;
        expect(() => currentEvent(undefined)).toThrowError(Error, 'No current event to handle.');
    });
});

describe('polyfillEvent', () => {
    describe('preventDefault', () => {
        it('should be polyfilled if absent', () => {
            let event: any = { type: '' };
            let polyfilled: Event = polyfillEvent(event);

            expect(typeof polyfilled.preventDefault).toBe('function');
        });

        it('should set returnValue to false when called', () => {
            let event: any = {
                type: '',
                returnValue: true
            };
            let polyfilled: Event = polyfillEvent(event);

            polyfilled.preventDefault();

            expect(polyfilled.returnValue).toBe(false);
        });
    });

    describe('stopPropagation', () => {
        it('should be polyfilled if absent', () => {
            let event: any = { type: '' };
            let polyfilled: Event = polyfillEvent(event);

            expect(typeof polyfilled.stopPropagation).toBe('function');
        });

        it('should set cancelBubble to true when called', () => {
            let event: any = {
                type: '',
                cancelBubble: false
            };
            let polyfilled: Event = polyfillEvent(event);

            polyfilled.stopPropagation();

            expect(polyfilled.cancelBubble).toBe(true);
        });
    });

    describe('mouseover event', () => {
        it('should set relatedTarget to fromElement if absent', () => {
            let event: any = {
                type: 'mouseover',
                fromElement: jasmine.createSpy('fromElement')
            };
            let polyfilled: MouseEvent = polyfillEvent(event) as MouseEvent;

            expect(polyfilled.relatedTarget).toBe(polyfilled.fromElement);
        });
    });

    describe('mouseout event', () => {
        it('should set relatedTarget to toElement if absent', () => {
            let event: any = {
                type: 'mouseout',
                toElement: jasmine.createSpy('toElement')
            };
            let polyfilled: MouseEvent = polyfillEvent(event) as MouseEvent;

            expect(polyfilled.relatedTarget).toBe(polyfilled.toElement);
        });
    });
});
