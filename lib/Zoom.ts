import {
    detectFeatures,
    Features
} from './browser/Features';
import {
    Config,
    DEFAULT_CONFIG
} from './Config';
import { Container } from './dom/Container';
import {
    fullSrc,
    Image
} from './dom/Image';
import { ZoomDOM } from './dom/ZoomDOM';
import { ready } from './element/EventListeners';
import { ignoreTransitions } from './element/style/Transition';
import { Bounds } from './math/Bounds';
import { Vector2 } from './math/Vector2';

export function collapsed(config: Config, elements: ZoomDOM): void {
    elements.replaceCloneWithImage();
    elements.overlay.remove();
    elements.image.deactivate();
    elements.wrapper.finishCollapsing();
    setTimeout(() => addZoomListener(config), 1);
}

/**
 * Zoom with no transition.
 */
export function zoomInstant(
    config: Config,
    elements: ZoomDOM,
    target: Vector2,
    showCloneListener: EventListener | undefined
): void {

    let bounds = elements.image.bounds();

    let resizedListener = (): void => {
        let wrapperPosition = elements.wrapper.position();
        bounds = new Bounds(wrapperPosition, bounds.size);

        elements.container.setBounds(Bounds.centreOf(document, target, bounds));
    };

    let removeDismissListeners: () => void;

    let collapseListener = (): void => {
        removeDismissListeners();
        window.removeEventListener('resize', resizedListener);
        elements.removeCloneLoadedListener(showCloneListener);

        elements.wrapper.collapsed();
        elements.container.resetBounds();
        collapsed(config, elements);
    };

    removeDismissListeners = elements.container.addDismissListeners(config, collapseListener);

    elements.overlay.appendTo(document.body);
    elements.wrapper.expanded();
    elements.wrapper.fixHeightTo(elements.image);
    elements.image.activate();
    elements.container.setBounds(Bounds.centreOf(document, target, bounds));
    window.addEventListener('resize', resizedListener);
}

/**
 * Zoom with transition.
 */
export function zoomTransition(
    config: Config,
    elements: ZoomDOM,
    target: Vector2,
    showCloneListener: EventListener | undefined,
    features: Features
): void {
    let bounds = elements.image.bounds();
    let transitionEnd = features.transitionEndEvent as string;
    let transitionProperty = features.transitionProperty as string;
    let transformProperty = features.transformProperty as string;

    let resizedListener = (): void => {
        let wrapperPosition = elements.wrapper.position();
        bounds = new Bounds(wrapperPosition, bounds.size);

        if (elements.wrapper.isTransitioning()) {
            elements.container.fillViewport(features, target, bounds);
        } else {
            elements.container.setBounds(Bounds.centreOf(document, target, bounds));
        }
    };

    let expandedListener = (): void => {
        elements.showCloneIfLoaded();
        elements.wrapper.finishExpanding();
        elements.wrapper.expanded();

        ignoreTransitions(elements.container.element, transitionProperty, () => {
            elements.container.resetStyle(transformProperty);
            elements.container.setBounds(Bounds.centreOf(document, target, bounds));
        });

        elements.container.element.removeEventListener(transitionEnd, expandedListener);
    };

    let removeDismissListeners: () => void;

    let collapseListener = (): void => {
        removeDismissListeners();
        window.removeEventListener('resize', resizedListener);
        elements.removeCloneLoadedListener(showCloneListener);

        elements.overlay.hide();
        elements.wrapper.startCollapsing();

        let collapsedListener = (): void => {
            collapsed(config, elements);
            elements.container.element.removeEventListener(transitionEnd, collapsedListener);
        };
        elements.container.element.addEventListener(transitionEnd, collapsedListener);

        if (elements.wrapper.isExpanding()) {
            elements.container.element.removeEventListener(transitionEnd, expandedListener);
            elements.container.resetStyle(transformProperty);
            elements.wrapper.finishExpanding();
        } else {
            ignoreTransitions(elements.container.element, transitionProperty, () => {
                elements.container.fillViewport(features, target, bounds);
            });

            elements.container.resetStyle(transformProperty);
            elements.container.resetBounds();
            elements.wrapper.collapsed();
        }
    };

    removeDismissListeners = elements.container.addDismissListeners(config, collapseListener);

    elements.overlay.appendTo(document.body);
    elements.wrapper.startExpanding();
    elements.wrapper.fixHeightTo(elements.image);
    elements.image.activate();
    elements.container.element.addEventListener(transitionEnd, expandedListener);
    elements.container.fillViewport(features, target, bounds);
    window.addEventListener('resize', resizedListener);
}

export function clickedZoomable(config: Config, event: MouseEvent, zoomListener: EventListenerObject): void {
    let image = event.target as HTMLImageElement;
    let parent = image.parentElement as HTMLElement;
    let previouslyZoomed = Container.isContainer(parent);
    let wrapper = previouslyZoomed ? parent.parentElement as HTMLElement : parent;

    if (event.metaKey || event.ctrlKey) {
        window.open(fullSrc(wrapper, image), '_blank');
    } else {
        document.body.removeEventListener('click', zoomListener);

        let elements: ZoomDOM;
        if (previouslyZoomed) {
            elements = ZoomDOM.fromExisting(image);
        } else {
            elements = ZoomDOM.fromFresh(image);
            elements.replaceContainerWithImage();
            elements.appendImageToContainer();
            elements.appendCloneToContainer();
        }

        let showCloneListener: EventListener | undefined;

        if (elements.clone !== undefined) {
            if (elements.clone.isLoaded()) {
                elements.replaceImageWithClone();
            } else {
                showCloneListener = elements.createCloneLoadedListener();
                elements.clone.element.addEventListener('load', showCloneListener);
            }
        }

        let target = elements.wrapper.targetSize();
        let features = detectFeatures();

        if (features.hasTransform && features.hasTransitions) {
            zoomTransition(config, elements, target, showCloneListener, features);
        } else {
            zoomInstant(config, elements, target, showCloneListener);
        }
    }
}

export function addZoomListener(config: Config = DEFAULT_CONFIG): void {
    let listener: EventListenerObject = {
        handleEvent(event: MouseEvent): void {
            if (Image.isZoomableImage(event.target)) {
                event.preventDefault();
                event.stopPropagation();
                clickedZoomable(config, event, listener);
            }
        }
    };

    document.body.addEventListener('click', listener);
}

export function listenForZoom(config: Config = DEFAULT_CONFIG): void {
    ready(document, () => addZoomListener(config));
}
