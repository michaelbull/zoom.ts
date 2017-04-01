import {
    ESCAPE_KEY_CODE,
    escKeyPressed,
    scrolled
} from '../../../lib/event/EventListeners';

describe('escKeyPressed', () => {
    let listener: EventListener;
    let callback: jasmine.Spy;

    beforeEach(() => {
        callback = jasmine.createSpy('callback');
        listener = escKeyPressed(callback);
    });

    describe('if a key other than escape was pressed', () => {
        let event: any;

        beforeEach(() => {
            event = {
                keyCode: 55,
                preventDefault: jasmine.createSpy('preventDefault')
            };
        });

        it('should not prevent the event from propagating further', () => {
            listener(event);
            expect(event.preventDefault).toHaveBeenCalledTimes(0);
        });

        it('should not execute the callback', () => {
            listener(event);
            expect(callback).toHaveBeenCalledTimes(0);
        });
    });

    describe('if the escape key was pressed', () => {
        let event: any;

        beforeEach(() => {
            event = {
                keyCode: ESCAPE_KEY_CODE,
                preventDefault: jasmine.createSpy('preventDefault')
            };
        });

        it('should prevent the event from propagating further', () => {
            listener(event);
            expect(event.preventDefault).toHaveBeenCalled();
        });

        it('should execute the callback', () => {
            listener(event);
            expect(callback).toHaveBeenCalled();
        });
    });
});

describe('scrolled', () => {
    let event: any;
    let callback: jasmine.Spy;

    beforeEach(() => {
        event = jasmine.createSpy('event');
        callback = jasmine.createSpy('callback');
    });

    it('should execute the callback if the scroll delta is greater than the minimum delta', () => {
        let listener: EventListener = scrolled(50, 70, () => 200, callback);
        listener(event);
        expect(callback).toHaveBeenCalled();
    });

    it('should execute the callback if the scroll delta is equal to the minimum delta', () => {
        let listener: EventListener = scrolled(100, 100, () => 200, callback);
        listener(event);
        expect(callback).toHaveBeenCalled();
    });

    it('should not execute the callback if the scroll delta is less than the minimum delta', () => {
        let listener: EventListener = scrolled(100, 100, () => 199, callback);
        listener(event);
        expect(callback).toHaveBeenCalledTimes(0);
    });
});
