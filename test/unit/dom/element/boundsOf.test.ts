import { boundsOf } from '../../../../src/dom/element';
import { Bounds } from '../../../../src/math';

describe('boundsOf', () => {
    it('constructs a Bounds object using the position and size of the rect', () => {
        let rect: ClientRect = {
            top: 300,
            right: 5,
            bottom: 50,
            left: 120,
            width: 99,
            height: 100
        };

        let element: any = {
            getBoundingClientRect: jest.fn(() => rect)
        };

        let actual = boundsOf(element);

        let expected: Bounds = {
            position: {
                x: 120,
                y: 300
            },
            size: {
                x: 99,
                y: 100
            }
        };

        expect(actual).toEqual(expected);
    });
});
