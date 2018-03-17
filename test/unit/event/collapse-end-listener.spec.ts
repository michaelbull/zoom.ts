import { CollapseEndListener } from '../../../src/event/collapse-end-listener';

describe('CollapseEndListener', () => {
    let listener: CollapseEndListener;
    let dom: any;
    let eventType: string = 'example-event';

    beforeEach(() => {
        dom = {
            container: {
                element: {
                    removeEventListener: jasmine.createSpy('removeEventListener')
                }
            },
            collapsed: jasmine.createSpy('collapsed')
        };

        listener = new CollapseEndListener(eventType, dom);
    });

    describe('handleEvent', () => {
        beforeEach(() => {
            let event: any = jasmine.createSpy('spy');
            listener.handleEvent(event);
        });

        it('should remove this event listener from the container element', () => {
            expect(dom.container.element.removeEventListener).toHaveBeenCalledWith(eventType, listener);
        });

        it('should notify the dom that it has been collapsed', () => {
            expect(dom.collapsed).toHaveBeenCalled();
        });
    });
});
