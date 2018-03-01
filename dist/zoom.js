/*!
 * zoom.ts v7.5.0
 * https://www.michael-bull.com/projects/zoom.ts
 * 
 * Copyright (c) 2017 Michael Bull (https://www.michael-bull.com)
 * @license ISC
 */

(function(l, i, v, e) { v = l.createElement(i); v.async = 1; v.src = '//' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; e = l.getElementsByTagName(i)[0]; e.parentNode.insertBefore(v, e)})(document, 'script');
(function () {
'use strict';

function repaint(element) {
    element.offsetHeight;
}
function targetDimension(element, dimension) {
    var attribute = element.getAttribute("data-" + dimension);
    if (attribute === null) {
        return Infinity;
    }
    else {
        var value = Number(attribute);
        if (isNaN(value)) {
            return Infinity;
        }
        else {
            return value;
        }
    }
}
function resetStyle(element, property) {
    element.style[property] = '';
}
function hasParent(element) {
    return element.parentElement !== null;
}
function hasGrandParent(element) {
    return hasParent(element) && hasParent(element.parentElement);
}

var Vector2 = /** @class */ (function () {
    function Vector2(x, y) {
        this.x = x;
        this.y = y;
    }
    Vector2.fromPosition = function (rect) {
        return new Vector2(rect.left, rect.top);
    };
    Vector2.fromSize = function (rect) {
        return new Vector2(rect.width, rect.height);
    };
    Vector2.prototype.add = function (other) {
        return new Vector2(this.x + other.x, this.y + other.y);
    };
    Vector2.prototype.subtract = function (other) {
        return new Vector2(this.x - other.x, this.y - other.y);
    };
    Vector2.prototype.multiply = function (scale) {
        return new Vector2(this.x * scale, this.y * scale);
    };
    Vector2.prototype.divide = function (scale) {
        return new Vector2(this.x / scale, this.y / scale);
    };
    Vector2.prototype.scale = function (other) {
        return new Vector2(this.x * other.x, this.y * other.y);
    };
    Vector2.prototype.shrink = function (other) {
        return new Vector2(this.x / other.x, this.y / other.y);
    };
    Vector2.min = function (left, right) {
        return new Vector2(Math.min(left.x, right.x), Math.min(left.y, right.y));
    };
    Vector2.prototype.minDivisor = function (other) {
        var scaled = this.shrink(other);
        return Math.min(scaled.x, scaled.y);
    };
    Vector2.halfMidpoint = function (left, right) {
        var midpoint = right.subtract(left);
        return midpoint.divide(2);
    };
    Vector2.targetSizeOf = function (element) {
        return new Vector2(targetDimension(element, 'width'), targetDimension(element, 'height'));
    };
    Vector2.clientSizeOf = function (element) {
        return new Vector2(element.clientWidth, element.clientHeight);
    };
    return Vector2;
}());

var STANDARDS_MODE = 'CSS1Compat';
function isStandardsMode(document) {
    return document.compatMode === STANDARDS_MODE;
}
function rootElement(document) {
    return isStandardsMode(document) ? document.documentElement : document.body;
}
function viewportSize(document) {
    return Vector2.clientSizeOf(rootElement(document));
}
function createDiv(className) {
    var overlay = document.createElement('div');
    overlay.className = className;
    return overlay;
}

var VENDOR_PREFIXES = [
    'Webkit',
    'Moz',
    'ms',
    'O'
];
function vendorProperties(property) {
    var suffix = "" + property.charAt(0).toUpperCase() + property.substr(1);
    var vendorProperties = VENDOR_PREFIXES.map(function (prefix) { return "" + prefix + suffix; });
    return [property].concat(vendorProperties);
}
function vendorProperty(style, property) {
    for (var _i = 0, _a = vendorProperties(property); _i < _a.length; _i++) {
        var vendorProperty_1 = _a[_i];
        if (vendorProperty_1 in style) {
            return vendorProperty_1;
        }
    }
}

function pixels(amount) {
    return amount + "px";
}

var Bounds = /** @class */ (function () {
    function Bounds(position, size) {
        this.position = position;
        this.size = size;
    }
    Bounds.of = function (element) {
        var rect = element.getBoundingClientRect();
        var position = Vector2.fromPosition(rect);
        var size = Vector2.fromSize(rect);
        return new Bounds(position, size);
    };
    Bounds.centreOffset = function (vector, bounds) {
        var halfMidpoint = Vector2.halfMidpoint(bounds.size, vector);
        return halfMidpoint.subtract(bounds.position);
    };
    Bounds.centreTranslation = function (outer, bounds, innerScale) {
        var scaled = bounds.size.multiply(innerScale);
        var centredWithinScaled = bounds.position.add(Vector2.halfMidpoint(scaled, bounds.size));
        var centeredWithinOuter = this.centreOffset(outer, new Bounds(centredWithinScaled, scaled));
        return centeredWithinOuter.divide(innerScale);
    };
    Bounds.centreOf = function (document, target, bounds) {
        var viewport = viewportSize(document);
        var cappedTarget = Vector2.min(viewport, target);
        var factor = cappedTarget.minDivisor(bounds.size);
        var scaled = bounds.size.multiply(factor);
        var centre = this.centreOffset(viewport, new Bounds(bounds.position, scaled));
        return new Bounds(centre, scaled);
    };
    Bounds.prototype.applyTo = function (style) {
        setBounds(style, pixels(this.position.x), pixels(this.position.y), pixels(this.size.x), pixels(this.size.y));
    };
    return Bounds;
}());
function setBounds(style, x, y, width, height) {
    style.left = x;
    style.top = y;
    style.width = width;
    style.maxWidth = width;
    style.height = height;
}

function translate(translation) {
    var x = translation.x, y = translation.y;
    return "translate(" + x + "px, " + y + "px)";
}
function translate3d(translation) {
    var x = translation.x, y = translation.y;
    return "translate3d(" + x + "px, " + y + "px, 0)";
}
function scale(amount) {
    return "scale(" + amount + ")";
}
function scale3d(amount) {
    return "scale3d(" + amount + ", " + amount + ", 1)";
}
function scaleTranslate(transformation) {
    return scale(transformation.scale) + " " + translate(transformation.translation);
}
function scaleTranslate3d(transformation) {
    return scale3d(transformation.scale) + " " + translate3d(transformation.translation);
}
function centreTransformation(target, bounds) {
    var viewport = viewportSize(document);
    var cappedTarget = Vector2.min(viewport, target);
    var scale = cappedTarget.minDivisor(bounds.size);
    var translation = Bounds.centreTranslation(viewport, bounds, scale);
    return {
        scale: scale,
        translation: translation
    };
}
function supports3dTransformations(style) {
    var perspectiveProperty = vendorProperty(style, 'perspective');
    if (perspectiveProperty !== undefined) {
        if ('WebkitPerspective' in style) {
            return testWebkitTransform3d();
        }
        else {
            return true;
        }
    }
    return false;
}
var TEST3D_ID = 'test3d';
var TEST3D_WIDTH = 4;
var TEST3D_HEIGHT = 8;
var TEST3D_STYLE = "" +
    ("#" + TEST3D_ID + "{margin:0;padding:0;border:0;width:0;height:0}") +
    "@media (transform-3d),(-webkit-transform-3d){" +
    ("#" + TEST3D_ID + "{width:" + pixels(TEST3D_WIDTH) + ";height:" + pixels(TEST3D_HEIGHT) + "}") +
    "}";
function testWebkitTransform3d() {
    var element = document.createElement('div');
    element.id = TEST3D_ID;
    // remove the test element from the document flow to avoid affecting document size
    element.style.position = 'absolute';
    var style = document.createElement('style');
    style.textContent = TEST3D_STYLE;
    var body = document.body;
    body.appendChild(style);
    body.appendChild(element);
    var offsetWidth = element.offsetWidth;
    var offsetHeight = element.offsetHeight;
    body.removeChild(style);
    body.removeChild(element);
    return offsetWidth === TEST3D_WIDTH && offsetHeight === TEST3D_HEIGHT;
}

var TRANSITION_END_EVENTS = {
    'WebkitTransition': 'webkitTransitionEnd',
    'MozTransition': 'transitionend',
    'OTransition': 'oTransitionEnd',
    'msTransition': 'MSTransitionEnd',
    'transition': 'transitionend'
};
/**
 * Ignore the transition lifecycle to perform a callback, then restore the element's original transitions.
 */
function ignoreTransitions(element, transitionProperty, callback) {
    var style = element.style;
    style[transitionProperty] = 'initial';
    callback();
    repaint(element);
    resetStyle(element, transitionProperty);
}

function detectFeatures() {
    var style = document.body.style;
    var transformProperty = vendorProperty(style, 'transform');
    var transitionProperty = vendorProperty(style, 'transition');
    var transitionEndEvent;
    var hasTransform = false;
    if (transformProperty !== undefined) {
        hasTransform = true;
    }
    var hasTransitions = false;
    if (transitionProperty !== undefined) {
        transitionEndEvent = TRANSITION_END_EVENTS[transitionProperty];
        hasTransitions = transitionEndEvent !== undefined;
    }
    var hasTransform3d = false;
    if (transformProperty !== undefined) {
        hasTransform3d = supports3dTransformations(document.body.style);
    }
    return {
        transformProperty: transformProperty,
        transitionProperty: transitionProperty,
        transitionEndEvent: transitionEndEvent,
        hasTransform: hasTransform,
        hasTransform3d: hasTransform3d,
        hasTransitions: hasTransitions
    };
}

var DEFAULT_CONFIG = {
    scrollDismissPx: 50,
};

/**
 * Calculates the number of pixels in the document have been scrolled past vertically.
 * @returns {number} The number of pixels in the document have been scrolled past vertically.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollY#Notes
 */
function pageScrollY(context) {
    if (context === void 0) { context = window; }
    if (context.pageYOffset === undefined) {
        return rootElement(context.document).scrollTop;
    }
    else {
        return context.pageYOffset;
    }
}

var ESCAPE_KEY_CODE = 27;
function escKeyPressed(target, listener) {
    return {
        handleEvent: function (event) {
            if (event.keyCode === ESCAPE_KEY_CODE) {
                event.preventDefault();
                event.stopPropagation();
                fireEventListener(target, listener, event);
            }
        }
    };
}
function scrolled(target, start, minAmount, current, listener) {
    return function (event) {
        if (Math.abs(start - current()) >= minAmount) {
            fireEventListener(target, listener, event);
        }
    };
}
/**
 * Executes a callback function when a document has finished loading, or immediately if the document has already
 * finished loading.
 * @param document The document.
 * @param listener The function to execute.
 * @see http://youmightnotneedjquery.com/#ready
 */
function ready(document, listener) {
    if (document.readyState === 'complete') {
        fireEventListener(document, listener, undefined);
    }
    else {
        document.addEventListener('DOMContentLoaded', listener);
    }
}
function fireEventListener(target, listener, event) {
    if (typeof listener === 'function') {
        listener.call(target, event);
    }
    else {
        listener.handleEvent(event);
    }
}

var Container = /** @class */ (function () {
    function Container(element) {
        this.element = element;
    }
    Container.create = function () {
        var element = createDiv(Container.CLASS);
        return new Container(element);
    };
    Container.isContainer = function (element) {
        return element.classList.contains(Container.CLASS);
    };
    Container.prototype.parent = function () {
        return this.element.parentElement;
    };
    Container.prototype.clone = function () {
        return this.element.children.item(1);
    };
    Container.prototype.setBounds = function (bounds) {
        bounds.applyTo(this.element.style);
    };
    Container.prototype.resetBounds = function () {
        setBounds(this.element.style, '', '', '', '');
    };
    Container.prototype.fillViewport = function (features, target, bounds) {
        var transform = centreTransformation(target, bounds);
        var transformProperty = features.transformProperty;
        var style = this.element.style;
        if (features.hasTransform3d) {
            style[transformProperty] = scaleTranslate3d(transform);
        }
        else {
            style[transformProperty] = scaleTranslate(transform);
        }
    };
    Container.prototype.resetStyle = function (property) {
        resetStyle(this.element, property);
    };
    Container.prototype.addDismissListeners = function (config, collapseListener) {
        var _this = this;
        var initialScrollY = pageScrollY();
        var escListener = escKeyPressed(document, collapseListener);
        var scrollListener = scrolled(window, initialScrollY, config.scrollDismissPx, pageScrollY, collapseListener);
        window.addEventListener('scroll', scrollListener);
        document.addEventListener('keyup', escListener);
        this.element.addEventListener('click', collapseListener);
        return function () {
            window.removeEventListener('scroll', scrollListener);
            document.removeEventListener('keyup', escListener);
            _this.element.removeEventListener('click', collapseListener);
        };
    };
    Container.CLASS = 'zoom__container';
    return Container;
}());

var Image = /** @class */ (function () {
    function Image(element) {
        this.element = element;
    }
    Image.isZoomableImage = function (target) {
        return target instanceof HTMLImageElement
            && hasParent(target)
            && hasGrandParent(target)
            && target.classList.contains(this.CLASS);
    };
    Image.prototype.bounds = function () {
        return Bounds.of(this.element);
    };
    Image.prototype.hide = function () {
        this.element.classList.add(Image.HIDDEN_CLASS);
    };
    Image.prototype.show = function () {
        this.element.classList.remove(Image.HIDDEN_CLASS);
    };
    Image.prototype.isHidden = function () {
        return this.element.classList.contains(Image.HIDDEN_CLASS);
    };
    Image.prototype.replaceClone = function (clone) {
        this.show();
        clone.hide();
    };
    Image.prototype.activate = function () {
        this.element.classList.add(Image.ACTIVE_CLASS);
    };
    Image.prototype.deactivate = function () {
        this.element.classList.remove(Image.ACTIVE_CLASS);
    };
    Image.prototype.height = function () {
        return this.element.height;
    };
    Image.CLASS = 'zoom__element';
    Image.HIDDEN_CLASS = 'zoom__element--hidden';
    Image.ACTIVE_CLASS = 'zoom__element--active';
    return Image;
}());
function fullSrc(wrapper, image) {
    var fullSrc = wrapper.getAttribute('data-src');
    if (fullSrc === null) {
        return image.src;
    }
    else {
        return fullSrc;
    }
}

var Clone = /** @class */ (function () {
    function Clone(element) {
        this.element = element;
    }
    Clone.create = function (src) {
        var element = document.createElement('img');
        element.className = Clone.CLASS;
        element.src = src;
        element.addEventListener('load', function () { return element.classList.add(Clone.LOADED_CLASS); });
        return new Clone(element);
    };
    Clone.prototype.show = function () {
        this.element.classList.add(Clone.VISIBLE_CLASS);
    };
    Clone.prototype.isVisible = function () {
        return this.element.classList.contains(Clone.VISIBLE_CLASS);
    };
    Clone.prototype.hide = function () {
        this.element.classList.remove(Clone.VISIBLE_CLASS);
    };
    Clone.prototype.isHidden = function () {
        return !this.isVisible();
    };
    Clone.prototype.loaded = function () {
        this.element.classList.add(Clone.LOADED_CLASS);
    };
    Clone.prototype.isLoading = function () {
        return !this.isLoaded();
    };
    Clone.prototype.isLoaded = function () {
        return this.element.classList.contains(Clone.LOADED_CLASS);
    };
    Clone.CLASS = 'zoom__clone';
    Clone.VISIBLE_CLASS = 'zoom__clone--visible';
    Clone.LOADED_CLASS = 'zoom__clone--loaded';
    return Clone;
}());

var Overlay = /** @class */ (function () {
    function Overlay(element) {
        this.element = element;
    }
    Overlay.create = function () {
        var element = createDiv(Overlay.CLASS);
        return new Overlay(element);
    };
    Overlay.prototype.appendTo = function (node) {
        node.appendChild(this.element);
        repaint(this.element);
        this.show();
    };
    Overlay.prototype.show = function () {
        this.element.classList.add(Overlay.VISIBLE_CLASS);
    };
    Overlay.prototype.hide = function () {
        this.element.classList.remove(Overlay.VISIBLE_CLASS);
    };
    Overlay.prototype.add = function () {
        document.body.appendChild(this.element);
    };
    Overlay.prototype.remove = function () {
        document.body.removeChild(this.element);
    };
    Overlay.CLASS = 'zoom__overlay';
    Overlay.VISIBLE_CLASS = 'zoom__overlay--visible';
    return Overlay;
}());

var Wrapper = /** @class */ (function () {
    function Wrapper(element) {
        this.element = element;
    }
    Wrapper.prototype.startExpanding = function () {
        this.element.classList.add(Wrapper.EXPANDING_CLASS);
    };
    Wrapper.prototype.isExpanding = function () {
        return this.element.classList.contains(Wrapper.EXPANDING_CLASS);
    };
    Wrapper.prototype.finishExpanding = function () {
        this.element.classList.remove(Wrapper.EXPANDING_CLASS);
    };
    Wrapper.prototype.startCollapsing = function () {
        this.element.classList.add(Wrapper.COLLAPSING_CLASS);
    };
    Wrapper.prototype.isCollapsing = function () {
        return this.element.classList.contains(Wrapper.COLLAPSING_CLASS);
    };
    Wrapper.prototype.finishCollapsing = function () {
        this.element.classList.remove(Wrapper.COLLAPSING_CLASS);
        resetStyle(this.element, 'height');
    };
    Wrapper.prototype.isTransitioning = function () {
        return this.isExpanding() || this.isCollapsing();
    };
    Wrapper.prototype.collapsed = function () {
        this.element.classList.remove(Wrapper.EXPANDED_CLASS);
    };
    Wrapper.prototype.expanded = function () {
        this.element.classList.add(Wrapper.EXPANDED_CLASS);
    };
    Wrapper.prototype.isExpanded = function () {
        return this.element.classList.contains(Wrapper.EXPANDED_CLASS);
    };
    Wrapper.prototype.srcOf = function (image) {
        var fullSrc = this.element.getAttribute('data-src');
        if (fullSrc === null) {
            return image.src;
        }
        else {
            return fullSrc;
        }
    };
    Wrapper.prototype.position = function () {
        var rect = this.element.getBoundingClientRect();
        return Vector2.fromPosition(rect);
    };
    Wrapper.prototype.fixHeightTo = function (image) {
        this.element.style.height = pixels(image.height());
    };
    Wrapper.prototype.targetSize = function () {
        return Vector2.targetSizeOf(this.element);
    };
    Wrapper.CLASS = 'zoom';
    Wrapper.EXPANDING_CLASS = 'zoom--expanding';
    Wrapper.EXPANDED_CLASS = 'zoom--expanded';
    Wrapper.COLLAPSING_CLASS = 'zoom--collapsing';
    return Wrapper;
}());

var ZoomDOM = /** @class */ (function () {
    function ZoomDOM(overlay, wrapper, container, image, clone) {
        this.overlay = overlay;
        this.wrapper = wrapper;
        this.container = container;
        this.image = image;
        this.clone = clone;
    }
    ZoomDOM.fromExisting = function (imageElement) {
        var overlay = Overlay.create();
        var container = new Container(imageElement.parentElement);
        var wrapper = new Wrapper(container.parent());
        var image = new Image(imageElement);
        var src = wrapper.srcOf(imageElement);
        if (src === imageElement.src) {
            return new ZoomDOM(overlay, wrapper, container, image);
        }
        else {
            return new ZoomDOM(overlay, wrapper, container, image, new Clone(container.clone()));
        }
    };
    ZoomDOM.fromFresh = function (imageElement) {
        var overlay = Overlay.create();
        var container = Container.create();
        var wrapper = new Wrapper(imageElement.parentElement);
        var image = new Image(imageElement);
        var src = wrapper.srcOf(imageElement);
        if (src === imageElement.src) {
            return new ZoomDOM(overlay, wrapper, container, image);
        }
        else {
            return new ZoomDOM(overlay, wrapper, container, image, Clone.create(src));
        }
    };
    ZoomDOM.prototype.replaceImageWithClone = function () {
        if (this.clone !== undefined) {
            this.clone.show();
            this.image.hide();
        }
    };
    ZoomDOM.prototype.replaceCloneWithImage = function () {
        if (this.clone !== undefined) {
            this.image.show();
            this.clone.hide();
        }
    };
    ZoomDOM.prototype.replaceContainerWithImage = function () {
        this.wrapper.element.replaceChild(this.container.element, this.image.element);
    };
    ZoomDOM.prototype.appendImageToContainer = function () {
        this.container.element.appendChild(this.image.element);
    };
    ZoomDOM.prototype.appendCloneToContainer = function () {
        if (this.clone !== undefined) {
            this.container.element.appendChild(this.clone.element);
        }
    };
    /**
     * Creates an {@link EventListener] that is called when the clone's 'load' event has fired. It checks to see if the
     * clone has not yet been made visible, and ensures that we only show the clone if the image is fully expanded to
     * avoid the image dimensions breaking mid-expansion.
     */
    ZoomDOM.prototype.createCloneLoadedListener = function () {
        var _this = this;
        return function () {
            if (_this.clone !== undefined && _this.clone.isHidden() && _this.wrapper.isExpanded()) {
                _this.replaceImageWithClone();
            }
        };
    };
    /**
     * Removes the {@link #createCloneLoadedListener} attached to the 'load' event of a clone if the expansion of an
     * image was cancelled before the 'load' event had time to finish and fire the event. As the image was collapsed we
     * no longer care about showing it when it's loaded, and can wait for the next expansion to show the clone.
     */
    ZoomDOM.prototype.removeCloneLoadedListener = function (listener) {
        if (this.clone !== undefined && listener !== undefined) {
            if (this.clone.isLoading()) {
                this.clone.element.removeEventListener('load', listener);
            }
        }
    };
    /**
     * Called at the end of an expansion to check if the clone loaded before our expansion finished. If it did, and is
     * still not visible, we can now show it to the client.
     */
    ZoomDOM.prototype.showCloneIfLoaded = function () {
        if (this.clone !== undefined && this.clone.isLoaded() && this.clone.isHidden()) {
            this.replaceImageWithClone();
        }
    };
    return ZoomDOM;
}());

function collapsed(config, elements) {
    elements.replaceCloneWithImage();
    elements.overlay.remove();
    elements.image.deactivate();
    elements.wrapper.finishCollapsing();
    setTimeout(function () { return addZoomListener(config); }, 1);
}
/**
 * Zoom with no transition.
 */
function zoomInstant(config, elements, target, showCloneListener) {
    var bounds = elements.image.bounds();
    var resizedListener = function () {
        var wrapperPosition = elements.wrapper.position();
        bounds = new Bounds(wrapperPosition, bounds.size);
        elements.container.setBounds(Bounds.centreOf(document, target, bounds));
    };
    var removeDismissListeners;
    var collapseListener = function () {
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
function zoomTransition(config, elements, target, showCloneListener, features) {
    var bounds = elements.image.bounds();
    var transitionEnd = features.transitionEndEvent;
    var transitionProperty = features.transitionProperty;
    var transformProperty = features.transformProperty;
    var resizedListener = function () {
        var wrapperPosition = elements.wrapper.position();
        bounds = new Bounds(wrapperPosition, bounds.size);
        if (elements.wrapper.isTransitioning()) {
            elements.container.fillViewport(features, target, bounds);
        }
        else {
            elements.container.setBounds(Bounds.centreOf(document, target, bounds));
        }
    };
    var expandedListener = function () {
        elements.showCloneIfLoaded();
        elements.wrapper.finishExpanding();
        elements.wrapper.expanded();
        ignoreTransitions(elements.container.element, transitionProperty, function () {
            elements.container.resetStyle(transformProperty);
            elements.container.setBounds(Bounds.centreOf(document, target, bounds));
        });
        elements.container.element.removeEventListener(transitionEnd, expandedListener);
    };
    var removeDismissListeners;
    var collapseListener = function () {
        removeDismissListeners();
        window.removeEventListener('resize', resizedListener);
        elements.removeCloneLoadedListener(showCloneListener);
        elements.overlay.hide();
        elements.wrapper.startCollapsing();
        var collapsedListener = function () {
            collapsed(config, elements);
            elements.container.element.removeEventListener(transitionEnd, collapsedListener);
        };
        elements.container.element.addEventListener(transitionEnd, collapsedListener);
        if (elements.wrapper.isExpanding()) {
            elements.container.element.removeEventListener(transitionEnd, expandedListener);
            elements.container.resetStyle(transformProperty);
            elements.wrapper.finishExpanding();
        }
        else {
            ignoreTransitions(elements.container.element, transitionProperty, function () {
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
function clickedZoomable(config, event, zoomListener) {
    var image = event.target;
    var parent = image.parentElement;
    var previouslyZoomed = Container.isContainer(parent);
    var wrapper = previouslyZoomed ? parent.parentElement : parent;
    if (event.metaKey || event.ctrlKey) {
        window.open(fullSrc(wrapper, image), '_blank');
    }
    else {
        document.body.removeEventListener('click', zoomListener);
        var elements = void 0;
        if (previouslyZoomed) {
            elements = ZoomDOM.fromExisting(image);
        }
        else {
            elements = ZoomDOM.fromFresh(image);
            elements.replaceContainerWithImage();
            elements.appendImageToContainer();
            elements.appendCloneToContainer();
        }
        var showCloneListener = void 0;
        if (elements.clone !== undefined) {
            if (elements.clone.isLoaded()) {
                elements.replaceImageWithClone();
            }
            else {
                showCloneListener = elements.createCloneLoadedListener();
                elements.clone.element.addEventListener('load', showCloneListener);
            }
        }
        var target = elements.wrapper.targetSize();
        var features = detectFeatures();
        if (features.hasTransform && features.hasTransitions) {
            zoomTransition(config, elements, target, showCloneListener, features);
        }
        else {
            zoomInstant(config, elements, target, showCloneListener);
        }
    }
}
function addZoomListener(config) {
    if (config === void 0) { config = DEFAULT_CONFIG; }
    var listener = {
        handleEvent: function (event) {
            if (Image.isZoomableImage(event.target)) {
                event.preventDefault();
                event.stopPropagation();
                clickedZoomable(config, event, listener);
            }
        }
    };
    document.body.addEventListener('click', listener);
}
function listenForZoom(config) {
    if (config === void 0) { config = DEFAULT_CONFIG; }
    ready(document, function () { return addZoomListener(config); });
}

listenForZoom();

}());
//# sourceMappingURL=zoom.js.map
