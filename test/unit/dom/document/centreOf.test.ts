import {
    centreOf,
    STANDARDS_MODE
} from '../../../../src/dom/document';
import {
    Bounds,
    Vector2
} from '../../../../src/math';

describe('centreOf', () => {
    it('returns the centered bounds', function () {
        let document: any = {
            compatMode: STANDARDS_MODE,
            documentElement: {
                clientWidth: 1920,
                clientHeight: 1080
            }
        };

        let target: Vector2 = {
            x: 1200,
            y: 800
        };

        let position: Vector2 = {
            x: 300,
            y: 50
        };

        let size: Vector2 = {
            x: 600,
            y: 300
        };

        let expected: Bounds = {
            position: {
                x: 60,
                y: 190
            },
            size: {
                x: 1200,
                y: 600
            }
        };

        let actual = centreOf(document, position, size, target);

        expect(actual).toEqual(expected);
    });
});
