import { AddClassListener } from '../../../src/event/add-class-listener';

describe('AddClassListener', () => {
    let listener: AddClassListener;

    let element: any;
    let eventType = 'example-event';
    let token = 'my-class-token';

    beforeEach(() => {
        element = {
            removeEventListener: jasmine.createSpy('removeEventListener'),
            classList: {
                add: jasmine.createSpy('add')
            }
        };

        listener = new AddClassListener(element, eventType, token);
    });

    describe('handleEvent', () => {
        beforeEach(() => {
            let event: any = jasmine.createSpy('event');
            listener.handleEvent(event);
        });

        it('should remove itself from the element', () => {
            expect(element.removeEventListener).toHaveBeenCalledWith(eventType, listener);
        });

        it('should add the token to the class lit', () => {
            expect(element.classList.add).toHaveBeenCalledWith(token);
        });
    });
});
