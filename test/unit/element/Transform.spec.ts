import * as Document from '../../../lib/browser/Document';
import * as Vendor from '../../../lib/browser/Vendor';
import {
    Bounds,
    createBounds
} from '../../../lib/element/Bounds';
import {
    centreTransformation,
    expandToViewport,
    scale,
    scale3d,
    ScaleAndTranslate,
    scaleTranslate,
    scaleTranslate3d,
    supports3dTransformations,
    TEST3D_HEIGHT,
    TEST3D_ID,
    TEST3D_STYLE,
    TEST3D_WIDTH,
    translate,
    translate3d
} from '../../../lib/element/Transform';
import * as Vector from '../../../lib/math/Vector';

describe('translate', () => {
    it('should return the transformation', () => {
        expect(translate([50, 60])).toBe('translate(50px, 60px)');
    });
});

describe('translate3d', () => {
    it('should return the transformation', () => {
        expect(translate3d([70, 80])).toBe('translate3d(70px, 80px, 0)');
    });
});

describe('scale', () => {
    it('should return the transformation', () => {
        expect(scale(50)).toBe('scale(50)');
    });
});

describe('scale3d', () => {
    it('should return the transformation', () => {
        expect(scale3d(150)).toBe('scale3d(150, 150, 1)');
    });
});

describe('scaleTranslate', () => {
    it('should return the combined transformation', () => {
        let transformation: ScaleAndTranslate = {
            scale: 100,
            translation: [200, 300]
        };

        expect(scaleTranslate(transformation)).toBe('scale(100) translate(200px, 300px)');
    });
});

describe('scaleTranslate3d', () => {
    it('should return the combined transformation', () => {
        let transformation: ScaleAndTranslate = {
            scale: 400,
            translation: [500, 600]
        };

        expect(scaleTranslate3d(transformation)).toBe('scale3d(400, 400, 1) translate3d(500px, 600px, 0)');
    });
});

describe('centreTransformation', () => {
    let viewportSize: jasmine.Spy;
    let minimizeVectors: jasmine.Spy;
    let minimumDivisor: jasmine.Spy;
    let centreTranslation: jasmine.Spy;

    beforeEach(() => {
        viewportSize = spyOn(Document, 'viewportSize').and.returnValue([1920, 1200]);
        minimizeVectors = spyOn(Vector, 'minimizeVectors').and.returnValue([800, 600]);
        minimumDivisor = spyOn(Vector, 'minimumDivisor').and.returnValue(2);
        centreTranslation = spyOn(Vector, 'centreTranslation').and.returnValue([200, 300]);
    });

    it('should calculate the viewport size', () => {
        centreTransformation([1, 2], createBounds([3, 4], [5, 6]));
        expect(viewportSize).toHaveBeenCalledWith(document);
    });

    it('should cap the target to the viewport size', () => {
        centreTransformation([1, 2], createBounds([3, 4], [5, 6]));
        expect(minimizeVectors).toHaveBeenCalledWith([1920, 1200], [1, 2]);
    });

    it('should calculate the minimum divisor of the capped target and the boundary size', () => {
        centreTransformation([1, 2], createBounds([3, 4], [5, 6]));
        expect(minimumDivisor).toHaveBeenCalledWith([800, 600], [5, 6]);
    });

    it('should calculate the centre translation', () => {
        let bounds: Bounds = createBounds([3, 4], [5, 6]);
        centreTransformation([1, 2], bounds);
        expect(centreTranslation).toHaveBeenCalledWith([1920, 1200], bounds, 2);
    });

    it('should return the correct scale and translation', () => {
        let expected: ScaleAndTranslate = {
            scale: 2,
            translation: [200, 300]
        };

        expect(centreTransformation([1, 2], createBounds([3, 4], [5, 6]))).toEqual(expected);
    });
});

