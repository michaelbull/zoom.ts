import { Features } from '../browser/features';
import {
    Config,
    DEFAULT_CONFIG
} from '../config';
import { Container } from '../dom/container';
import {
    fullSrc,
    Image
} from '../dom/image';
import { Wrapper } from '../dom/wrapper';
import { ZoomDOM } from '../dom/zoom-dom';
import { ignoreTransitions } from '../element/transition';
import { Bounds } from '../math/bounds';
import { Vector2 } from '../math/vector2';
import { DismissListeners } from './dismiss-listener';
import { ZoomResizedListener } from './resized-listener';

export class ZoomListener implements EventListenerObject {
    private target: any;
    private features: Features;
    private config: Config;

    constructor(target: any, features: Features, config: Config = DEFAULT_CONFIG) {
        this.target = target;
        this.features = features;
        this.config = config;
    }

    handleEvent(evt: MouseEvent): void {
        let image = evt.target;
        if (!(image instanceof HTMLImageElement) || !image.classList.contains(Image.CLASS)) {
            return;
        }

        let parent = image.parentElement;
        if (!(parent instanceof HTMLElement)) {
            return;
        }

        let wrapper: HTMLElement;
        let previouslyZoomed: boolean;

        if (parent.classList.contains(Wrapper.CLASS)) {
            previouslyZoomed = false;
            wrapper = parent;
        } else if (parent.classList.contains(Container.CLASS)) {
            previouslyZoomed = true;

            let grandparent = parent.parentElement;
            if (grandparent instanceof HTMLElement && grandparent.classList.contains(Wrapper.CLASS)) {
                wrapper = grandparent;
            } else {
                return;
            }
        } else {
            return;
        }

        evt.preventDefault();
        evt.stopPropagation();

        if (evt.metaKey || evt.ctrlKey) {
            window.open(fullSrc(wrapper, image), '_blank');
        } else {
            this.target.removeEventListener('click', this);

            let dom: ZoomDOM;
            if (previouslyZoomed) {
                dom = ZoomDOM.useExisting(image);
            } else {
                dom = ZoomDOM.setup(image);
                dom.replaceContainerWithImage();
                dom.appendImageToContainer();
                dom.appendCloneToContainer();
            }

            let showCloneListener: EventListener | undefined;

            if (dom.clone !== undefined) {
                if (dom.clone.isLoaded()) {
                    dom.replaceImageWithClone();
                } else {
                    showCloneListener = dom.createCloneLoadedListener();
                    dom.clone.element.addEventListener('load', showCloneListener);
                }
            }

            let targetSize = dom.wrapper.targetSize();

            if (this.features.hasTransform && this.features.hasTransitions) {
                this.zoomTransition(dom, targetSize, showCloneListener);
            } else {
                this.zoomInstant(dom, targetSize, showCloneListener);
            }
        }
    }

    private zoomInstant(dom: ZoomDOM, targetSize: Vector2, showCloneListener?: EventListener): void {
        let resizedListener = new ZoomResizedListener(dom, this.features, targetSize);

        let dismissListeners = DismissListeners.create(this.config.scrollDismissPx, () => {
            dismissListeners.removeFrom(window, dom.container.element);
            window.removeEventListener('resize', resizedListener);
            dom.removeCloneLoadedListener(showCloneListener);

            dom.wrapper.collapsed();
            dom.container.resetBounds();
            this.collapsed(dom);
        });

        dom.overlay.appendTo(document.body);
        dom.wrapper.expanded();
        dom.fixWrapperHeight();
        dom.image.activate();
        dom.container.setBounds(Bounds.centreOf(document, targetSize, resizedListener.bounds));

        window.addEventListener('resize', resizedListener);
        dismissListeners.addTo(window, dom.container.element);
    }

    private zoomTransition(dom: ZoomDOM, targetSize: Vector2, showCloneListener?: EventListener): void {
        let transitionEnd = this.features.transitionEndEvent as string;
        let transitionProperty = this.features.transitionProperty as string;
        let transformProperty = this.features.transformProperty as string;

        let resizedListener = new ZoomResizedListener(dom, this.features, targetSize);

        let expandedListener = (): void => {
            dom.showCloneIfLoaded();
            dom.wrapper.finishExpanding();
            dom.wrapper.expanded();

            ignoreTransitions(dom.container.element, transitionProperty, () => {
                dom.container.resetStyle(transformProperty);
                dom.container.setBounds(Bounds.centreOf(document, targetSize, resizedListener.bounds));
            });

            dom.container.element.removeEventListener(transitionEnd, expandedListener);
        };

        let dismissListeners = DismissListeners.create(this.config.scrollDismissPx, () => {
            dismissListeners.removeFrom(window, dom.container.element);
            window.removeEventListener('resize', resizedListener);
            dom.removeCloneLoadedListener(showCloneListener);

            dom.overlay.hide();
            dom.wrapper.startCollapsing();

            let collapsedListener = (): void => {
                this.collapsed(dom);
                dom.container.element.removeEventListener(transitionEnd, collapsedListener);
            };
            dom.container.element.addEventListener(transitionEnd, collapsedListener);

            if (dom.wrapper.isExpanding()) {
                dom.container.element.removeEventListener(transitionEnd, expandedListener);
                dom.container.resetStyle(transformProperty);
                dom.wrapper.finishExpanding();
            } else {
                ignoreTransitions(dom.container.element, transitionProperty, () => {
                    dom.container.fillViewport(this.features, targetSize, resizedListener.bounds);
                });

                dom.container.resetStyle(transformProperty);
                dom.container.resetBounds();
                dom.wrapper.collapsed();
            }
        });

        dom.overlay.appendTo(document.body);
        dom.wrapper.startExpanding();
        dom.fixWrapperHeight();
        dom.image.activate();
        dom.container.element.addEventListener(transitionEnd, expandedListener);
        dom.container.fillViewport(this.features, targetSize, resizedListener.bounds);

        dismissListeners.addTo(window, dom.container.element);
        window.addEventListener('resize', resizedListener);
    }

    private collapsed(dom: ZoomDOM): void {
        dom.replaceCloneWithImage();
        dom.overlay.removeFrom(document.body);
        dom.image.deactivate();
        dom.wrapper.finishCollapsing();

        setTimeout(() => {
            this.target.addEventListener('click', this);
        }, 1);
    }
}
