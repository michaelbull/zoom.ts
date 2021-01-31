import { CollapseEndListener } from '../../../src/event';

describe('CollapseEndListener', () => {
    let listener: CollapseEndListener;
    let dom: any;
    let eventType: string = 'example-event';

    beforeEach(() => {
        dom = {
            container: {
                element: {
                    removeEventListener: jest.fn()
                }
            },
            collapsed: jest.fn()
        };

        listener = new CollapseEndListener(eventType, dom);
    });

    describe('handleEvent', () => {
        beforeEach(() => {
            let event: any = jest.fn();
            listener.handleEvent(event);
        });

        it('removes this event listener from the container element', () => {
            expect(dom.container.element.removeEventListener).toHaveBeenCalledWith(eventType, listener);
        });

        it('does notify the dom that it has been collapsed', () => {
            expect(dom.collapsed).toHaveBeenCalled();
        });
    });
});
