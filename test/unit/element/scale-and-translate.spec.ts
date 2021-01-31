import { ScaleAndTranslate } from '../../../src/element';
import {
    Bounds,
    Vector2
} from '../../../src/math';

let viewport = new Vector2(1920, 1080);

jest.mock('../../../src/browser/document', () => ({
    viewportSize: jest.fn(() => viewport)
}));

describe('ScaleAndTranslate', () => {
    describe('toString2d', () => {
        it('returns the correct string', function () {
            let transformation = new ScaleAndTranslate(100, new Vector2(200, 300));
            expect(transformation.toString2d()).toBe('scale(100) translate(200px, 300px)');
        });
    });

    describe('toString3d', () => {
        it('returns the correct string', function () {
            let transformation = new ScaleAndTranslate(400, new Vector2(500, 600));
            expect(transformation.toString3d()).toBe('scale3d(400, 400, 1) translate3d(500px, 600px, 0)');
        });
    });

    describe('centreOf', () => {
        it('returns the correct scale and translation', () => {
            let target = new Vector2(800, 400);
            let position = new Vector2(200, 50);
            let size = new Vector2(400, 200);
            let bounds = new Bounds(position, size);

            let expected = new ScaleAndTranslate(2, new Vector2(280, 195));
            let actual = ScaleAndTranslate.centreOf(target, bounds);

            expect(actual).toEqual(expected);
        });
    });
});
