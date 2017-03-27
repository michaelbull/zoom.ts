import {
    addMatrices,
    calculateScale,
    centrePadding,
    centrePosition,
    divideMatrices,
    divideMatrix,
    Matrix,
    minimizeMatrices,
    multiplyMatrix,
    positionOf,
    sizeOf,
    subtractMatrices,
    translateToCentre
} from '../../lib/Matrix';

describe('positionOf', () => {
    it('should return left as the x value', () => {
        let rect: any = { left: 100 };
        expect(positionOf(rect)[0]).toBe(100);
    });

    it('should return top as the y value', () => {
        let rect: any = { top: 50 };
        expect(positionOf(rect)[1]).toBe(50);
    });
});

describe('sizeOf', () => {
    it('should return the width as the x value', () => {
        let rect: any = { width: 200 };
        expect(sizeOf(rect)[0]).toBe(200);
    });

    it('should return the height as the y value', () => {
        let rect: any = { height: 300 };
        expect(sizeOf(rect)[1]).toBe(300);
    });
});

describe('multiplyMatrix', () => {
    it('should multiply the x value', () => {
        expect(multiplyMatrix([50, 100], 10)[0]).toBe(500);
    });

    it('should multiply the y value', () => {
        expect(multiplyMatrix([100, 200], 3)[1]).toBe(600);
    });
});

describe('divideMatrix', () => {
    it('should divide the x value', () => {
        expect(divideMatrix([20, 30], 5)[0]).toBe(4);
    });

    it('should divide the y value', () => {
        expect(divideMatrix([140, 280], 4)[1]).toBe(70);
    });
});

describe('addMatrices', () => {
    it('should add the x values', () => {
        expect(addMatrices([10, 20], [35, 60])[0]).toBe(45);
    });

    it('should add the y values', () => {
        expect(addMatrices([50, 70], [40, 10])[1]).toBe(80);
    });
});

describe('subtractMatrices', () => {
    it('should subtract the x values', () => {
        expect(subtractMatrices([100, 20], [30, 5])[0]).toBe(70);
    });

    it('should subtract the y values', () => {
        expect(subtractMatrices([230, 7], [50, 20])[0]).toBe(180);
    });
});

describe('divideMatrices', () => {
    it('should divide the x values', () => {
        expect(divideMatrices([30, 5], [5, 1])[0]).toBe(6);
    });

    it('should divide the y values', () => {
        expect(divideMatrices([10, 50], [10, 2])[1]).toBe(25);
    });
});

describe('minimizeMatrices', () => {
    it('should return the minimum x value', () => {
        expect(minimizeMatrices([30, 10], [20, 30])[0]).toBe(20);
    });

    it('should return the minimum y value', () => {
        expect(minimizeMatrices([50, 15], [10, 13])[1]).toBe(13);
    });
});

describe('calculateScale', () => {
    it('should scale to the viewport width if shorter than the target width', () => {
        let viewport: Matrix = [900, 5000];
        let target: Matrix = [1000, 4000];
        let current: Matrix = [300, 1000];
        expect(calculateScale(viewport, target, current)).toBe(3);
    });

    it('should scale to the viewport height if shorter than the target height', () => {
        let viewport: Matrix = [1000, 800];
        let target: Matrix = [900, 1000];
        let current: Matrix = [100, 200];
        expect(calculateScale(viewport, target, current)).toBe(4);
    });

    it('should scale to the target width if shorter than the viewport width', () => {
        let viewport: Matrix = [500, 800];
        let target: Matrix = [300, 800];
        let current: Matrix = [100, 200];
        expect(calculateScale(viewport, target, current)).toBe(3);
    });

    it('should scale to the target height if shorter than the viewport height', () => {
        let viewport: Matrix = [1200, 1900];
        let target: Matrix = [1200, 1300];
        let current: Matrix = [1, 130];
        expect(calculateScale(viewport, target, current)).toBe(10);
    });
});

describe('centrePadding', () => {
    it('should calculate the vertical padding', () => {
        let outer: Matrix = [500, 400];
        let inner: Matrix = [480, 350];
        expect(centrePadding(outer, inner)[0]).toBe(10);
    });

    it('should calculate the horizontal padding', () => {
        let outer: Matrix = [400, 500];
        let inner: Matrix = [300, 450];
        expect(centrePadding(outer, inner)[1]).toBe(25);
    });
});

describe('centrePosition', () => {
    it('should calculate the x position', () => {
        let outer: Matrix = [500, 500];
        let inner: Matrix = [200, 200];
        let innerPosition: Matrix = [100, 100];

        expect(centrePosition(outer, inner, innerPosition)[0]).toBe(50);
    });

    it('should calculate the y position', () => {
        let outer: Matrix = [800, 800];
        let inner: Matrix = [400, 400];
        let innerPosition: Matrix = [30, 30];

        expect(centrePosition(outer, inner, innerPosition)[1]).toBe(170);
    });
});

describe('translateToCentre', () => {
    it('should return the translated x value', () => {
        let outer: Matrix = [650, 650];
        let inner: Matrix = [250, 250];
        let innerPosition: Matrix = [20, 20];
        let scale: number = 2;

        expect(translateToCentre(outer, inner, innerPosition, scale)[0]).toBe(90);
    });

    it('should return the translated y value', () => {
        let outer: Matrix = [910, 910];
        let inner: Matrix = [335, 335];
        let innerPosition: Matrix = [100, 100];
        let scale: number = 1.5;

        expect(translateToCentre(outer, inner, innerPosition, scale)[1]).toBe(125);
    });
});
