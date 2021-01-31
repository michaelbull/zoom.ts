import { targetSize } from '../../../../src/dom/element/targetSize';
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

describe('targetSize', () => {
    it('returns a vector of the element\'s data-width and data-height attributes', function () {
        let expected: Vector2 = {
            x: 500,
            y: 200
        };

        let actual = targetSize(div);

        expect(actual).toEqual(expected);
    });
});
