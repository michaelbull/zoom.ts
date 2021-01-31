import { AddClassListener } from '../../../src/event';

describe('AddClassListener', () => {
    let listener: AddClassListener;

    let element: any;
    let eventType = 'example-event';
    let token = 'my-class-token';

    beforeEach(() => {
        element = {
            removeEventListener: jest.fn(),
            classList: {
                add: jest.fn()
            }
        };

        listener = new AddClassListener(element, eventType, token);
    });

    describe('handleEvent', () => {
        beforeEach(() => {
            let event: any = jest.fn();
            listener.handleEvent(event);
        });

        it('removes itself from the element', () => {
            expect(element.removeEventListener).toHaveBeenCalledWith(eventType, listener);
        });

        it('adds the token to the class lit', () => {
            expect(element.classList.add).toHaveBeenCalledWith(token);
        });
    });
});
