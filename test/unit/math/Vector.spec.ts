import { Bounds } from '../../../lib/math/Bounds';
import {
    centrePadding,
    centrePosition,
    centreTranslation
} from '../../../lib/math/Centre';
import {
    addVectors,
    divideVectors,
    minimizeVectors,
    minimumDivisor,
    positionOf,
    scaleVector,
    shrinkVector,
    sizeOf,
    subtractVectors,
    Vector2
} from '../../../lib/math/Vector2';

describe('positionOf', () => {
    it('should return a vector', () => {
        let rect: any = {
            left: 100,
            top: 50
        };

        expect(positionOf(rect)).toEqual([100, 50]);
    });
});

describe('sizeOf', () => {
    it('should return a vector', () => {
        let rect: any = {
            width: 200,
            height: 300
        };

        expect(sizeOf(rect)).toEqual([200, 300]);
    });
});

describe('scaleVector', () => {
    it('should multiply each dimension by the scale factor', () => {
        expect(scaleVector([50, 100], 10)).toEqual([500, 1000]);
    });
});

describe('shrinkVector', () => {
    it('should divide each dimension by the scale factor', () => {
        expect(shrinkVector([20, 30], 5)).toEqual([4, 6]);
    });
});

describe('addVectors', () => {
    it('should add the two vectors', () => {
        expect(addVectors([10, 20], [35, 60])).toEqual([45, 80]);
    });
});

describe('subtractVectors', () => {
    it('should subtract the second vector from the first', () => {
        expect(subtractVectors([100, 20], [30, 5])).toEqual([70, 15]);
    });
});

describe('divideVectors', () => {
    it('should divide the first vector by the second', () => {
        expect(divideVectors([30, 15], [5, 3])).toEqual([6, 5]);
    });
});

describe('minimizeVectors', () => {
    it('should return a vector containing the minimum dimensions from the input vectors', () => {
        expect(minimizeVectors([30, 10], [20, 30])).toEqual([20, 10]);
    });
});

describe('minimumDivisor', () => {
    it('should return the horizontal division if smaller than the vertical', () => {
        expect(minimumDivisor([900, 500], [300, 50])).toBe(3);
    });

    it('should return the vertical division if smaller than the horizontal', () => {
        expect(minimumDivisor([1000, 600], [10, 50])).toBe(12);
    });
});

describe('centrePadding', () => {
    it('should return the correct amount of padding', () => {
        let outer: Vector2 = [500, 400];
        let inner: Vector2 = [480, 350];
        expect(centrePadding(outer, inner)).toEqual([10, 25]);
    });
});

describe('centrePosition', () => {
    it('should return the correct position', () => {
        let outer: Vector2 = [1920, 1080];
        let bounds: Bounds = {
            position: [300, 200],
            size: [500, 500]
        };

        expect(centrePosition(outer, bounds)).toEqual([410, 90]);
    });
});

describe('centreTranslation', () => {
    it('should return the correct translation', () => {
        let outer: Vector2 = [3800, 1900];
        let bounds: Bounds = {
            position: [250, 250],
            size: [1000, 1000]
        };
        let scale: number = 2;

        expect(centreTranslation(outer, bounds, scale)).toEqual([575, 100]);
    });
});
