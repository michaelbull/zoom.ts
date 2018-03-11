import {
    scale,
    scale3d,
    supports3dTransformations,
    TEST3D_HEIGHT,
    TEST3D_ID,
    TEST3D_STYLE,
    TEST3D_WIDTH,
    translate,
    translate3d,
    Vector2
} from '../../../src/zoom';
import * as vendor from '../../../src/browser/vendor';

describe('translate', () => {
    it('should return the transformation', () => {
        expect(translate(new Vector2(50, 60))).toBe('translate(50px, 60px)');
    });
});

describe('translate3d', () => {
    it('should return the transformation', () => {
        expect(translate3d(new Vector2(70, 80))).toBe('translate3d(70px, 80px, 0)');
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

describe('supports3dTransformations', () => {
    describe('if the perspective vendor property is undefined', () => {
        beforeEach(() => {
            spyOn(vendor, 'vendorProperty').and.returnValue(undefined);
        });

        it('should return false', () => {
            let style: any = {};
            expect(supports3dTransformations(style)).toBe(false);
        });
    });

    describe('if the perspective vendor property is not prefixed with "Webkit"', () => {
        beforeEach(() => {
            spyOn(vendor, 'vendorProperty').and.returnValue('MozPerspective');
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
            spyOn(vendor, 'vendorProperty').and.returnValue('WebkitPerspective');
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
