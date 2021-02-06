import {
    centreTranslation,
    Vector2
} from '../../../src/math';

describe('centreTranslation', () => {
    it('returns the correct translation', () => {
        let outer: Vector2 = {
            x: 3800,
            y: 1900
        };

        let scale = 2;

        let position: Vector2 = {
            x: 250,
            y: 250
        };

        let size: Vector2 = {
            x: 1000,
            y: 1000
        };

        let expected: Vector2 = {
            x: 575,
            y: 100
        };

        let actual = centreTranslation(outer, position, size, scale);

        expect(actual).toEqual(expected);
    });
});
