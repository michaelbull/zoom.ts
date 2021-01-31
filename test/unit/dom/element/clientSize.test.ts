import { clientSize } from '../../../../src/dom/element';
import { Vector2 } from '../../../../src/math';

let div: any = jest.fn();

jest.mock('../../../../src/dom/element/targetDimension', () => ({
    targetDimension: jest.fn((element: HTMLElement, dimension: string) => {
        if (element === div) {
            if (dimension === 'width') {
                return 500;
            } else if (dimension === 'height') {
                return 200;
            }
        }

        throw Error();
    })
}));

describe('clientSize', () => {
    it('returns a vector of the element\'s clientWidth and clientHeight', function () {
        let element: any = {
            clientWidth: 500,
            clientHeight: 800
        };

        let expected: Vector2 = {
            x: 500,
            y: 800
        };

        let actual = clientSize(element);

        expect(actual).toEqual(expected);
    });
});
