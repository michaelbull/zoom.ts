import * as Window from '../../../lib/browser/Window';
import { Config } from '../../../lib/Config';
import * as EventListener from '../../../lib/event/EventListener';
import {
    fireEventListener,
    PotentialEventListener
} from '../../../lib/event/EventListener';
import {
    addDismissListeners,
    ESCAPE_KEY_CODE,
    escKeyPressed,
    listenForEvent,
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
                preventDefault: jasmine.createSpy('preventDefault'),
                stopPropagation: jasmine.createSpy('stopPropagation')
            };
        });

        it('should not prevent the default behaviour from occurring', () => {
            listener(event);
            expect(event.preventDefault).toHaveBeenCalledTimes(0);
        });

        it('should not prevent the event from propagating further', () => {
            listener(event);
            expect(event.stopPropagation).toHaveBeenCalledTimes(0);
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
                preventDefault: jasmine.createSpy('preventDefault'),
                stopPropagation: jasmine.createSpy('stopPropagation')
            };
        });

        it('should prevent the default behaviour from occurring', () => {
            listener(event);
            expect(event.preventDefault).toHaveBeenCalled();
        });

        it('should prevent the event from propagating further', () => {
            listener(event);
            expect(event.stopPropagation).toHaveBeenCalled();
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

describe('addDismissListeners', () => {
    let config: Config;
    let container: any;
    let collapse: any;
    let listener: jasmine.Spy;
    let removeEventListener: jasmine.Spy;

    beforeEach(() => {
        config = { scrollDismissPx: 100 };
        container = jasmine.createSpy('container');
        collapse = jasmine.createSpy('collapse');
        listener = jasmine.createSpy('listener');
        removeEventListener = spyOn(EventListener, 'removeEventListener');
    });

    describe('scroll listener', () => {
        it('should be registered', () => {
            let addEventListener: jasmine.Spy = spyOn(EventListener, 'addEventListener').and.returnValue(listener);

            addDismissListeners(config, container, collapse);

            expect(addEventListener).toHaveBeenCalledWith(window, 'scroll', jasmine.any(Function));
        });

        it('should calculate the initial vertical page scroll', () => {
            let pageScrollY: jasmine.Spy = spyOn(Window, 'pageScrollY');

            addDismissListeners(config, container, collapse);

            expect(pageScrollY).toHaveBeenCalled();
        });

        it('should calculate the current vertical page scroll when fired', () => {
            let scrollListener: any;
            let addEventListener: jasmine.Spy = spyOn(EventListener, 'addEventListener').and.callFake((target: any, type: string, evtListener: EventListenerOrEventListenerObject): any => {
                if (type === 'scroll') {
                    scrollListener = evtListener;
                }
            });
            let pageScrollY: jasmine.Spy = spyOn(Window, 'pageScrollY');

            addDismissListeners(config, container, collapse);
            fireEventListener(scrollListener, jasmine.createSpy('event') as any);

            expect(pageScrollY).toHaveBeenCalledTimes(2);
        });

        it('should unregister when executing the callback', () => {
            spyOn(EventListener, 'addEventListener').and.returnValue(listener);

            let callback: Function = addDismissListeners(config, container, collapse);
            callback();

            expect(removeEventListener).toHaveBeenCalledWith(window, 'scroll', listener);
        });
    });

    describe('esc key listener', () => {
        it('should be registered', () => {
            let addEventListener: jasmine.Spy = spyOn(EventListener, 'addEventListener').and.returnValue(listener);

            addDismissListeners(config, container, collapse);

            expect(addEventListener).toHaveBeenCalledWith(document, 'keyup', jasmine.any(Function));
        });

        it('should unregister when executing the callback', () => {
            spyOn(EventListener, 'addEventListener').and.returnValue(listener);

            let callback: Function = addDismissListeners(config, container, collapse);
            callback();

            expect(removeEventListener).toHaveBeenCalledWith(document, 'keyup', listener);
        });
    });

    describe('dismiss listener', () => {
        it('should be registered', () => {
            let addEventListener: jasmine.Spy = spyOn(EventListener, 'addEventListener').and.returnValue(listener);

            addDismissListeners(config, container, collapse);

            expect(addEventListener).toHaveBeenCalledWith(container, 'click', jasmine.any(Function));
        });

        it('should unregister when executing the callback', () => {
            spyOn(EventListener, 'addEventListener').and.returnValue(listener);

            let callback: Function = addDismissListeners(config, container, collapse);
            callback();

            expect(removeEventListener).toHaveBeenCalledWith(container, 'click', listener);
        });
    });
});

describe('listenForEvent', () => {
    let target: jasmine.Spy;
    let listener: jasmine.Spy;

    beforeEach(() => {
        target = jasmine.createSpy('target');
        listener = jasmine.createSpy('listener');
    });

    it('should add the event listener', () => {
        let addEventListener: jasmine.Spy = spyOn(EventListener, 'addEventListener');

        listenForEvent(target, 'click', listener);

        expect(addEventListener).toHaveBeenCalledWith(target, 'click', jasmine.any(Function), false);
    });

    it('should return the added event listener', () => {
        let added: jasmine.Spy = jasmine.createSpy('added');
        spyOn(EventListener, 'addEventListener').and.returnValue(added);

        expect(listenForEvent(target, 'keyup', listener)).toEqual(added);
    });

    describe('the added event listener', () => {
        let event: any;
        let added: EventListener;

        beforeEach(() => {
            event = jasmine.createSpy('event');

            spyOn(EventListener, 'addEventListener').and.callFake((target: any, type: string, listener: EventListener): PotentialEventListener => {
                added = listener;
                return added;
            });

            listenForEvent(target, 'keyup', listener);
        });

        it('should remove itself once fired', () => {
            let removeEventListener: jasmine.Spy = spyOn(EventListener, 'removeEventListener');

            added(event);

            expect(removeEventListener).toHaveBeenCalledWith(target, 'keyup', added);
        });

        it('should fire the inner event listener', () => {
            let fireEventListener: jasmine.Spy = spyOn(EventListener, 'fireEventListener');

            added(event);

            expect(fireEventListener).toHaveBeenCalledWith(listener, event);
        });
    });
});
