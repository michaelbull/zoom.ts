import {
    ESCAPE_KEY_CODE,
    EscKeyListener,
    fireEventListener
} from '../../../src/event';

jest.mock('../../../src/event/fireEventListener', () => ({
    fireEventListener: jest.fn()
}));

describe('EscKeyListener', () => {
    let listener: EscKeyListener;
    let delegate: any;
    let target: any;

    beforeEach(() => {
        jest.clearAllMocks();
        delegate = jest.fn();
        target = jest.fn();
        listener = new EscKeyListener(delegate, target);
    });

    describe('handleEvent', () => {
        it('fires the delegate listener if the event keycode is equal to the escape key code', () => {
            let event: any = { keyCode: ESCAPE_KEY_CODE };
            listener.handleEvent(event);

            expect(fireEventListener).toHaveBeenCalledWith(target, delegate, event);
        });

        it('does not fire the delegate listener if the event is not equal to the escape key code', () => {
            let event: any = { keyCode: 105 };
            listener.handleEvent(event);

            expect(fireEventListener).toHaveBeenCalledTimes(0);
        });
    });
});
