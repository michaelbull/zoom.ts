/*!
 * zoom.ts v7.5.0
 * https://www.michael-bull.com/projects/zoom.ts
 * 
 * Copyright (c) 2017 Michael Bull (https://www.michael-bull.com)
 * @license ISC
 */

(function(l, i, v, e) { v = l.createElement(i); v.async = 1; v.src = '//' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; e = l.getElementsByTagName(i)[0]; e.parentNode.insertBefore(v, e)})(document, 'script');
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.zoom = {})));
}(this, (function (exports) { 'use strict';

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
function resetStyle(style, property) {
    style[property] = '';
}
function setBounds(style, x, y, width, height) {
    style.left = x;
    style.top = y;
    style.width = width;
    style.maxWidth = width;
    style.height = height;
}
function parsePadding(style, direction) {
    var parsed = parseFloat(style.getPropertyValue("padding-" + direction));
    if (isNaN(parsed)) {
        return 0;
    }
    else {
        return parsed;
    }
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
    Vector2.prototype.minDivisor = function (other) {
        var scaled = this.shrink(other);
        return Math.min(scaled.x, scaled.y);
    };
    Vector2.min = function (left, right) {
        return new Vector2(Math.min(left.x, right.x), Math.min(left.y, right.y));
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
/**
 * Executes a callback function when a document has finished loading, or immediately if the document has already
 * finished loading.
 * @param document The document.
 * @param callback The function to execute.
 * @see http://youmightnotneedjquery.com/#ready
 */
function ready(document, callback) {
    if (document.readyState === 'complete') {
        callback.call(document);
    }
    else {
        var listener_1 = function () {
            document.removeEventListener('DOMContentLoaded', listener_1);
            callback.call(document);
        };
        document.addEventListener('DOMContentLoaded', listener_1);
    }
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
    resetStyle(style, transitionProperty);
}

var Features = /** @class */ (function () {
    function Features(hasTransform, hasTransform3d, hasTransitions, transformProperty, transitionProperty, transitionEndEvent) {
        this.hasTransform = hasTransform;
        this.hasTransform3d = hasTransform3d;
        this.hasTransitions = hasTransitions;
        this.transformProperty = transformProperty;
        this.transitionProperty = transitionProperty;
        this.transitionEndEvent = transitionEndEvent;
    }
    Features.of = function (style) {
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
        return new Features(hasTransform, hasTransform3d, hasTransitions, transformProperty, transitionProperty, transitionEndEvent);
    };
    return Features;
}());

var DEFAULT_CONFIG = {
    scrollDismissPx: 50
};

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

var ScaleAndTranslate = /** @class */ (function () {
    function ScaleAndTranslate(scale$$1, translation) {
        this.scale = scale$$1;
        this.translation = translation;
    }
    ScaleAndTranslate.centreOf = function (target, bounds) {
        var viewport = viewportSize(document);
        var cappedTarget = Vector2.min(viewport, target);
        var scale$$1 = cappedTarget.minDivisor(bounds.size);
        var translation = Bounds.centreTranslation(viewport, bounds, scale$$1);
        return new ScaleAndTranslate(scale$$1, translation);
    };
    ScaleAndTranslate.prototype.toString2d = function () {
        return scale(this.scale) + " " + translate(this.translation);
    };
    ScaleAndTranslate.prototype.toString3d = function () {
        return scale3d(this.scale) + " " + translate3d(this.translation);
    };
    return ScaleAndTranslate;
}());

var Container = /** @class */ (function () {
    function Container(element) {
        this.element = element;
    }
    Container.create = function () {
        var element = document.createElement('div');
        element.className = Container.CLASS;
        return new Container(element);
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
        var transform = ScaleAndTranslate.centreOf(target, bounds);
        var transformProperty = features.transformProperty;
        var style = this.element.style;
        if (features.hasTransform3d) {
            style[transformProperty] = transform.toString3d();
        }
        else {
            style[transformProperty] = transform.toString2d();
        }
    };
    Container.prototype.resetStyle = function (property) {
        resetStyle(this.element.style, property);
    };
    Container.CLASS = 'zoom__container';
    return Container;
}());

var Image = /** @class */ (function () {
    function Image(element) {
        this.element = element;
    }
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
    Image.prototype.activate = function () {
        this.element.classList.add(Image.ACTIVE_CLASS);
    };
    Image.prototype.deactivate = function () {
        this.element.classList.remove(Image.ACTIVE_CLASS);
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
        resetStyle(this.element.style, 'height');
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
        var style = getComputedStyle(this.element);
        // if the wrapper has an explicit padding in the normal page flow,
        // we must disregard it when calculating the wrapper's true position
        var paddingTop = parsePadding(style, 'top');
        var paddingLeft = parsePadding(style, 'left');
        return new Vector2(rect.left + paddingLeft, rect.top + paddingTop);
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
        var element = document.createElement('div');
        element.className = Overlay.CLASS;
        return new Overlay(element);
    };
    Overlay.prototype.appendTo = function (node) {
        node.appendChild(this.element);
        repaint(this.element);
        this.show();
    };
    Overlay.prototype.removeFrom = function (node) {
        node.removeChild(this.element);
    };
    Overlay.prototype.show = function () {
        this.element.classList.add(Overlay.VISIBLE_CLASS);
    };
    Overlay.prototype.hide = function () {
        this.element.classList.remove(Overlay.VISIBLE_CLASS);
    };
    Overlay.CLASS = 'zoom__overlay';
    Overlay.VISIBLE_CLASS = 'zoom__overlay--visible';
    return Overlay;
}());

var ZoomDOM = /** @class */ (function () {
    function ZoomDOM(overlay, wrapper, container, image, clone) {
        this.overlay = overlay;
        this.wrapper = wrapper;
        this.container = container;
        this.image = image;
        this.clone = clone;
    }
    ZoomDOM.useExisting = function (imageElement) {
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
    ZoomDOM.setup = function (imageElement) {
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
    ZoomDOM.prototype.fixWrapperHeight = function () {
        this.wrapper.element.style.height = pixels(this.image.element.height);
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

function fireEventListener(target, listener, event) {
    if (typeof listener === 'function') {
        listener.call(target, event);
    }
    else {
        listener.handleEvent(event);
    }
}

var ESCAPE_KEY_CODE = 27;
/**
 * An {@link EventListenerObject} that handles {@link KeyboardEvent}s with a {@link KeyboardEvent#keyCode} equal to
 * {@link ESCAPE_KEY_CODE}.
 */
var EscKeyListener = /** @class */ (function () {
    function EscKeyListener(target, delegate) {
        this.target = target;
        this.delegate = delegate;
    }
    EscKeyListener.prototype.handleEvent = function (evt) {
        if (evt.keyCode === ESCAPE_KEY_CODE) {
            evt.preventDefault();
            evt.stopPropagation();
            fireEventListener(this.target, this.delegate, evt);
        }
    };
    return EscKeyListener;
}());

/**
 * An {@link EventListenerObject} that handles {@link Event}s when the page has been scrolled vertically a certain
 * {@link ScrollListener#distance} in pixels from a {@link ScrollListener#start} position.
 */
var ScrollListener = /** @class */ (function () {
    function ScrollListener(target, start, distance, delegate) {
        this.target = target;
        this.start = start;
        this.distance = distance;
        this.delegate = delegate;
    }
    ScrollListener.prototype.handleEvent = function (evt) {
        var delta = Math.abs(this.start - pageScrollY());
        if (delta > this.distance) {
            fireEventListener(this.target, this.delegate, evt);
        }
    };
    return ScrollListener;
}());

var DismissListeners = /** @class */ (function () {
    function DismissListeners(delegateListener, scrollListener, escKeyListener) {
        this.delegateListener = delegateListener;
        this.scrollListener = scrollListener;
        this.escKeyListener = escKeyListener;
    }
    DismissListeners.create = function (scrollDismissPx, delegateListener) {
        var scrollListener = new ScrollListener(document, pageScrollY(), scrollDismissPx, delegateListener);
        var escKeyListener = new EscKeyListener(document, delegateListener);
        return new DismissListeners(delegateListener, scrollListener, escKeyListener);
    };
    DismissListeners.prototype.addTo = function (context, container) {
        container.addEventListener('click', this.delegateListener);
        context.addEventListener('scroll', this.scrollListener);
        context.document.addEventListener('keyup', this.escKeyListener);
    };
    DismissListeners.prototype.removeFrom = function (context, container) {
        container.removeEventListener('click', this.delegateListener);
        context.removeEventListener('scroll', this.scrollListener);
        context.document.removeEventListener('keyup', this.escKeyListener);
    };
    return DismissListeners;
}());

var ZoomResizedListener = /** @class */ (function () {
    function ZoomResizedListener(dom, features, targetSize) {
        this.dom = dom;
        this.features = features;
        this.targetSize = targetSize;
        this._bounds = dom.image.bounds();
    }
    ZoomResizedListener.prototype.handleEvent = function (evt) {
        var wrapper = this.dom.wrapper;
        var container = this.dom.container;
        this._bounds = new Bounds(wrapper.position(), this._bounds.size);
        if (wrapper.isTransitioning()) {
            container.fillViewport(this.features, this.targetSize, this._bounds);
        }
        else {
            container.setBounds(Bounds.centreOf(document, this.targetSize, this._bounds));
        }
    };
    Object.defineProperty(ZoomResizedListener.prototype, "bounds", {
        get: function () {
            return this._bounds;
        },
        enumerable: true,
        configurable: true
    });
    return ZoomResizedListener;
}());

var ZoomListener = /** @class */ (function () {
    function ZoomListener(config, features) {
        this.config = config;
        this.features = features;
    }
    ZoomListener.prototype.handleEvent = function (evt) {
        var image = evt.target;
        if (!(image instanceof HTMLImageElement) || !image.classList.contains(Image.CLASS)) {
            return;
        }
        var parent = image.parentElement;
        if (!(parent instanceof HTMLElement)) {
            return;
        }
        var wrapper;
        var previouslyZoomed;
        if (parent.classList.contains(Wrapper.CLASS)) {
            previouslyZoomed = false;
            wrapper = parent;
        }
        else if (parent.classList.contains(Container.CLASS)) {
            previouslyZoomed = true;
            var grandparent = parent.parentElement;
            if (grandparent instanceof HTMLElement && grandparent.classList.contains(Wrapper.CLASS)) {
                wrapper = grandparent;
            }
            else {
                return;
            }
        }
        else {
            return;
        }
        evt.preventDefault();
        evt.stopPropagation();
        if (evt.metaKey || evt.ctrlKey) {
            window.open(fullSrc(wrapper, image), '_blank');
        }
        else {
            document.body.removeEventListener('click', this);
            var dom = void 0;
            if (previouslyZoomed) {
                dom = ZoomDOM.useExisting(image);
            }
            else {
                dom = ZoomDOM.setup(image);
                dom.replaceContainerWithImage();
                dom.appendImageToContainer();
                dom.appendCloneToContainer();
            }
            var showCloneListener = void 0;
            if (dom.clone !== undefined) {
                if (dom.clone.isLoaded()) {
                    dom.replaceImageWithClone();
                }
                else {
                    showCloneListener = dom.createCloneLoadedListener();
                    dom.clone.element.addEventListener('load', showCloneListener);
                }
            }
            var targetSize = dom.wrapper.targetSize();
            if (this.features.hasTransform && this.features.hasTransitions) {
                this.zoomTransition(dom, targetSize, showCloneListener);
            }
            else {
                this.zoomInstant(dom, targetSize, showCloneListener);
            }
        }
    };
    ZoomListener.prototype.zoomInstant = function (dom, targetSize, showCloneListener) {
        var _this = this;
        var resizedListener = new ZoomResizedListener(dom, this.features, targetSize);
        var dismissListeners = DismissListeners.create(this.config.scrollDismissPx, function () {
            dismissListeners.removeFrom(window, dom.container.element);
            window.removeEventListener('resize', resizedListener);
            dom.removeCloneLoadedListener(showCloneListener);
            dom.wrapper.collapsed();
            dom.container.resetBounds();
            _this.collapsed(dom);
        });
        dom.overlay.appendTo(document.body);
        dom.wrapper.expanded();
        dom.fixWrapperHeight();
        dom.image.activate();
        dom.container.setBounds(Bounds.centreOf(document, targetSize, resizedListener.bounds));
        window.addEventListener('resize', resizedListener);
        dismissListeners.addTo(window, dom.container.element);
    };
    ZoomListener.prototype.zoomTransition = function (dom, targetSize, showCloneListener) {
        var _this = this;
        var transitionEnd = this.features.transitionEndEvent;
        var transitionProperty = this.features.transitionProperty;
        var transformProperty = this.features.transformProperty;
        var resizedListener = new ZoomResizedListener(dom, this.features, targetSize);
        var expandedListener = function () {
            dom.showCloneIfLoaded();
            dom.wrapper.finishExpanding();
            dom.wrapper.expanded();
            ignoreTransitions(dom.container.element, transitionProperty, function () {
                dom.container.resetStyle(transformProperty);
                dom.container.setBounds(Bounds.centreOf(document, targetSize, resizedListener.bounds));
            });
            dom.container.element.removeEventListener(transitionEnd, expandedListener);
        };
        var dismissListeners = DismissListeners.create(this.config.scrollDismissPx, function () {
            dismissListeners.removeFrom(window, dom.container.element);
            window.removeEventListener('resize', resizedListener);
            dom.removeCloneLoadedListener(showCloneListener);
            dom.overlay.hide();
            dom.wrapper.startCollapsing();
            var collapsedListener = function () {
                _this.collapsed(dom);
                dom.container.element.removeEventListener(transitionEnd, collapsedListener);
            };
            dom.container.element.addEventListener(transitionEnd, collapsedListener);
            if (dom.wrapper.isExpanding()) {
                dom.container.element.removeEventListener(transitionEnd, expandedListener);
                dom.container.resetStyle(transformProperty);
                dom.wrapper.finishExpanding();
            }
            else {
                ignoreTransitions(dom.container.element, transitionProperty, function () {
                    dom.container.fillViewport(_this.features, targetSize, resizedListener.bounds);
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
    };
    ZoomListener.prototype.collapsed = function (dom) {
        var _this = this;
        dom.replaceCloneWithImage();
        dom.overlay.removeFrom(document.body);
        dom.image.deactivate();
        dom.wrapper.finishCollapsing();
        setTimeout(function () {
            document.body.addEventListener('click', _this);
        }, 1);
    };
    return ZoomListener;
}());

function listen(config) {
    if (config === void 0) { config = DEFAULT_CONFIG; }
    ready(document, function () {
        var features = Features.of(document.body.style);
        var listener = new ZoomListener(config, features);
        document.body.addEventListener('click', listener);
    });
}

exports.listen = listen;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=zoom.js.map