describe('expandToViewport', () => {
    it('should use 3d translation if supported', () => {
        let element: any = { style: {} };
        let capabilities: any = {
            transformProperty: 'transform',
            hasTransform3d: true
        };

        expandToViewport(capabilities, element, [100, 200], createBounds([300, 400], [500, 600]));

        expect(element.style.transform).toBe('scale3d(0.2, 0.2, 1) translate3d(-1750px, -2750px, 0)');
    });

    it('should use 2d translation if 3d is not supported', () => {
        let element: any = { style: {} };
        let capabilities: any = {
            transformProperty: 'webkitTransform',
            hasTransform3d: false
        };

        expandToViewport(capabilities, element, [200, 100], createBounds([1000, 250], [900, 500]));

        expect(element.style.webkitTransform).toBe('scale(0.2) translate(-6250px, -1750px)');
    });
});

describe('supports3dTransformations', () => {
    describe('if the perspective vendor property is undefined', () => {
        beforeEach(() => {
            spyOn(Vendor, 'vendorProperty').and.returnValue(undefined);
        });

        it('should return false', () => {
            let style: any = {};
            expect(supports3dTransformations(style)).toBe(false);
        });
    });

    describe('if the perspective vendor property is not prefixed with "Webkit"', () => {
        beforeEach(() => {
            spyOn(Vendor, 'vendorProperty').and.returnValue('MozPerspective');
        });

        it('should return true', () => {
            let style: any = {};
            expect(supports3dTransformations(style)).toBe(true);
        });
    });

    describe('if the perspective vendor property is prefixed with "Webkit"', () => {
        let style: any;
        let divElement: any;
        let styleElement: any;
        let appendChild: jasmine.Spy;
        let removeChild: jasmine.Spy;

        beforeEach(() => {
            style = {
                WebkitPerspective: ''
            };

            divElement = {
                id: 'div-element',
                offsetWidth: 0,
                offsetHeight: 0,
                style: {
                    position: ''
                }
            };

            styleElement = {
                textContent: 'content'
            };

            spyOn(document, 'createElement').and.callFake((tagName: string): HTMLElement | undefined => {
                if (tagName === 'div') {
                    return divElement;
                } else if (tagName === 'style') {
                    return styleElement;
                } else {
                    fail();
                }
            });

            appendChild = spyOn(document.body, 'appendChild');
            removeChild = spyOn(document.body, 'removeChild');
            spyOn(Vendor, 'vendorProperty').and.returnValue('WebkitPerspective');
        });

        it('should create a test div element', () => {
            supports3dTransformations(style);
            expect(document.createElement).toHaveBeenCalledWith('div');
        });

        it('should set the test div element’s ID to the correct ID', () => {
            supports3dTransformations(style);
            expect(divElement.id).toBe(TEST3D_ID);
        });

        it('should prevent the test div element from affecting the page size', () => {
            supports3dTransformations(style);
            expect(divElement.style.position).toBe('absolute');
        });

        it('should create a test style element', () => {
            supports3dTransformations(style);
            expect(document.createElement).toHaveBeenCalledWith('style');
        });

        it('should set the test style elements text content to the correct CSS', () => {
            supports3dTransformations(style);
            expect(styleElement.textContent).toBe(TEST3D_STYLE);
        });

        it('should append the test div element as a child of the document.body', () => {
            supports3dTransformations(style);
            expect(appendChild).toHaveBeenCalledWith(divElement);
        });

        it('should append the test style element as a child of the document.body', () => {
            supports3dTransformations(style);
            expect(appendChild).toHaveBeenCalledWith(divElement);
        });

        it('should remove the test div element from the document.body', () => {
            supports3dTransformations(style);
            expect(removeChild).toHaveBeenCalledWith(divElement);
        });

        it('should remove the test style element from the document.body', () => {
            supports3dTransformations(style);
            expect(removeChild).toHaveBeenCalledWith(styleElement);
        });

        describe('if the element’s offset size is unmodified by the media query', () => {
            it('should return false', () => {
                expect(supports3dTransformations(style)).toBe(false);
            });
        });

        describe('if the element’s offset size is modified by the media query', () => {
            it('should return true', () => {
                divElement.offsetWidth = TEST3D_WIDTH;
                divElement.offsetHeight = TEST3D_HEIGHT;

                expect(supports3dTransformations(style)).toBe(true);
            });
        });
    });
});
