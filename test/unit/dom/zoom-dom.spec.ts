import { ZoomDOM } from '../../../src/dom/zoom-dom';
import * as element from '../../../src/element/element';

describe('ZoomDOM', () => {
    describe('useExisting', () => {
        describe('when the fullSrc of the image is equal to the src attribute', () => {
            let image: any;
            let parent: any;
            let grandparent: any;
            let dom: ZoomDOM;

            beforeEach(() => {
                image = { src: 'example-src' };
                parent = jasmine.createSpy('parent');
                grandparent = jasmine.createSpy('grandparent');
                spyOn(element, 'fullSrc').and.returnValue('example-src');

                dom = ZoomDOM.useExisting(image, parent, grandparent);
            });

            describe('overlay', () => {
                it('should be defined', () => {
                    expect(dom.overlay).toBeDefined();
                });
            });

            describe('wrapper', () => {
                it('should be defined', () => {
                    expect(dom.wrapper).toBeDefined();
                });

                it('should wrap the grandparent', () => {
                    expect(dom.wrapper.element).toBe(grandparent);
                });
            });

            describe('container', () => {
                it('should be defined', () => {
                    expect(dom.container).toBeDefined();
                });

                it('should wrap the parent', () => {
                    expect(dom.container.element).toBe(parent);
                });
            });

            describe('image', () => {
                it('should be defined', () => {
                    expect(dom.image).toBeDefined();
                });

                it('should wrap the image', () => {
                    expect(dom.image.element).toBe(image);
                });
            });

            describe('clone', () => {
                it('should be undefined', () => {
                    expect(dom.clone).toBeUndefined();
                });
            });
        });

        describe('when the fullSrc of the image is not equal to the src attribute', () => {
            let image: any;
            let parent: any;
            let grandparent: any;
            let containerSecondChild: any;
            let dom: ZoomDOM;

            beforeEach(() => {
                image = { src: 'example-src' };
                containerSecondChild = jasmine.createSpy('containerSecondChild');
                parent = {
                    children: {
                        item: (index: number) => {
                            if (index === 1) {
                                return containerSecondChild;
                            } else {
                                fail();
                            }
                        }
                    }
                };
                grandparent = jasmine.createSpy('grandparent');
                spyOn(element, 'fullSrc').and.returnValue('a-different-src');

                dom = ZoomDOM.useExisting(image, parent, grandparent);
            });

            describe('overlay', () => {
                it('should be defined', () => {
                    expect(dom.overlay).toBeDefined();
                });
            });

            describe('wrapper', () => {
                it('should be defined', () => {
                    expect(dom.wrapper).toBeDefined();
                });

                it('should wrap the grandparent', () => {
                    expect(dom.wrapper.element).toBe(grandparent);
                });
            });

            describe('container', () => {
                it('should be defined', () => {
                    expect(dom.container).toBeDefined();
                });

                it('should wrap the parent', () => {
                    expect(dom.container.element).toBe(parent);
                });
            });

            describe('image', () => {
                it('should be defined', () => {
                    expect(dom.image).toBeDefined();
                });

                it('should wrap the image', () => {
                    expect(dom.image.element).toBe(image);
                });
            });

            describe('clone', () => {
                it('should be defined', () => {
                    expect(dom.clone).toBeDefined();
                });

                it('should wrap the second child of the container', () => {
                    expect(dom.clone!.element).toBe(containerSecondChild);
                });
            });
        });
    });

    describe('create', () => {
        describe('when the fullSrc of the image is equal to the src attribute', () => {
            let image: any;
            let dom: ZoomDOM;

            beforeEach(() => {
                image = { src: 'example-src' };
                spyOn(element, 'fullSrc').and.returnValue('example-src');

                dom = ZoomDOM.create(image);
            });

            describe('overlay', () => {
                it('should be defined', () => {
                    expect(dom.overlay).toBeDefined();
                });
            });

            describe('wrapper', () => {
                it('should be defined', () => {
                    expect(dom.wrapper).toBeDefined();
                });
            });

            describe('container', () => {
                it('should be defined', () => {
                    expect(dom.container).toBeDefined();
                });
            });

            describe('image', () => {
                it('should be defined', () => {
                    expect(dom.image).toBeDefined();
                });

                it('should wrap the image', () => {
                    expect(dom.image.element).toBe(image);
                });
            });

            describe('clone', () => {
                it('should be undefined', () => {
                    expect(dom.clone).toBeUndefined();
                });
            });
        });

        describe('when the fullSrc of the image is not equal to the src attribute', () => {
            let image: any;
            let dom: ZoomDOM;

            beforeEach(() => {
                image = { src: 'example-src' };
                spyOn(element, 'fullSrc').and.returnValue('a-different-src');

                dom = ZoomDOM.create(image);
            });

            describe('overlay', () => {
                it('should be defined', () => {
                    expect(dom.overlay).toBeDefined();
                });
            });

            describe('wrapper', () => {
                it('should be defined', () => {
                    expect(dom.wrapper).toBeDefined();
                });
            });

            describe('container', () => {
                it('should be defined', () => {
                    expect(dom.container).toBeDefined();
                });
            });

            describe('image', () => {
                it('should be defined', () => {
                    expect(dom.image).toBeDefined();
                });

                it('should wrap the image', () => {
                    expect(dom.image.element).toBe(image);
                });
            });

            describe('clone', () => {
                it('should be defined', () => {
                    expect(dom.clone).toBeDefined();
                });
            });
        });
    });

    describe('appendContainerToWrapper', () => {
        it('should append the container element to the wrapper element', () => {
            let overlay: any = jasmine.createSpy('overlay');
            let wrapper: any = {
                element: {
                    appendChild: jasmine.createSpy('appendChild')
                }
            };
            let container: any = {
                element: jasmine.createSpy('element')
            };
            let image: any = jasmine.createSpy('image');

            let dom = new ZoomDOM(overlay, wrapper, container, image);
            dom.appendContainerToWrapper();

            expect(wrapper.element.appendChild).toHaveBeenCalledWith(container.element);
        });
    });

    describe('replaceImageWithWrapper', () => {
        it('should replace the image element with the wrapper element on the image parent', () => {
            let overlay: any = jasmine.createSpy('overlay');
            let wrapper: any = {
                element: jasmine.createSpy('element')
            };
            let container: any = jasmine.createSpy('container');
            let image: any = {
                element: {
                    parentElement: {
                        replaceChild: jasmine.createSpy('replaceChild')
                    }
                }
            };

            let dom = new ZoomDOM(overlay, wrapper, container, image);
            dom.replaceImageWithWrapper();

            expect(image.element.parentElement.replaceChild).toHaveBeenCalledWith(wrapper.element, image.element);
        });
    });

    describe('appendImageToContainer', () => {
        it('should append the image element to the container element', () => {
            let overlay: any = jasmine.createSpy('overlay');
            let wrapper: any = jasmine.createSpy('wrapper');
            let container: any = {
                element: {
                    appendChild: jasmine.createSpy('appendChild')
                }
            };
            let image: any = {
                element: jasmine.createSpy('element')
            };

            let dom = new ZoomDOM(overlay, wrapper, container, image);
            dom.appendImageToContainer();

            expect(container.element.appendChild).toHaveBeenCalledWith(image.element);
        });
    });

    describe('appendCloneToContainer', () => {
        it('should append the clone element to the container element', () => {
            let overlay: any = jasmine.createSpy('overlay');
            let wrapper: any = jasmine.createSpy('wrapper');
            let container: any = {
                element: {
                    appendChild: jasmine.createSpy('appendChild')
                }
            };
            let image: any = jasmine.createSpy('image');
            let clone: any = {
                element: jasmine.createSpy('element')
            };

            let dom = new ZoomDOM(overlay, wrapper, container, image, clone);
            dom.appendCloneToContainer();

            expect(container.element.appendChild).toHaveBeenCalledWith(clone.element);
        });
    });

    describe('replaceImageWithClone', () => {
        let clone: any;
        let image: any;

        beforeEach(() => {
            clone = {
                show: jasmine.createSpy('show')
            };
            image = {
                hide: jasmine.createSpy('hide')
            };

            let overlay: any = jasmine.createSpy('overlay');
            let wrapper: any = jasmine.createSpy('wrapper');
            let container: any = jasmine.createSpy('container');

            let dom = new ZoomDOM(overlay, wrapper, container, image, clone);
            dom.replaceImageWithClone();
        });

        it('should show the clone', () => {
            expect(clone.show).toHaveBeenCalled();
        });

        it('should hide the image', () => {
            expect(image.hide).toHaveBeenCalled();
        });
    });

    describe('replaceCloneWithImage', () => {
        let clone: any;
        let image: any;

        beforeEach(() => {
            clone = {
                hide: jasmine.createSpy('hide')
            };
            image = {
                show: jasmine.createSpy('show')
            };

            let overlay: any = jasmine.createSpy('overlay');
            let wrapper: any = jasmine.createSpy('wrapper');
            let container: any = jasmine.createSpy('container');

            let dom = new ZoomDOM(overlay, wrapper, container, image, clone);
            dom.replaceCloneWithImage();
        });

        it('should show the image', () => {
            expect(image.show).toHaveBeenCalled();
        });

        it('should hide the clone', () => {
            expect(clone.hide).toHaveBeenCalled();
        });
    });

    describe('fixWrapperHeight', () => {
        it('should set the height style property equal to the height of the image element', () => {
            let overlay: any = jasmine.createSpy('overlay');
            let wrapper: any = {
                element: {
                    style: {
                        height: 'unset'
                    }
                }
            };
            let container: any = jasmine.createSpy('container');
            let image: any = {
                element: {
                    height: 50
                }
            };

            let dom = new ZoomDOM(overlay, wrapper, container, image);
            dom.fixWrapperHeight();

            expect(wrapper.element.style.height).toEqual('50px');
        });
    });

    describe('collapsed', () => {
        let overlay: any;
        let wrapper: any;
        let image: any;

        beforeEach(() => {
            overlay = { removeFrom: jasmine.createSpy('removeFrom') };
            wrapper = { finishCollapsing: jasmine.createSpy('finishCollapsing') };
            let container: any = jasmine.createSpy('container');
            image = { deactivate: jasmine.createSpy('deactivate') };

            let dom = new ZoomDOM(overlay, wrapper, container, image);

            dom.collapsed();
        });

        it('should remove the overlay', () => {
            expect(overlay.removeFrom).toHaveBeenCalledWith(document.body);
        });

        it('should deactivate the image', () => {
            expect(image.deactivate).toHaveBeenCalled();
        });

        it('should finish collapsing the wrapper', () => {
            expect(wrapper.finishCollapsing).toHaveBeenCalled();
        });
    });

    describe('showCloneIfLoaded', () => {
        describe('if the clone is loaded and hidden', () => {
            let dom: ZoomDOM;
            let replaceImageWithClone: jasmine.Spy;

            beforeEach(() => {
                let overlay: any = jasmine.createSpy('overlay');
                let wrapper: any = jasmine.createSpy('wrapper');
                let container: any = jasmine.createSpy('container');
                let image: any = jasmine.createSpy('image');
                let clone: any = {
                    isLoaded: () => true,
                    isHidden: () => true
                };

                dom = new ZoomDOM(overlay, wrapper, container, image, clone);
                replaceImageWithClone = spyOn(dom, 'replaceImageWithClone');

                dom.showCloneIfLoaded();
            });

            it('should replace the image with the clone', () => {
                expect(replaceImageWithClone).toHaveBeenCalled();
            });
        });

        describe('if the clone is loaded but not hidden', () => {
            let dom: ZoomDOM;
            let replaceImageWithClone: jasmine.Spy;

            beforeEach(() => {
                let overlay: any = jasmine.createSpy('overlay');
                let wrapper: any = jasmine.createSpy('wrapper');
                let container: any = jasmine.createSpy('container');
                let image: any = jasmine.createSpy('image');
                let clone: any = {
                    isLoaded: () => true,
                    isHidden: () => false
                };

                dom = new ZoomDOM(overlay, wrapper, container, image, clone);
                replaceImageWithClone = spyOn(dom, 'replaceImageWithClone');

                dom.showCloneIfLoaded();
            });

            it('should not replace the image with the clone', () => {
                expect(replaceImageWithClone).toHaveBeenCalledTimes(0);
            });
        });

        describe('if the clone is not loaded but hidden', () => {
            let dom: ZoomDOM;
            let replaceImageWithClone: jasmine.Spy;

            beforeEach(() => {
                let overlay: any = jasmine.createSpy('overlay');
                let wrapper: any = jasmine.createSpy('wrapper');
                let container: any = jasmine.createSpy('container');
                let image: any = jasmine.createSpy('image');
                let clone: any = {
                    isLoaded: () => false,
                    isHidden: () => true
                };

                dom = new ZoomDOM(overlay, wrapper, container, image, clone);
                replaceImageWithClone = spyOn(dom, 'replaceImageWithClone');

                dom.showCloneIfLoaded();
            });

            it('should not replace the image with the clone', () => {
                expect(replaceImageWithClone).toHaveBeenCalledTimes(0);
            });
        });

        describe('if the clone is not loaded and not hidden', () => {
            let dom: ZoomDOM;
            let replaceImageWithClone: jasmine.Spy;

            beforeEach(() => {
                let overlay: any = jasmine.createSpy('overlay');
                let wrapper: any = jasmine.createSpy('wrapper');
                let container: any = jasmine.createSpy('container');
                let image: any = jasmine.createSpy('image');
                let clone: any = {
                    isLoaded: () => false,
                    isHidden: () => false
                };

                dom = new ZoomDOM(overlay, wrapper, container, image, clone);
                replaceImageWithClone = spyOn(dom, 'replaceImageWithClone');

                dom.showCloneIfLoaded();
            });

            it('should not replace the image with the clone', () => {
                expect(replaceImageWithClone).toHaveBeenCalledTimes(0);
            });
        });
    });
});
