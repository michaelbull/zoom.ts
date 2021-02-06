import { Vector2 } from '../../../src/math';
import {
    transform,
    transform3d,
    Transformation,
    transformToCentre
} from '../../../src/style';

let viewport = {
    x: 1920,
    y: 1080
};

jest.mock('../../../src/dom/document', () => ({
    viewportSize: jest.fn(() => viewport)
}));

describe('transform', () => {
    it('returns the correct string', function () {
        let transformation: Transformation = {
            scale: 100,
            translate: {
                x: 200,
                y: 300
            }
        };

        expect(transform(transformation)).toBe('scale(100) translate(200px, 300px)');
    });
});

describe('transform3d', () => {
    it('returns the correct string', function () {
        let transformation: Transformation = {
            scale: 400,
            translate: {
                x: 500,
                y: 600
            }
        };

        expect(transform3d(transformation)).toBe('scale3d(400, 400, 1) translate3d(500px, 600px, 0)');
    });
});

describe('transformToCentre', () => {
    it('returns the correct scale and translation', () => {
        let target: Vector2 = {
            x: 800,
            y: 400
        };

        let position: Vector2 = {
            x: 200,
            y: 50
        };

        let size: Vector2 = {
            x: 400,
            y: 200
        };

        let expected: Transformation = {
            scale: 2,
            translate: {
                x: 280,
                y: 195
            }
        };

        let actual = transformToCentre(position, size, target);

        expect(actual).toEqual(expected);
    });
});
