import {
    add,
    divide,
    halfMidpoint,
    min,
    minDivisor,
    multiply,
    scale,
    shrink,
    subtract
} from '../../../src/math';

describe('add', () => {
    it('adds each dimension', () => {
        let a = {
            x: 10,
            y: 20
        };

        let b = {
            x: 35,
            y: 60
        };

        let expected = {
            x: 45,
            y: 80
        };

        let actual = add(a, b);

        expect(actual).toEqual(expected);
    });
});

describe('subtract', () => {
    it('subtracts each dimension', () => {
        let a = {
            x: 100,
            y: 20
        };

        let b = {
            x: 30,
            y: 5
        };

        let expected = {
            x: 70,
            y: 15
        };

        let actual = subtract(a, b);

        expect(actual).toEqual(expected);
    });
});

describe('multiply', () => {
    it('multiplies each dimension by a scale', function () {
        let vector = {
            x: 8,
            y: 2
        };

        let expected = {
            x: 416,
            y: 104
        };

        let actual = scale(vector, 52);

        expect(actual).toEqual(expected);
    });
});

describe('scale', () => {
    it('multiplies each dimension', () => {
        let a = {
            x: 50,
            y: 100
        };

        let b = {
            x: 10,
            y: 7
        };

        let expected = {
            x: 500,
            y: 700
        };

        let actual = multiply(a, b);

        expect(actual).toEqual(expected);
    });
});

describe('divide', () => {
    it('divides each dimension', () => {
        let vector = {
            x: 30,
            y: 25
        };

        let expected = {
            x: 6,
            y: 5
        };

        let actual = shrink(vector, 5);

        expect(actual).toEqual(expected);
    });
});

describe('shrink', () => {
    it('divides each dimension', () => {
        let a = {
            x: 20,
            y: 30
        };

        let b = {
            x: 2,
            y: 6
        };

        let expected = {
            x: 10,
            y: 5
        };

        let actual = divide(a, b);

        expect(actual).toEqual(expected);
    });
});

describe('minDivisor', () => {
    it('returns the horizontal division if smaller than the vertical', () => {
        let a = {
            x: 900,
            y: 500
        };

        let b = {
            x: 300,
            y: 50
        };

        let expected = 3;
        let actual = minDivisor(a, b);

        expect(actual).toEqual(expected);
    });

    it('returns the vertical division if smaller than the horizontal', () => {
        let a = {
            x: 1000,
            y: 600
        };

        let b = {
            x: 10,
            y: 50
        };

        let expected = 12;
        let actual = minDivisor(a, b);

        expect(actual).toEqual(expected);
    });
});

describe('min', () => {
    it('returns a vector containing the minimum dimensions from the input vectors', () => {
        let a = {
            x: 30,
            y: 10
        };

        let b = {
            x: 20,
            y: 30
        };

        let expected = {
            x: 20,
            y: 10
        };

        let actual = min(a, b);

        expect(actual).toEqual(expected);
    });
});

describe('halfMidpoint', () => {
    it('returns the correct position', function () {
        let a = {
            x: 480,
            y: 350
        };

        let b = {
            x: 500,
            y: 400
        };

        let expected = {
            x: 10,
            y: 25
        };

        let actual = halfMidpoint(a, b);

        expect(actual).toEqual(expected);
    });
});
