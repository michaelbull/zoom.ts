import {
    addVectors,
    centrePadding,
    centrePosition,
    divideVectors,
    shrinkVector,
    Vector,
    minimizeVectors,
    minimumScale,
    scaleVector,
    positionFrom,
    sizeFrom,
    subtractVectors,
    translateToCentre
} from '../../../lib/math/Vector';

describe('positionFrom', () => {
    it('should return left as the x value', () => {
        let rect: any = { left: 100 };
        expect(positionFrom(rect)[0]).toBe(100);
    });

    it('should return top as the y value', () => {
        let rect: any = { top: 50 };
        expect(positionFrom(rect)[1]).toBe(50);
    });
});

describe('sizeFrom', () => {
    it('should return the width as the x value', () => {
        let rect: any = { width: 200 };
        expect(sizeFrom(rect)[0]).toBe(200);
    });

    it('should return the height as the y value', () => {
        let rect: any = { height: 300 };
        expect(sizeFrom(rect)[1]).toBe(300);
    });
});

describe('scaleVector', () => {
    it('should multiply the x value', () => {
        expect(scaleVector([50, 100], 10)[0]).toBe(500);
    });

    it('should multiply the y value', () => {
        expect(scaleVector([100, 200], 3)[1]).toBe(600);
    });
});

describe('shrinkVector', () => {
    it('should divide the x value', () => {
        expect(shrinkVector([20, 30], 5)[0]).toBe(4);
    });

    it('should divide the y value', () => {
        expect(shrinkVector([140, 280], 4)[1]).toBe(70);
    });
});

describe('addVectors', () => {
    it('should add the x values', () => {
        expect(addVectors([10, 20], [35, 60])[0]).toBe(45);
    });

    it('should add the y values', () => {
        expect(addVectors([50, 70], [40, 10])[1]).toBe(80);
    });
});

describe('subtractVectors', () => {
    it('should subtract the x values', () => {
        expect(subtractVectors([100, 20], [30, 5])[0]).toBe(70);
    });

    it('should subtract the y values', () => {
        expect(subtractVectors([230, 7], [50, 20])[0]).toBe(180);
    });
});

describe('divideVectors', () => {
    it('should divide the x values', () => {
        expect(divideVectors([30, 5], [5, 1])[0]).toBe(6);
    });

    it('should divide the y values', () => {
        expect(divideVectors([10, 50], [10, 2])[1]).toBe(25);
    });
});

describe('minimizeVectors', () => {
    it('should return the minimum x value', () => {
        expect(minimizeVectors([30, 10], [20, 30])[0]).toBe(20);
    });

    it('should return the minimum y value', () => {
        expect(minimizeVectors([50, 15], [10, 13])[1]).toBe(13);
    });
});

describe('minimumScale', () => {
    it('should calculate the minimum vertical scale', () => {
        expect(minimumScale([900, 500], [300, 50])).toBe(3);
    });

    it('should calculate the minimum horizontal scale', () => {
        expect(minimumScale([1000, 600], [10, 50])).toBe(12);
    });
});

describe('centrePadding', () => {
    it('should calculate the vertical padding', () => {
        let outer: Vector = [500, 400];
        let inner: Vector = [480, 350];
        expect(centrePadding(outer, inner)[0]).toBe(10);
    });

    it('should calculate the horizontal padding', () => {
        let outer: Vector = [400, 500];
        let inner: Vector = [300, 450];
        expect(centrePadding(outer, inner)[1]).toBe(25);
    });
});

describe('centrePosition', () => {
    it('should calculate the x position', () => {
        let outer: Vector = [500, 500];
        let inner: Vector = [200, 200];
        let innerPosition: Vector = [100, 100];

        expect(centrePosition(outer, inner, innerPosition)[0]).toBe(50);
    });

    it('should calculate the y position', () => {
        let outer: Vector = [800, 800];
        let inner: Vector = [400, 400];
        let innerPosition: Vector = [30, 30];

        expect(centrePosition(outer, inner, innerPosition)[1]).toBe(170);
    });
});

describe('translateToCentre', () => {
    it('should return the translated x value', () => {
        let outer: Vector = [650, 650];
        let inner: Vector = [250, 250];
        let innerPosition: Vector = [20, 20];
        let scale: number = 2;

        expect(translateToCentre(outer, inner, innerPosition, scale)[0]).toBe(90);
    });

    it('should return the translated y value', () => {
        let outer: Vector = [910, 910];
        let inner: Vector = [335, 335];
        let innerPosition: Vector = [100, 100];
        let scale: number = 1.5;

        expect(translateToCentre(outer, inner, innerPosition, scale)[1]).toBe(125);
    });
});
