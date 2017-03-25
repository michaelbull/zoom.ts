import {
    ESCAPE_KEY_CODE,
    escapeKeyListener,
    scrollListener
} from '../../lib/EventListeners';

describe('escapeKeyListener', () => {
    let callback: jasmine.Spy;

    beforeEach(() => {
        callback = jasmine.createSpy('callback');
    });

    it('should execute the callback if the escape key was pressed', () => {
        let listener: EventListener = escapeKeyListener(callback);
        let event: any = {
            keyCode: ESCAPE_KEY_CODE
        };

        listener(event);
        expect(callback).toHaveBeenCalled();
    });

    it('should not execute the callback if a key other than escape was pressed', () => {
        let listener: EventListener = escapeKeyListener(callback);
        let event: any = {
            keyCode: 55
        };

        listener(event);
        expect(callback).toHaveBeenCalledTimes(0);
    });
});

describe('scrollListener', () => {
    let event: any;
    let callback: jasmine.Spy;

    beforeEach(() => {
        event = jasmine.createSpy('event');
        callback = jasmine.createSpy('callback');
    });

    it('should execute the callback if the scroll delta is greater than the minimum delta', () => {
        let listener: EventListener = scrollListener(50, 70, () => 200, callback);
        listener(event);
        expect(callback).toHaveBeenCalled();
    });

    it('should execute the callback if the scroll delta is equal to the minimum delta', () => {
        let listener: EventListener = scrollListener(100, 100, () => 200, callback);
        listener(event);
        expect(callback).toHaveBeenCalled();
    });

    it('should not execute the callback if the scroll delta is less than the minimum delta', () => {
        let listener: EventListener = scrollListener(100, 100, () => 199, callback);
        listener(event);
        expect(callback).toHaveBeenCalledTimes(0);
    });
});
