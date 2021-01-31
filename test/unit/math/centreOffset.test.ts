import {
    Bounds,
    centreOffset,
    Vector2
} from '../../../src/math';

describe('centreOffset', () => {
    it('returns the correct position', () => {
        let outer: Vector2 = {
            x: 1920,
            y: 1080
        };

        let bounds: Bounds = {
            position: {
                x: 300,
                y: 200
            },
            size: {
                x: 500,
                y: 500
            }
        };

        let expected: Vector2 = {
            x: 410,
            y: 90
        };

        let actual = centreOffset(outer, bounds);

        expect(actual).toEqual(expected);
    });
});
