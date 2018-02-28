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
function clientSize(element) {
    return [
        element.clientWidth,
        element.clientHeight
    ];
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
function targetSize(element) {
    return [
        targetDimension(element, 'width'),
        targetDimension(element, 'height')
    ];
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

var STANDARDS_MODE = 'CSS1Compat';
function isStandardsMode(document) {
    return document.compatMode === STANDARDS_MODE;
}
function rootElement(document) {
    return isStandardsMode(document) ? document.documentElement : document.body;
}
function viewportSize(document) {
    return clientSize(rootElement(document));
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

function positionFrom(rect) {
    return [
        rect.left,
        rect.top
    ];
}
function sizeFrom(rect) {
    return [
        rect.width,
        rect.height
    ];
}
function scaleVector(vector, amount) {
    return [
        vector[0] * amount,
        vector[1] * amount
    ];
}
function shrinkVector(vector, amount) {
    return [
        vector[0] / amount,
        vector[1] / amount
    ];
}
function addVectors(x, y) {
    return [
        x[0] + y[0],
        x[1] + y[1]
    ];
}
function subtractVectors(x, y) {
    return [
        x[0] - y[0],
        x[1] - y[1]
    ];
}
function divideVectors(x, y) {
    return [
        x[0] / y[0],
        x[1] / y[1]
    ];
}
function minimizeVectors(x, y) {
    return [
        Math.min(x[0], y[0]),
        Math.min(x[1], y[1])
    ];
}
function minimumDivisor(x, y) {
    var scaled = divideVectors(x, y);
    return Math.min(scaled[0], scaled[1]);
}

function createBounds(position, size) {
    return {
        position: position,
        size: size
    };
}
function boundsOf(element) {
    var rect = element.getBoundingClientRect();
    return createBounds(positionFrom(rect), sizeFrom(rect));
}
function setBounds(style, x, y, width, height) {
    style.left = x;
    style.top = y;
    style.width = width;
    style.maxWidth = width;
    style.height = height;
}
function resetBounds(style) {
    setBounds(style, '', '', '', '');
}
function setBoundsPx(style, bounds) {
    var position = bounds.position;
    var size = bounds.size;
    setBounds(style, pixels(position[0]), pixels(position[1]), pixels(size[0]), pixels(size[1]));
}

/**
 * Calculates the padding that must be applied to an inner vector for it to appear in the centre of an outer vector.
 * @param outer The outer vector.
 * @param inner The inner vector.
 * @returns {Vector} The padding.
 */
function centrePadding(outer, inner) {
    return shrinkVector(subtractVectors(outer, inner), 2);
}
function centrePosition(outer, bounds) {
    return subtractVectors(centrePadding(outer, bounds.size), bounds.position);
}
function centreTranslation(outer, bounds, innerScale) {
    var scaled = scaleVector(bounds.size, innerScale);
    var centredWithinScaled = addVectors(bounds.position, centrePadding(bounds.size, scaled));
    var centeredWithinOuter = centrePosition(outer, createBounds(centredWithinScaled, scaled));
    return shrinkVector(centeredWithinOuter, innerScale);
}
function centreBounds(document, target, bounds) {
    var viewport = viewportSize(document);
    var cappedTarget = minimizeVectors(viewport, target);
    var factor = minimumDivisor(cappedTarget, bounds.size);
    var scaled = scaleVector(bounds.size, factor);
    var centre = centrePosition(viewport, createBounds(bounds.position, scaled));
    return {
        position: centre,
        size: scaled
    };
}

function translate(translation) {
    return "translate(" + translation[0] + "px, " + translation[1] + "px)";
}
function translate3d(translation) {
    return "translate3d(" + translation[0] + "px, " + translation[1] + "px, 0)";
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
    var cappedTarget = minimizeVectors(viewport, target);
    var scale = minimumDivisor(cappedTarget, bounds.size);
    var translation = centreTranslation(viewport, bounds, scale);
    return {
        scale: scale,
        translation: translation
    };
}
function expandToViewport(features, element, target, bounds) {
    var transform = centreTransformation(target, bounds);
    var transformProperty = features.transformProperty;
    var style = element.style;
    if (features.hasTransform3d) {
        style[transformProperty] = scaleTranslate3d(transform);
    }
    else {
        style[transformProperty] = scaleTranslate(transform);
    }
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
    cloneClass: 'zoom__clone',
    cloneVisibleClass: 'zoom__clone--visible',
    cloneLoadedClass: 'zoom__clone--loaded',
    containerClass: 'zoom__container',
    imageClass: 'zoom__element',
    imageHiddenClass: 'zoom__element--hidden',
    imageActiveClass: 'zoom__element--active',
    overlayClass: 'zoom__overlay',
    overlayVisibleClass: 'zoom__overlay--visible',
    wrapperClass: 'zoom',
    wrapperExpandingClass: 'zoom--expanding',
    wrapperExpandedClass: 'zoom--expanded',
    wrapperCollapsingClass: 'zoom--collapsing'
};

var CLASS_SEPARATOR = ' ';
function classFilter(className, index, classList) {
    return className.length > 0 && classList.indexOf(className) === index;
}
function excludeClass(excluded) {
    return function (className, index, classList) {
        return className !== excluded && classFilter(className, index, classList);
    };
}
function hasClass(element, className) {
    return element.className.indexOf(className) !== -1;
}
function addClass(element, add) {
    element.className = element.className
        .split(CLASS_SEPARATOR)
        .concat(add)
        .filter(classFilter)
        .join(CLASS_SEPARATOR);
}
function removeClass(element, remove) {
    element.className = element.className
        .split(CLASS_SEPARATOR)
        .filter(excludeClass(remove))
        .join(CLASS_SEPARATOR);
}

function getCurrentEvent(event) {
    if (event !== undefined) {
        return event;
    }
    else if (window.event !== undefined) {
        return window.event;
    }
    else {
        throw new Error('No current event to handle.');
    }
}
function polyfillEvent(event) {
    if (typeof event.preventDefault !== 'function') {
        event.preventDefault = function () {
            event.returnValue = false;
        };
    }
    if (typeof event.stopPropagation !== 'function') {
        event.stopPropagation = function () {
            event.cancelBubble = true;
        };
    }
    if (event.type === 'mouseover') {
        var mouseEvent = event;
        if (mouseEvent.relatedTarget === undefined && mouseEvent.fromElement !== undefined) {
            mouseEvent.relatedTarget = mouseEvent.fromElement;
        }
    }
    else if (event.type === 'mouseout') {
        var mouseEvent = event;
        if (mouseEvent.relatedTarget === undefined && mouseEvent.toElement !== undefined) {
            mouseEvent.relatedTarget = mouseEvent.toElement;
        }
    }
    return event;
}

function fireEventListener(listener, event) {
    if (typeof listener === 'function') {
        listener(event);
    }
    else {
        listener.handleEvent(event);
    }
}
function addEventListener(target, type, listener, useCapture) {
    if (useCapture === void 0) { useCapture = false; }
    var standard = target['addEventListener'];
    var fallback = target['attachEvent'];
    var wrappedListener = function (event) {
        fireEventListener(listener, polyfillEvent(getCurrentEvent(event)));
    };
    if (typeof standard === 'function') {
        standard.call(target, type, wrappedListener, useCapture);
        return wrappedListener;
    }
    else if (typeof fallback === 'function' && fallback.call(target, "on" + type, wrappedListener)) {
        return wrappedListener;
    }
    else {
        return undefined;
    }
}
function removeEventListener(target, type, listener) {
    var standard = target['removeEventListener'];
    var fallback = target['detachEvent'];
    if (typeof standard === 'function') {
        standard.call(target, type, listener);
        return true;
    }
    else if (typeof fallback === 'function') {
        fallback.call(target, type, listener);
        return true;
    }
    else {
        return false;
    }
}

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
function escKeyPressed(listener) {
    return {
        handleEvent: function (event) {
            if (event.keyCode === ESCAPE_KEY_CODE) {
                event.preventDefault();
                event.stopPropagation();
                fireEventListener(listener, event);
            }
        }
    };
}
function scrolled(start, minAmount, current, listener) {
    return function (event) {
        if (Math.abs(start - current()) >= minAmount) {
            fireEventListener(listener, event);
        }
    };
}
function addDismissListeners(config, container, collapse) {
    var initialScrollY = pageScrollY();
    var scrollListener = scrolled(initialScrollY, config.scrollDismissPx, pageScrollY, collapse);
    var scrolledAway = addEventListener(window, 'scroll', scrollListener);
    var pressedEsc = addEventListener(document, 'keyup', escKeyPressed(collapse));
    var dismissed = addEventListener(container, 'click', collapse);
    return function () {
        removeEventListener(window, 'scroll', scrolledAway);
        removeEventListener(document, 'keyup', pressedEsc);
        removeEventListener(container, 'click', dismissed);
    };
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
        callback();
    }
    else {
        listenForEvent(document, 'DOMContentLoaded', function () { return callback(); });
    }
}
function listenForEvent(target, type, listener, useCapture) {
    if (useCapture === void 0) { useCapture = false; }
    var added = addEventListener(target, type, function (event) {
        if (added !== undefined) {
            removeEventListener(target, type, added);
        }
        fireEventListener(listener, event);
    }, useCapture);
    return added;
}

function createClone(config, src) {
    var clone = document.createElement('img');
    clone.className = config.cloneClass;
    clone.src = src;
    listenForEvent(clone, 'load', function () { return addClass(clone, config.cloneLoadedClass); });
    return clone;
}
function showCloneOnceLoaded(config, elements) {
    return function () {
        if (elements.clone !== undefined) {
            var cloneHidden = !hasClass(elements.clone, config.cloneVisibleClass);
            var wrapperExpanded = hasClass(elements.wrapper, config.wrapperExpandedClass);
            if (cloneHidden && wrapperExpanded) {
                replaceImageWithClone(config, elements.image, elements.clone);
            }
        }
    };
}
function removeCloneLoadedListener(config, elements, showCloneListener) {
    if (elements.clone !== undefined && showCloneListener !== undefined) {
        var cloneLoading = !hasClass(elements.clone, config.cloneLoadedClass);
        if (cloneLoading) {
            removeEventListener(elements.clone, 'load', showCloneListener);
        }
    }
}
function replaceImageWithClone(config, image, clone) {
    addClass(clone, config.cloneVisibleClass);
    addClass(image, config.imageHiddenClass);
}
function replaceCloneWithImage(config, image, clone) {
    removeClass(image, config.imageHiddenClass);
    removeClass(clone, config.cloneVisibleClass);
}

function isZoomable(config, target) {
    return target instanceof HTMLImageElement
        && hasParent(target)
        && hasGrandParent(target)
        && hasClass(target, config.imageClass);
}
function fullSrc(wrapper, image) {
    var fullSrc = wrapper.getAttribute('data-src');
    if (fullSrc === null) {
        return image.src;
    }
    else {
        return fullSrc;
    }
}

function addOverlay(config, overlay) {
    document.body.appendChild(overlay);
    repaint(overlay);
    addClass(overlay, config.overlayVisibleClass);
}

function isWrapperTransitioning(config, wrapper) {
    return hasClass(wrapper, config.wrapperExpandingClass) || hasClass(wrapper, config.wrapperCollapsingClass);
}

function useExistingElements(overlay, image) {
    var container = image.parentElement;
    var wrapper = container.parentElement;
    var cloneRequired = fullSrc(wrapper, image) !== image.src;
    var clone = cloneRequired ? container.children.item(1) : undefined;
    return {
        overlay: overlay,
        wrapper: wrapper,
        container: container,
        image: image,
        clone: clone
    };
}
function setUpElements(config, overlay, image) {
    var container = createDiv(config.containerClass);
    var wrapper = image.parentElement;
    var src = fullSrc(wrapper, image);
    var cloneRequired = src !== image.src;
    var clone = cloneRequired ? createClone(config, src) : undefined;
    return {
        overlay: overlay,
        wrapper: wrapper,
        container: container,
        image: image,
        clone: clone
    };
}

function collapsed(config, elements) {
    if (elements.clone !== undefined) {
        replaceCloneWithImage(config, elements.image, elements.clone);
    }
    document.body.removeChild(elements.overlay);
    removeClass(elements.image, config.imageActiveClass);
    removeClass(elements.wrapper, config.wrapperCollapsingClass);
    resetStyle(elements.wrapper, 'height');
    setTimeout(function () { return addZoomListener(config); }, 1);
}
/**
 * Zoom with no transition.
 */
function zoomInstant(config, elements, target, showCloneListener) {
    var bounds = boundsOf(elements.image);
    var resized = addEventListener(window, 'resize', function () {
        var wrapperPosition = positionFrom(elements.wrapper.getBoundingClientRect());
        bounds = createBounds(wrapperPosition, bounds.size);
        setBoundsPx(elements.container.style, centreBounds(document, target, bounds));
    });
    var removeDismissListeners;
    var collapse = function () {
        removeDismissListeners();
        removeEventListener(window, 'resize', resized);
        removeCloneLoadedListener(config, elements, showCloneListener);
        removeClass(elements.wrapper, config.wrapperExpandedClass);
        resetBounds(elements.container.style);
        collapsed(config, elements);
    };
    removeDismissListeners = addDismissListeners(config, elements.container, collapse);
    addOverlay(config, elements.overlay);
    addClass(elements.wrapper, config.wrapperExpandedClass);
    elements.wrapper.style.height = pixels(elements.image.height);
    addClass(elements.image, config.imageActiveClass);
    setBoundsPx(elements.container.style, centreBounds(document, target, bounds));
}
/**
 * Zoom with transition.
 */
function zoomTransition(config, elements, target, showCloneListener, features) {
    var bounds = boundsOf(elements.image);
    var resized = addEventListener(window, 'resize', function () {
        var wrapperPosition = positionFrom(elements.wrapper.getBoundingClientRect());
        bounds = createBounds(wrapperPosition, bounds.size);
        if (isWrapperTransitioning(config, elements.wrapper)) {
            expandToViewport(features, elements.container, target, bounds);
        }
        else {
            setBoundsPx(elements.container.style, centreBounds(document, target, bounds));
        }
    });
    var expandedListener;
    var removeDismissListeners;
    var collapse = function () {
        removeDismissListeners();
        removeEventListener(window, 'resize', resized);
        removeCloneLoadedListener(config, elements, showCloneListener);
        removeClass(elements.overlay, config.overlayVisibleClass);
        addClass(elements.wrapper, config.wrapperCollapsingClass);
        var collapsedListener = listenForEvent(elements.container, features.transitionEndEvent, function () {
            collapsed(config, elements);
        });
        if (hasClass(elements.wrapper, config.wrapperExpandingClass)) {
            if (expandedListener !== undefined) {
                removeEventListener(elements.container, features.transitionEndEvent, expandedListener);
            }
            resetStyle(elements.container, features.transformProperty);
            removeClass(elements.wrapper, config.wrapperExpandingClass);
        }
        else {
            ignoreTransitions(elements.container, features.transitionProperty, function () {
                expandToViewport(features, elements.container, target, bounds);
            });
            resetStyle(elements.container, features.transformProperty);
            resetBounds(elements.container.style);
            removeClass(elements.wrapper, config.wrapperExpandedClass);
        }
        if (collapsedListener === undefined) {
            collapsed(config, elements);
        }
    };
    function expanded() {
        if (elements.clone !== undefined && hasClass(elements.clone, config.cloneLoadedClass) && !hasClass(elements.clone, config.cloneVisibleClass)) {
            if (showCloneListener !== undefined) {
                removeEventListener(elements.clone, features.transitionEndEvent, showCloneListener);
            }
            replaceImageWithClone(config, elements.image, elements.clone);
        }
        removeClass(elements.wrapper, config.wrapperExpandingClass);
        addClass(elements.wrapper, config.wrapperExpandedClass);
        ignoreTransitions(elements.container, features.transitionProperty, function () {
            resetStyle(elements.container, features.transformProperty);
            setBoundsPx(elements.container.style, centreBounds(document, target, bounds));
        });
    }
    removeDismissListeners = addDismissListeners(config, elements.container, collapse);
    addOverlay(config, elements.overlay);
    addClass(elements.wrapper, config.wrapperExpandingClass);
    elements.wrapper.style.height = pixels(elements.image.height);
    addClass(elements.image, config.imageActiveClass);
    expandedListener = listenForEvent(elements.container, features.transitionEndEvent, function () { return expanded(); });
    if (expandedListener === undefined) {
        expanded();
    }
    else {
        expandToViewport(features, elements.container, target, bounds);
    }
}
function clickedZoomable(config, event, zoomListener) {
    var image = event.target;
    var parent = image.parentElement;
    var previouslyZoomed = hasClass(parent, config.containerClass);
    var wrapper = previouslyZoomed ? parent.parentElement : parent;
    if (event.metaKey || event.ctrlKey) {
        window.open(fullSrc(wrapper, image), '_blank');
    }
    else {
        if (zoomListener !== undefined) {
            removeEventListener(document.body, 'click', zoomListener);
        }
        var elements = void 0;
        var overlay = createDiv(config.overlayClass);
        if (previouslyZoomed) {
            elements = useExistingElements(overlay, image);
        }
        else {
            elements = setUpElements(config, overlay, image);
            elements.wrapper.replaceChild(elements.container, image);
            elements.container.appendChild(image);
            if (elements.clone !== undefined) {
                elements.container.appendChild(elements.clone);
            }
        }
        var showCloneListener = void 0;
        if (elements.clone !== undefined) {
            if (hasClass(elements.clone, config.cloneLoadedClass)) {
                replaceImageWithClone(config, image, elements.clone);
            }
            else {
                showCloneListener = addEventListener(elements.clone, 'load', showCloneOnceLoaded(config, elements));
            }
        }
        var target = targetSize(elements.wrapper);
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
    var listener = addEventListener(document.body, 'click', {
        handleEvent: function (event) {
            if (event instanceof MouseEvent && isZoomable(config, event.target)) {
                event.preventDefault();
                event.stopPropagation();
                clickedZoomable(config, event, listener);
            }
        }
    });
}
function listenForZoom(config) {
    if (config === void 0) { config = DEFAULT_CONFIG; }
    ready(document, function () { return addZoomListener(config); });
}

listenForZoom();

}());
//# sourceMappingURL=zoom.js.map
