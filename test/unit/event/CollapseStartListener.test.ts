import { CollapseStartListener } from '../../../src/event';

describe('CollapseStartListener', () => {
    let listener: CollapseStartListener;
    let zoom: any;

    beforeEach(() => {
        zoom = {
            collapse: jest.fn()
        };

        listener = new CollapseStartListener(zoom);
    });

    describe('handleEvent', () => {
        let evt: any;

        beforeEach(() => {
            evt = {
                preventDefault: jest.fn(),
                stopPropagation: jest.fn()
            };

            listener.handleEvent(evt);
        });

        it('stop the default event behaviour', () => {
            expect(evt.preventDefault).toHaveBeenCalled();
        });

        it('stop the event from propagating', () => {
            expect(evt.stopPropagation).toHaveBeenCalled();
        });

        it('starts collapsing the dom', () => {
            expect(zoom.collapse).toHaveBeenCalled();
        });
    });
});
