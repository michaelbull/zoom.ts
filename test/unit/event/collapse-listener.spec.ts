import { CollapseListener } from '../../../src/event/collapse-listener';

describe('CollapseListener', () => {
    let listener: CollapseListener;
    let dom: any;
    let eventType: string = 'example-event';

    beforeEach(() => {
        dom = {
            container: {
                element: {
                    removeEventListener: jasmine.createSpy('removeEventListener')
                }
            },
            collapse: jasmine.createSpy('collapse')
        };

        listener = new CollapseListener(eventType, dom);
    });

    describe('handleEvent', () => {
        beforeEach(() => {
            let event: any = jasmine.createSpy('spy');
            listener.handleEvent(event);
        });

        it('should remove this event listener from the container element', () => {
            expect(dom.container.element.removeEventListener).toHaveBeenCalledWith(eventType, listener);
        });

        it('should collapse the dom', () => {
            expect(dom.collapse).toHaveBeenCalled();
        });
    });
});
