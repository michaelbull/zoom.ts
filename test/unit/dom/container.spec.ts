import {
    Bounds,
    Container,
    ScaleAndTranslate,
    Vector2
} from '../../../src/zoom';
import * as style from '../../../src/element/style';

describe('Container', () => {
    describe('create', () => {
        let container: Container;

        beforeEach(() => {
            let element: any = {
                className: 'example-class'
            };

            spyOn(document, 'createElement').and.callFake((tagName: string) => {
                if (tagName === 'div') {
                    return element;
                } else {
                    fail();
                }
            });

            container = Container.create();
        });

        it('should set the class name', () => {
            expect(container.element.className).toEqual(Container.CLASS);
        });
    });

    describe('clone', () => {
        it('should return the second child', () => {
            let clone: any = jasmine.createSpy('clone');

            let element: any = {
                children: {
                    item: (index: number) => {
                        if (index === 1) {
                            return clone;
                        } else {
                            fail();
                        }
                    }
                }
            };

            let container = new Container(element);

            expect(container.clone()).toEqual(clone);
        });
    });

    describe('setBounds', () => {
        it('should call Bounds.applyTo with the element style', () => {
            let bounds: any = {
                applyTo: jasmine.createSpy('applyTo')
            };

            let element: any = {
                style: jasmine.createSpy('style')
            };

            let container = new Container(element);
            container.setBounds(bounds);

            expect(bounds.applyTo).toHaveBeenCalledWith(element.style);
        });
    });

    describe('resetBounds', () => {
        it('should call setBounds with the element style and empty values', () => {
            let setBounds = spyOn(style, 'setBounds');
            let element: any = {
                style: jasmine.createSpy('style')
            };

            let container = new Container(element);
            container.resetBounds();

            expect(setBounds).toHaveBeenCalledWith(element.style, '', '', '', '');
        });
    });

    describe('resetStyle', () => {
        it('should call resetStyle with the element style and property', () => {
            let resetStyle = spyOn(style, 'resetStyle');
            let element: any = {
                style: jasmine.createSpy('style')
            };

            let container = new Container(element);
            container.resetStyle('example');

            expect(resetStyle).toHaveBeenCalledWith(element.style, 'example');
        });
    });

    describe('fillViewport', () => {
        let container: Container;
        let target = new Vector2(1, 2);
        let bounds = new Bounds(new Vector2(3, 4), new Vector2(5, 6));

        beforeEach(() => {
            spyOn(ScaleAndTranslate, 'centreOf').and.returnValue(new ScaleAndTranslate(100, new Vector2(400, 500)));

            let element: any = {
                style: {
                    transform: 'unset'
                }
            };

            container = new Container(element);
        });

        describe('when transform3d is available', () => {
            it('should return a 3d transformation', () => {
                let features: any = {
                    hasTransform3d: true,
                    transformProperty: 'transform'
                };

                container.fillViewport(features, target, bounds);

                expect(container.element.style.transform).toEqual('scale3d(100, 100, 1) translate3d(400px, 500px, 0)');
            });
        });

        describe('when transform3d is unavailable', () => {
            it('should return a 2d transformation', () => {
                let features: any = {
                    hasTransform3d: false,
                    transformProperty: 'transform'
                };

                container.fillViewport(features, target, bounds);

                expect(container.element.style.transform).toEqual('scale(100) translate(400px, 500px)');
            });
        });
    });
});
