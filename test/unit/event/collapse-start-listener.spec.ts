import { CollapseStartListener } from '../../../src';

describe('CollapseStartListener', () => {
    let listener: CollapseStartListener;
    let zoom: any;

    beforeEach(() => {
        zoom = {
            collapse: jasmine.createSpy('collapse')
        };

        listener = new CollapseStartListener(zoom);
    });

    describe('handleEvent', () => {
        let evt: any;

        beforeEach(() => {
            evt = {
                preventDefault: jasmine.createSpy('preventDefault'),
                stopPropagation: jasmine.createSpy('stopPropagation')
            };

            listener.handleEvent(evt);
        });

        it('should stop the default event behaviour', () => {
            expect(evt.preventDefault).toHaveBeenCalled();
        });

        it('should stop the event from propagating', () => {
            expect(evt.stopPropagation).toHaveBeenCalled();
        });

        it('should start collapsing the dom', () => {
            expect(zoom.collapse).toHaveBeenCalled();
        });
    });
});
