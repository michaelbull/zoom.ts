import {
    Bounds,
    STANDARDS_MODE,
    Vector2
} from '../../../src';

describe('Bounds', () => {
    describe('of', () => {
        it('should construct a Bounds object using the position and size of the rect', () => {
            let rect: ClientRect = {
                top: 300,
                right: 5,
                bottom: 50,
                left: 120,
                width: 99,
                height: 100
            };

            let element: any = {
                getBoundingClientRect: jasmine.createSpy('getBoundingClientRect').and.returnValue(rect)
            };

            let actual = Bounds.of(element);
            let expected = new Bounds(new Vector2(120, 300), new Vector2(99, 100));

            expect(actual).toEqual(expected);
        });
    });

    describe('centreOffset', () => {
        it('should return the correct position', () => {
            let outer = new Vector2(1920, 1080);
            let bounds = new Bounds(new Vector2(300, 200), new Vector2(500, 500));

            let expected = new Vector2(410, 90);
            let actual = Bounds.centreOffset(outer, bounds);

            expect(actual).toEqual(expected);
        });
    });

    describe('centreTranslation', () => {
        it('should return the correct translation', () => {
            let outer = new Vector2(3800, 1900);
            let bounds = new Bounds(new Vector2(250, 250), new Vector2(1000, 1000));
            let scale = 2;

            let expected = new Vector2(575, 100);
            let actual = Bounds.centreTranslation(outer, bounds, scale);

            expect(actual).toEqual(expected);
        });
    });

    describe('centreOf', () => {
        it('should return the centered bounds', function () {
            let document: any = {
                compatMode: STANDARDS_MODE,
                documentElement: {
                    clientWidth: 1920,
                    clientHeight: 1080
                }
            };

            let target = new Vector2(1200, 800);
            let position = new Vector2(300, 50);
            let size = new Vector2(600, 300);
            let bounds = new Bounds(position, size);

            let expected = new Bounds(new Vector2(60, 190), new Vector2(1200, 600));
            let actual = Bounds.centreOf(document, target, bounds);

            expect(actual).toEqual(expected);
        });
    });

    describe('applyTo', () => {
        let style: any;

        beforeAll(() => {
            style = {
                left: '5em',
                top: '2em',
                width: '100px',
                maxWidth: '200px',
                height: '50px'
            };

            let bounds = new Bounds(new Vector2(20, 170), new Vector2(95, 240));
            bounds.applyTo(style);
        });

        it('should set the left property', () => {
            expect(style.left).toBe('20px');
        });

        it('should set the top property', () => {
            expect(style.top).toBe('170px');
        });

        it('should set the width property', () => {
            expect(style.width).toBe('95px');
        });

        it('should set the max-width property', () => {
            expect(style.maxWidth).toBe('95px');
        });

        it('should set the height property', () => {
            expect(style.height).toBe('240px');
        });
    });
});
