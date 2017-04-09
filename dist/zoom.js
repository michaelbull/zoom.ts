/*!
 * zoom.ts v7.5.0
 * https://www.michael-bull.com/projects/zoom.ts
 * 
 * Copyright (c) 2017 Michael Bull (https://www.michael-bull.com)
 * @license ISC
 */

document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1"></' + 'script>');
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

function defaultConfig() {
    return {
        scrollDelta: 50
    };
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
/**
 * Calculates the padding that must be applied to an inner vector for it to appear in the centre of an outer vector.
 * @param outer The outer vector.
 * @param inner The inner vector.
 * @returns {Vector} The padding.
 */
function centrePadding(outer, inner) {
    return shrinkVector(subtractVectors(outer, inner), 2);
}
/**
 * Calculates the position that must be applied to an inner vector for it to appear in the centre of an outer vector.
 * @param outer The outer vector.
 * @param inner The inner vector.
 * @param innerPosition The current position of the inner vector.
 * @returns {Vector} The new position of the inner vector.
 */
function centrePosition(outer, bounds) {
    return subtractVectors(centrePadding(outer, bounds.size), bounds.position);
}
/**
 * Calculates the translation required for an inner vector to appear in the centre of an outer vector.
 * @param outer The outer vector.
 * @param inner The inner vector.
 * @param innerPosition The position of the inner vector.
 * @param innerScale The scale of the inner vector.
 * @returns {Vector} The translation.
 */
function centreTranslation(outer, bounds, innerScale) {
    var scaled = scaleVector(bounds.size, innerScale);
    var centredWithinScaled = addVectors(bounds.position, centrePadding(bounds.size, scaled));
    var centeredWithinOuter = centrePosition(outer, createBounds(centredWithinScaled, scaled));
    return shrinkVector(centeredWithinOuter, innerScale);
}

function repaint(element) {
    // tslint:disable-next-line
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
    if (attribute !== null) {
        var value = Number(attribute);
        if (!isNaN(value)) {
            return value;
        }
    }
    return Infinity;
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

function currentEvent(event, context) {
    if (context === void 0) { context = window; }
    if (event !== undefined) {
        return event;
    }
    else if (context.event !== undefined) {
        return context.event;
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
        fireEventListener(listener, polyfillEvent(currentEvent(event)));
    };
    if (typeof standard === 'function') {
        standard.call(target, type, wrappedListener, useCapture);
        return wrappedListener;
    }
    else if (typeof fallback === 'function' && fallback.call(target, "on" + type, wrappedListener)) {
        return wrappedListener;
    }
    return undefined;
}
function listenForEvent(target, type, listener, useCapture) {
    if (useCapture === void 0) { useCapture = false; }
    var registered = addEventListener(target, type, function (event) {
        if (registered !== undefined) {
            removeEventListener(target, type, registered);
        }
        fireEventListener(listener, event);
    }, useCapture);
    return registered;
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

var STANDARDS_MODE = 'CSS1Compat';
function isStandardsMode(document) {
    return document.compatMode === STANDARDS_MODE;
}
function rootElement(document) {
    return isStandardsMode(document) ? document.documentElement : document.body;
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
function viewportSize(document) {
    return clientSize(rootElement(document));
}
function createDiv(document, className) {
    var overlay = document.createElement('div');
    overlay.className = className;
    return overlay;
}

function createBounds(position, size) {
    return {
        position: position,
        size: size
    };
}
function boundsFrom(element) {
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

var CLASS_SEPARATOR = ' ';
function classFilter(className, index, classList) {
    return className.length > 0 && classList.indexOf(className) === index;
}
function excludeClass(excluded) {
    return function (className, index, classList) {
        return className !== excluded && classFilter(className, index, classList);
    };
}
function classesFrom(classList) {
    return classList
        .split(CLASS_SEPARATOR)
        .filter(classFilter);
}
function hasClass(element, className) {
    return element.className.indexOf(className) !== -1;
}
function addClass(element, add) {
    element.className = classesFrom(element.className)
        .concat(add)
        .filter(classFilter)
        .join(CLASS_SEPARATOR);
}
function removeClass(element, remove) {
    element.className = classesFrom(element.className)
        .filter(excludeClass(remove))
        .join(CLASS_SEPARATOR);
}

var CLASS$1 = 'zoom__element';
var HIDDEN_CLASS = CLASS$1 + "--hidden";
var ACTIVE_CLASS = CLASS$1 + "--active";
function hideImage(image) {
    addClass(image, HIDDEN_CLASS);
}
function showImage(image) {
    removeClass(image, HIDDEN_CLASS);
}

function activateImage(image) {
    addClass(image, ACTIVE_CLASS);
}
function deactivateImage(image) {
    removeClass(image, ACTIVE_CLASS);
}

function isZoomable(target) {
    return target instanceof HTMLImageElement
        && hasParent(target)
        && hasGrandParent(target)
        && hasClass(target, CLASS$1);
}
function fullSrc(wrapper, image) {
    var fullSrc = wrapper.getAttribute('data-src');
    return fullSrc === null ? image.src : fullSrc;
}

var CLASS$2 = 'zoom';
var EXPANDING_CLASS = CLASS$2 + "--expanding";
var EXPANDED_CLASS = CLASS$2 + "--expanded";
var COLLAPSING_CLASS = CLASS$2 + "--collapsing";
function isWrapperExpanding(wrapper) {
    return hasClass(wrapper, EXPANDING_CLASS);
}
function startExpandingWrapper(wrapper) {
    addClass(wrapper, EXPANDING_CLASS);
}
function stopExpandingWrapper(wrapper) {
    removeClass(wrapper, EXPANDING_CLASS);
}
function isWrapperExpanded(wrapper) {
    return hasClass(wrapper, EXPANDED_CLASS);
}
function setWrapperExpanded(wrapper) {
    addClass(wrapper, EXPANDED_CLASS);
}
function unsetWrapperExpanded(wrapper) {
    removeClass(wrapper, EXPANDED_CLASS);
}
function isWrapperCollapsing(wrapper) {
    return hasClass(wrapper, COLLAPSING_CLASS);
}
function startCollapsingWrapper(wrapper) {
    addClass(wrapper, COLLAPSING_CLASS);
}
function stopCollapsingWrapper(wrapper) {
    removeClass(wrapper, COLLAPSING_CLASS);
}
function isWrapperTransitioning(wrapper) {
    return isWrapperExpanding(wrapper) || isWrapperCollapsing(wrapper);
}

var CLASS$$1 = 'zoom__clone';
var VISIBLE_CLASS = CLASS$$1 + "--visible";
var LOADED_CLASS = CLASS$$1 + "--loaded";
function createClone(src) {
    var clone = document.createElement('img');
    clone.className = CLASS$$1;
    clone.src = src;
    listenForEvent(clone, 'load', function () { return addClass(clone, LOADED_CLASS); });
    return clone;
}
function showCloneOnceLoaded(elements) {
    return function () {
        if (elements.clone !== undefined && isWrapperExpanded(elements.wrapper) && !isCloneVisible(elements.clone)) {
            replaceImageWithClone(elements.image, elements.clone);
        }
    };
}
function showClone(clone) {
    addClass(clone, VISIBLE_CLASS);
}
function hideClone(clone) {
    removeClass(clone, VISIBLE_CLASS);
}
function isCloneVisible(clone) {
    return hasClass(clone, VISIBLE_CLASS);
}
function isCloneLoaded(clone) {
    return hasClass(clone, LOADED_CLASS);
}
function replaceImageWithClone(image, clone) {
    showClone(clone);
    hideImage(image);
}
function replaceCloneWithImage(image, clone) {
    showImage(image);
    hideClone(clone);
}

var CLASS$3 = 'zoom__container';
function createContainer(document) {
    return createDiv(document, CLASS$3);
}
function isContainer(element) {
    return hasClass(element, CLASS$3);
}

var CLASS$4 = 'zoom__overlay';
var VISIBLE_CLASS$1 = CLASS$4 + "--visible";
function addOverlay() {
    var overlay = createDiv(document, CLASS$4);
    document.body.appendChild(overlay);
    repaint(overlay);
    addClass(overlay, VISIBLE_CLASS$1);
    return overlay;
}
function hideOverlay(overlay) {
    removeClass(overlay, VISIBLE_CLASS$1);
}

var TRANSFORM_PROPERTIES = {
    'WebkitTransform': '-webkit-transform',
    'MozTransform': '-moz-transform',
    'msTransform': '-ms-transform',
    'OTransform': '-o-transform',
    'transform': 'transform'
};
function translate(translation) {
    return "translate(" + translation[0] + "px, " + translation[1] + "px)";
}
function translate3d(translation) {
    return "translate3d(" + translation[0] + "px, " + translation[1] + "px, 0)";
}
function scaleBy(amount) {
    return "scale(" + amount + ")";
}
function scaleTranslate(transformation) {
    return scaleBy(transformation.scale) + " " + translate(transformation.translation);
}
function scaleTranslate3d(transformation) {
    return scaleBy(transformation.scale) + " " + translate3d(transformation.translation);
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
function expandToViewport(capabilities, element, target, bounds) {
    var transformation = centreTransformation(target, bounds);
    var style = element.style;
    if (capabilities.hasTranslate3d) {
        style[capabilities.transformProperty] = scaleTranslate3d(transformation);
    }
    else {
        style[capabilities.transformProperty] = scaleTranslate(transformation);
    }
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

function useExistingElements(overlay, image) {
    var container = image.parentElement;
    var wrapper = container.parentElement;
    var clone;
    var src = fullSrc(wrapper, image);
    var cloneRequired = src !== image.src;
    if (cloneRequired) {
        clone = container.children.item(1);
    }
    return {
        overlay: overlay,
        wrapper: wrapper,
        container: container,
        image: image,
        clone: clone
    };
}
function setUpElements(overlay, image) {
    var container = createContainer(document);
    var wrapper = image.parentElement;
    var clone;
    var src = fullSrc(wrapper, image);
    var cloneRequired = src !== image.src;
    if (cloneRequired) {
        clone = createClone(src);
    }
    return {
        overlay: overlay,
        wrapper: wrapper,
        container: container,
        image: image,
        clone: clone
    };
}

function pageScrollY(window) {
    if (window.pageYOffset === undefined) {
        return rootElement(window.document).scrollTop;
    }
    else {
        return window.pageYOffset;
    }
}

var ESCAPE_KEY_CODE = 27;
function escKeyPressed(listener) {
    return function (event) {
        if (event.keyCode === ESCAPE_KEY_CODE) {
            event.preventDefault();
            event.stopPropagation();
            fireEventListener(listener, event);
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
function addDismissListeners(window, config, container, collapse) {
    var initialScrollY = pageScrollY(window);
    var scrolledAway = addEventListener(window, 'scroll', scrolled(initialScrollY, config.scrollDelta, function () { return pageScrollY(window); }, collapse));
    var pressedEsc = addEventListener(window.document, 'keyup', escKeyPressed(collapse));
    var dismissed = addEventListener(container, 'click', collapse);
    return function () {
        removeEventListener(window, 'scroll', scrolledAway);
        removeEventListener(window.document, 'keyup', pressedEsc);
        removeEventListener(container, 'click', dismissed);
    };
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

function capabilitiesOf(window) {
    var body = document.body;
    var bodyStyle = body.style;
    var transformProperty = vendorProperty(bodyStyle, 'transform');
    var transitionProperty = vendorProperty(bodyStyle, 'transition');
    var transitionEndEvent;
    var hasTransform = false;
    if (transformProperty !== undefined) {
        hasTransform = true;
    }
    var hasTransitions = false;
    if (transitionProperty !== undefined) {
        transitionEndEvent = TRANSITION_END_EVENTS[transitionProperty];
        hasTransitions = transitionEndEvent !== null;
    }
    var hasTranslate3d = false;
    if (transformProperty !== undefined) {
        hasTranslate3d = supportsTranslate3d(window, transformProperty);
    }
    return {
        transformProperty: transformProperty,
        transitionProperty: transitionProperty,
        transitionEndEvent: transitionEndEvent,
        hasTransform: hasTransform,
        hasTransitions: hasTransitions,
        hasTranslate3d: hasTranslate3d
    };
}
function supportsTranslate3d(window, transformProperty) {
    var computeStyle = window.getComputedStyle;
    var property = TRANSFORM_PROPERTIES[transformProperty];
    if (typeof computeStyle === 'function' && property !== undefined) {
        var document_1 = window.document;
        var body = document_1.body;
        var child = document_1.createElement('p');
        child.style[transformProperty] = 'translate3d(1px,1px,1px)';
        body.appendChild(child);
        var value = computeStyle(child).getPropertyValue(property);
        body.removeChild(child);
        return value.length > 0 && value !== 'none';
    }
    else {
        return false;
    }
}

function collapsed(window, config, elements) {
    if (elements.clone !== undefined) {
        replaceCloneWithImage(elements.image, elements.clone);
    }
    deactivateImage(elements.image);
    window.document.body.removeChild(elements.overlay);
    stopCollapsingWrapper(elements.wrapper);
    resetStyle(elements.wrapper, 'height');
    setTimeout(function () { return addZoomListener(window, config); }, 1);
}
function zoomInstant(window, config, elements, target, showCloneListener) {
    var bounds = boundsFrom(elements.image);
    var resized = addEventListener(window, 'resize', function () {
        var wrapperPosition = positionFrom(elements.wrapper.getBoundingClientRect());
        bounds = createBounds(wrapperPosition, bounds.size);
        setBoundsPx(elements.container.style, centreBounds(window.document, target, bounds));
    });
    var removeDismissListeners;
    var collapse = function () {
        removeDismissListeners();
        removeEventListener(window, 'resize', resized);
        if (elements.clone !== undefined && showCloneListener !== undefined && !isCloneLoaded(elements.clone)) {
            removeEventListener(elements.clone, 'load', showCloneListener);
        }
        unsetWrapperExpanded(elements.wrapper);
        resetBounds(elements.container.style);
        collapsed(window, config, elements);
    };
    removeDismissListeners = addDismissListeners(window, config, elements.container, collapse);
    setWrapperExpanded(elements.wrapper);
    elements.wrapper.style.height = pixels(elements.image.height);
    activateImage(elements.image);
    setBoundsPx(elements.container.style, centreBounds(document, target, bounds));
}
function zoomTransition(window, capabilities, config, elements, target, showCloneListener) {
    var bounds = boundsFrom(elements.image);
    var resized = addEventListener(window, 'resize', function () {
        var wrapperPosition = positionFrom(elements.wrapper.getBoundingClientRect());
        bounds = createBounds(wrapperPosition, bounds.size);
        if (isWrapperTransitioning(elements.wrapper)) {
            expandToViewport(capabilities, elements.container, target, bounds);
        }
        else {
            setBoundsPx(elements.container.style, centreBounds(window.document, target, bounds));
        }
    });
    var expandedListener;
    var removeDismissListeners;
    var collapse = function () {
        removeDismissListeners();
        removeEventListener(window, 'resize', resized);
        if (elements.clone !== undefined && showCloneListener !== undefined && !isCloneLoaded(elements.clone)) {
            removeEventListener(elements.clone, 'load', showCloneListener);
        }
        hideOverlay(elements.overlay);
        startCollapsingWrapper(elements.wrapper);
        var collapsedListener = listenForEvent(elements.container, capabilities.transitionEndEvent, function () {
            collapsed(window, config, elements);
        });
        if (isWrapperExpanding(elements.wrapper)) {
            if (expandedListener !== undefined) {
                removeEventListener(elements.container, capabilities.transitionEndEvent, expandedListener);
            }
            resetStyle(elements.container, capabilities.transformProperty);
            stopExpandingWrapper(elements.wrapper);
        }
        else {
            ignoreTransitions(elements.container, capabilities.transitionProperty, function () {
                expandToViewport(capabilities, elements.container, target, bounds);
            });
            resetStyle(elements.container, capabilities.transformProperty);
            resetBounds(elements.container.style);
            unsetWrapperExpanded(elements.wrapper);
        }
        if (collapsedListener === undefined) {
            collapsed(window, config, elements);
        }
    };
    function expanded() {
        if (elements.clone !== undefined && isCloneLoaded(elements.clone) && !isCloneVisible(elements.clone)) {
            if (showCloneListener !== undefined) {
                removeEventListener(elements.clone, capabilities.transitionEndEvent, showCloneListener);
            }
            replaceImageWithClone(elements.image, elements.clone);
        }
        stopExpandingWrapper(elements.wrapper);
        setWrapperExpanded(elements.wrapper);
        ignoreTransitions(elements.container, capabilities.transitionProperty, function () {
            resetStyle(elements.container, capabilities.transformProperty);
            setBoundsPx(elements.container.style, centreBounds(window.document, target, bounds));
        });
    }
    removeDismissListeners = addDismissListeners(window, config, elements.container, collapse);
    startExpandingWrapper(elements.wrapper);
    elements.wrapper.style.height = pixels(elements.image.height);
    activateImage(elements.image);
    expandedListener = listenForEvent(elements.container, capabilities.transitionEndEvent, function () { return expanded(); });
    if (expandedListener === undefined) {
        expanded();
    }
    else {
        expandToViewport(capabilities, elements.container, target, bounds);
    }
}
function clickedZoomable(window, config, event, zoomListener) {
    var image = event.target;
    var parent = image.parentElement;
    var previouslyZoomed = isContainer(parent);
    var wrapper = previouslyZoomed ? parent.parentElement : parent;
    if (event.metaKey || event.ctrlKey) {
        window.open(fullSrc(wrapper, image), '_blank');
    }
    else {
        if (zoomListener !== undefined) {
            removeEventListener(window.document.body, 'click', zoomListener);
        }
        var elements = void 0;
        var overlay = addOverlay();
        if (previouslyZoomed) {
            elements = useExistingElements(overlay, image);
            if (elements.clone !== undefined && isCloneLoaded(elements.clone)) {
                replaceImageWithClone(image, elements.clone);
            }
        }
        else {
            elements = setUpElements(overlay, image);
            elements.wrapper.replaceChild(elements.container, image);
            elements.container.appendChild(image);
            if (elements.clone !== undefined) {
                elements.container.appendChild(elements.clone);
            }
        }
        var showCloneListener = void 0;
        if (elements.clone !== undefined) {
            if (isCloneLoaded(elements.clone)) {
                replaceImageWithClone(image, elements.clone);
            }
            else {
                showCloneListener = addEventListener(elements.clone, 'load', showCloneOnceLoaded(elements));
            }
        }
        var target = targetSize(elements.wrapper);
        var capabilities = capabilitiesOf(window);
        if (capabilities.hasTransform && capabilities.hasTransitions) {
            zoomTransition(window, capabilities, config, elements, target, showCloneListener);
        }
        else {
            zoomInstant(window, config, elements, target, showCloneListener);
        }
    }
}
function addZoomListener(window, config) {
    var listener = addEventListener(window.document.body, 'click', function (event) {
        if (isZoomable(event.target)) {
            event.preventDefault();
            event.stopPropagation();
            clickedZoomable(window, config, event, listener);
        }
    });
}
function listenWhenReady(window, config) {
    if (config === void 0) { config = defaultConfig(); }
    ready(window.document, function () { return addZoomListener(window, config); });
}

listenWhenReady(window);

})));
//# sourceMappingURL=zoom.js.map
