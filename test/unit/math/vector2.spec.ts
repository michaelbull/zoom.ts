import { Vector2 } from '../../../src/math';

let div: any = jest.fn();

jest.mock('../../../src/element/element', () => ({
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

describe('Vector2', () => {
    describe('fromPosition', () => {
        it('returns a vector', () => {
            let rect: any = {
                left: 100,
                top: 50
            };

            let expected = new Vector2(100, 50);
            let actual = Vector2.fromPosition(rect);

            expect(actual).toEqual(expected);
        });
    });

    describe('fromSize', () => {
        it('returns a vector', () => {
            let rect: any = {
                width: 200,
                height: 300
            };

            let expected = new Vector2(200, 300);
            let actual = Vector2.fromSize(rect);

            expect(actual).toEqual(expected);
        });
    });

    describe('add', () => {
        it('adds each dimension', () => {
            let expected = new Vector2(45, 80);
            let actual = new Vector2(10, 20).add(new Vector2(35, 60));

            expect(actual).toEqual(expected);
        });
    });

    describe('subtract', () => {
        it('subtracts each dimension', () => {
            let expected = new Vector2(70, 15);
            let actual = new Vector2(100, 20).subtract(new Vector2(30, 5));

            expect(actual).toEqual(expected);
        });
    });

    describe('multiply', () => {
        it('multiplies each dimension by a scale', function () {
            let expected = new Vector2(416, 104);
            let actual = new Vector2(8, 2).multiply(52);

            expect(actual).toEqual(expected);
        });
    });

    describe('scale', () => {
        it('multiplies each dimension', () => {
            let expected = new Vector2(500, 700);
            let actual = new Vector2(50, 100).scale(new Vector2(10, 7));

            expect(actual).toEqual(expected);
        });
    });

    describe('divide', () => {
        it('divides each dimension', () => {
            let expected = new Vector2(6, 5);
            let actual = new Vector2(30, 25).divide(5);

            expect(actual).toEqual(expected);
        });
    });

    describe('shrink', () => {
        it('divides each dimension', () => {
            let expected = new Vector2(10, 5);
            let actual = new Vector2(20, 30).shrink(new Vector2(2, 6));

            expect(actual).toEqual(expected);
        });
    });

    describe('minDivisor', () => {
        it('returns the horizontal division if smaller than the vertical', () => {
            let expected = 3;
            let actual = new Vector2(900, 500).minDivisor(new Vector2(300, 50));

            expect(actual).toEqual(expected);
        });

        it('returns the vertical division if smaller than the horizontal', () => {
            let expected = 12;
            let actual = new Vector2(1000, 600).minDivisor(new Vector2(10, 50));

            expect(actual).toEqual(expected);
        });
    });

    describe('min', () => {
        it('returns a vector containing the minimum dimensions from the input vectors', () => {
            let expected = new Vector2(20, 10);
            let actual = Vector2.min(new Vector2(30, 10), new Vector2(20, 30));

            expect(actual).toEqual(expected);
        });
    });

    describe('halfMidpoint', () => {
        it('returns the correct position', function () {
            let expected = new Vector2(10, 25);

            let left = new Vector2(480, 350);
            let right = new Vector2(500, 400);
            let actual = Vector2.halfMidpoint(left, right);

            expect(actual).toEqual(expected);
        });
    });

    describe('fromTargetSize', () => {
        it('returns a vector of the element\'s data-width and data-height attributes', function () {
            let expected = new Vector2(500, 200);
            let actual = Vector2.fromTargetSize(div);

            expect(actual).toEqual(expected);
        });
    });

    describe('fromClientSize', () => {
        it('returns a vector of the element\'s clientWidth and clientHeight', function () {
            let element: any = {
                clientWidth: 500,
                clientHeight: 800
            };

            let expected = new Vector2(500, 800);
            let actual = Vector2.fromClientSize(element);

            expect(actual).toEqual(expected);
        });
    });
});
