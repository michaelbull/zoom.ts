import {
    ESCAPE_KEY_CODE,
    EscKeyListener
} from '../../../src/event/esc-key-listener';
import * as util from '../../../src/event/util';

describe('EscKeyListener', () => {
    let listener: EscKeyListener;
    let delegate: any;
    let fireEventListener: jasmine.Spy;

    beforeEach(() => {
        delegate = jasmine.createSpy('delegate');
        fireEventListener = spyOn(util, 'fireEventListener');
        listener = new EscKeyListener(delegate);
    });

    describe('handleEvent', () => {
        it('should fire the delegate listener if the event keycode is equal to the escape key code', () => {
            let event: any = { keyCode: ESCAPE_KEY_CODE };
            listener.handleEvent(event);

            expect(fireEventListener).toHaveBeenCalledWith(document, delegate, event);
        });

        it('should not fire the delegate listener if the event is not equal to the escape key code', () => {
            let event: any = { keyCode: 105 };
            listener.handleEvent(event);

            expect(fireEventListener).toHaveBeenCalledTimes(0);
        });
    });
});
