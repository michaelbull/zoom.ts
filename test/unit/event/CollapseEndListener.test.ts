import { CollapseEndListener } from '../../../src/event';

describe('CollapseEndListener', () => {
    let listener: CollapseEndListener;
    let dom: any;

    beforeEach(() => {
        dom = {
            container: {
                removeTransitionEndListener: jest.fn()
            },
            collapsed: jest.fn()
        };

        listener = new CollapseEndListener(dom);
    });

    describe('handleEvent', () => {
        beforeEach(() => {
            let event: any = jest.fn();
            listener.handleEvent(event);
        });

        it('removes this event listener from the container element', () => {
            expect(dom.container.removeTransitionEndListener).toHaveBeenCalledWith(listener);
        });

        it('does notify the dom that it has been collapsed', () => {
            expect(dom.collapsed).toHaveBeenCalled();
        });
    });
});
