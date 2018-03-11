import { Overlay } from '../../../src/dom/overlay';
import * as element from '../../../src/element/element';

describe('Overlay', () => {
    describe('create', () => {
        let overlay: Overlay;

        beforeEach(() => {
            let overlayElement: any = {
                className: 'example-class'
            };

            spyOn(document, 'createElement').and.callFake((tagName: string) => {
                if (tagName === 'div') {
                    return overlayElement;
                } else {
                    fail();
                }
            });

            overlay = Overlay.create();
        });

        it('should set the class name', () => {
            expect(overlay.element.className).toEqual(Overlay.CLASS);
        });
    });

    describe('appendTo', () => {
        let overlayElement: any;
        let node: any;
        let repaint: jasmine.Spy;
        let overlay: Overlay;

        beforeEach(() => {
            overlayElement = {
                classList: {
                    add: jasmine.createSpy('add')
                }
            };

            node = {
                appendChild: jasmine.createSpy('appendChild')
            };

            repaint = spyOn(element, 'repaint');

            overlay = new Overlay(overlayElement);
            overlay.appendTo(node);
        });

        it('should append the element to the node', () => {
            expect(node.appendChild).toHaveBeenCalledWith(overlayElement);
        });

        it('should repaint the element', () => {
            expect(repaint).toHaveBeenCalledWith(overlayElement);
        });

        it('should add the visible class to the element', () => {
            expect(overlayElement.classList.add).toHaveBeenCalledWith(Overlay.VISIBLE_CLASS);
        });
    });

    describe('removeFrom', () => {
        let overlayElement: any;
        let node: any;
        let overlay: Overlay;

        beforeEach(() => {
            overlayElement = jasmine.createSpy('element');
            node = {
                removeChild: jasmine.createSpy('removeChild')
            };

            overlay = new Overlay(overlayElement);
            overlay.removeFrom(node);
        });

        it('should remove the element from the node as a child', () => {
            expect(node.removeChild).toHaveBeenCalledWith(overlayElement);
        });
    });

    describe('hide', () => {
        it('should remove the visible class', () => {
            let overlayElement: any = {
                classList: {
                    remove: jasmine.createSpy('remove')
                }
            };

            let overlay = new Overlay(overlayElement);
            overlay.hide();

            expect(overlay.element.classList.remove).toHaveBeenCalledWith(Overlay.VISIBLE_CLASS);
        });
    });
});
