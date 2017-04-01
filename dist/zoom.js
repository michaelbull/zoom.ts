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

var CLASS_SEPARATOR = ' ';
function classesFrom(classList) {
    return classList.split(CLASS_SEPARATOR);
}
function classNotEmpty(className) {
    return className.length > 0;
}
function hasClass(element, className) {
    return element.className.indexOf(className) !== -1;
}
function addClass(element, add) {
    element.className = classesFrom(element.className)
        .concat(add)
        .filter(classNotEmpty)
        .join(CLASS_SEPARATOR);
}
function removeClass(element, remove) {
    element.className = classesFrom(element.className)
        .filter(function (className) { return classNotEmpty(className) && className !== remove; })
        .join(CLASS_SEPARATOR);
}

var CLASS = 'zoom__clone';
var VISIBLE_CLASS = CLASS + "--visible";
var LOADED_CLASS = CLASS + "--loaded";
function createClone(src) {
    var clone = document.createElement('img');
    clone.className = CLASS;
    clone.src = src;
    var listener = addEventListener(clone, 'load', function () {
        if (listener !== undefined) {
            removeEventListener(clone, 'load', listener);
        }
        addClass(clone, LOADED_CLASS);
    });
    return clone;
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
function dimension(element, dimension) {
    var value = element.getAttribute("data-" + dimension);
    return value === null ? Infinity : Number(value);
}
function targetDimensions(element) {
    return [
        dimension(element, 'width'),
        dimension(element, 'height')
    ];
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
        addEventListener(document, 'DOMContentLoaded', function () { return callback(); });
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
function centrePosition(outer, inner, innerPosition) {
    return subtractVectors(centrePadding(outer, inner), innerPosition);
}
/**
 * Calculates the translation required for an inner vector to appear in the centre of an outer vector.
 * @param outer The outer vector.
 * @param inner The inner vector.
 * @param innerPosition The position of the inner vector.
 * @param innerScale The scale of the inner vector.
 * @returns {Vector} The translation.
 */
function centreTranslation(outer, inner, innerPosition, innerScale) {
    var scaled = scaleVector(inner, innerScale);
    var innerCentredWithinScaled = addVectors(innerPosition, centrePadding(inner, scaled));
    var scaledCenteredWithinOuter = centrePosition(outer, scaled, innerCentredWithinScaled);
    return shrinkVector(scaledCenteredWithinOuter, innerScale);
}

function centreBounds(document, target, size, position) {
    var viewport = viewportSize(document);
    var cappedTarget = minimizeVectors(viewport, target);
    var factor = minimumDivisor(cappedTarget, size);
    var scaled = scaleVector(size, factor);
    var centre = centrePosition(viewport, scaled, position);
    return [
        centre,
        scaled
    ];
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
    return null;
}

function transform(style, value) {
    var property = vendorProperty(style, 'transform');
    if (property !== null) {
        style[property] = value;
    }
}
function resetTransformation(style) {
    transform(style, '');
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
    var position = bounds[0];
    var size = bounds[1];
    setBounds(style, position[0] + "px", position[1] + "px", size[0] + "px", size[1] + "px");
}
function setHeightPx(style, height) {
    style.height = height + "px";
}
function unsetHeight(style) {
    style.height = '';
}
function translate(position, use3d) {
    if (use3d) {
        return "translate3d(" + position[0] + "px, " + position[1] + "px, 0)";
    }
    else {
        return "translate(" + position[0] + "px, " + position[1] + "px)";
    }
}
function scaleBy(amount) {
    return "scale(" + amount + ")";
}
function scaleAndTranslate(scale, translation, use3d) {
    return scaleBy(scale) + " " + translate(translation, use3d);
}
function centreTransformation(document, target, size, position, use3d) {
    var viewport = viewportSize(document);
    var cappedTarget = minimizeVectors(viewport, target);
    var scale = minimumDivisor(cappedTarget, size);
    var translation = centreTranslation(viewport, size, position, scale);
    return scaleAndTranslate(scale, translation, use3d);
}

var CLASS$1 = 'zoom__container';
function createContainer(document) {
    return createDiv(document, CLASS$1);
}
function isContainer(element) {
    return hasClass(element, CLASS$1);
}
function fixToCentre(container, document, target, size, position) {
    resetTransformation(container.style);
    setBoundsPx(container.style, centreBounds(document, target, size, position));
}
function transitionToCentre(container, document, target, size, position, use3d) {
    transform(container.style, centreTransformation(document, target, size, position, use3d));
}
function refreshContainer(container, callback) {
    container.style.transition = 'initial';
    callback();
    repaint(container);
    container.style.transition = '';
}
function restoreContainer(container) {
    resetTransformation(container.style);
    resetBounds(container.style);
}

var CLASS$2 = 'zoom__element';
var HIDDEN_CLASS = CLASS$2 + "--hidden";
var ACTIVE_CLASS = CLASS$2 + "--active";
function hideImage(image) {
    addClass(image, HIDDEN_CLASS);
}
function showImage(image) {
    removeClass(image, HIDDEN_CLASS);
    removeClass(image, ACTIVE_CLASS);
}

function activateImage(image) {
    addClass(image, ACTIVE_CLASS);
}

function isZoomable(target) {
    return target instanceof HTMLImageElement && target.parentElement !== null && hasClass(target, CLASS$2);
}

var CLASS$3 = 'zoom__overlay';
var VISIBLE_CLASS$1 = CLASS$3 + "--visible";
function addOverlay(document) {
    var overlay = createDiv(document, CLASS$3);
    document.body.appendChild(overlay);
    repaint(overlay);
    addClass(overlay, VISIBLE_CLASS$1);
    return overlay;
}
function hideOverlay(overlay) {
    removeClass(overlay, VISIBLE_CLASS$1);
}

var CLASS$4 = 'zoom';
var EXPANDING_CLASS = CLASS$4 + "--expanding";
var EXPANDED_CLASS = CLASS$4 + "--expanded";
var COLLAPSING_CLASS = CLASS$4 + "--collapsing";
function resolveSrc(wrapper, image) {
    var attribute = wrapper.getAttribute('data-src');
    if (attribute !== null) {
        return attribute;
    }
    return image.src;
}
function isWrapperExpanding(wrapper) {
    return hasClass(wrapper, EXPANDING_CLASS);
}
function isWrapperExpanded(wrapper) {
    return hasClass(wrapper, EXPANDED_CLASS);
}
function isWrapperCollapsing(wrapper) {
    return hasClass(wrapper, COLLAPSING_CLASS);
}
function isWrapperTransitioning(wrapper) {
    return isWrapperExpanding(wrapper) || isWrapperCollapsing(wrapper);
}
function expandWrapper(wrapper, toHeight) {
    addClass(wrapper, EXPANDING_CLASS);
    setHeightPx(wrapper.style, toHeight);
}
function stopExpandingWrapper(wrapper) {
    removeClass(wrapper, EXPANDING_CLASS);
}
function finishExpandingWrapper(wrapper) {
    stopExpandingWrapper(wrapper);
    addClass(wrapper, EXPANDED_CLASS);
}
function collapseWrapper(wrapper) {
    removeClass(wrapper, EXPANDED_CLASS);
    addClass(wrapper, COLLAPSING_CLASS);
}
function finishCollapsingWrapper(wrapper) {
    removeClass(wrapper, COLLAPSING_CLASS);
    unsetHeight(wrapper.style);
}

var ESCAPE_KEY_CODE = 27;
function escKeyPressed(callback) {
    return function (event) {
        if (event.keyCode === ESCAPE_KEY_CODE) {
            event.preventDefault();
            callback();
        }
    };
}
function scrolled(start, minAmount, callback, current) {
    return function () {
        if (Math.abs(start - current()) >= minAmount) {
            callback();
        }
    };
}

var TRANSFORM_PROPERTIES = {
    WebkitTransform: '-webkit-transform',
    MozTransform: '-moz-transform',
    msTransform: '-ms-transform',
    OTransform: '-o-transform',
    transform: 'transform'
};
var TRANSITION_END_EVENTS = {
    WebkitTransition: 'webkitTransitionEnd',
    MozTransition: 'transitionend',
    OTransition: 'oTransitionEnd',
    msTransition: 'MSTransitionEnd',
    transition: 'transitionend'
};
function hasTranslate3d(window, transformProperty) {
    var computeStyle = window.getComputedStyle;
    var property = TRANSFORM_PROPERTIES[transformProperty];
    if (typeof computeStyle === 'function' && property !== undefined) {
        var document_1 = window.document;
        var child = document_1.createElement('p');
        child.style[transformProperty] = 'translate3d(1px,1px,1px)';
        var body = document_1.body;
        body.appendChild(child);
        var value = computeStyle(child).getPropertyValue(property);
        body.removeChild(child);
        return value.length > 0 && value !== 'none';
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
function pageScrollY(window) {
    if (window.pageYOffset === undefined) {
        return rootElement(window.document).scrollTop;
    }
    else {
        return window.pageYOffset;
    }
}

var DEFAULT_SCROLL_DELTA = 50;
function setUp(src, wrapper, image) {
    var container = createContainer(document);
    var clone = createClone(src);
    var listener = addEventListener(clone, 'load', function () {
        if (listener !== undefined) {
            removeEventListener(clone, 'load', listener);
        }
        if (isWrapperExpanded(wrapper) && !isCloneVisible(clone)) {
            showClone(clone);
            hideImage(image);
        }
    });
    wrapper.replaceChild(container, image);
    container.appendChild(image);
    container.appendChild(clone);
    return undefined;
}
// TODO: clean this up somehow
function collapsed(overlay, wrapper) {
    document.body.removeChild(overlay);
    finishCollapsingWrapper(wrapper);
    addZoomListener();
}
function expanded(wrapper, container, target, imageSize, imagePosition, clone, showCloneListener, transitionEndEvent, image) {
    finishExpandingWrapper(wrapper);
    refreshContainer(container, function () {
        fixToCentre(container, document, target, imageSize, imagePosition);
    });
    if (isCloneLoaded(clone) && !isCloneVisible(clone)) {
        if (showCloneListener !== undefined) {
            removeEventListener(clone, transitionEndEvent, showCloneListener);
        }
        showClone(clone);
        hideImage(image);
    }
}
function zoom(wrapper, image, transformProperty, transitionProperty, showCloneListener, scrollY, overlay) {
    var container = image.parentElement;
    var clone = container.children.item(1);
    var target = targetDimensions(wrapper);
    var imageRect = image.getBoundingClientRect();
    var imagePosition = positionFrom(imageRect);
    var imageSize = sizeFrom(imageRect);
    var use3d = transformProperty !== null && hasTranslate3d(window, transformProperty);
    var transitionEndEvent = transitionProperty === null ? null : TRANSITION_END_EVENTS[transitionProperty];
    function recalculateScale() {
        if (isWrapperTransitioning(wrapper)) {
            transitionToCentre(container, document, target, imageSize, imagePosition, use3d);
        }
        else {
            fixToCentre(container, document, target, imageSize, imagePosition);
        }
    }
    var expandedListener = undefined;
    if (transitionEndEvent !== null) {
        expandedListener = addEventListener(container, transitionEndEvent, function () {
            if (expandedListener !== undefined) {
                removeEventListener(container, transitionEndEvent, expandedListener);
            }
            expanded(wrapper, container, target, imageSize, imagePosition, clone, showCloneListener, transitionEndEvent, image);
        });
    }
    var removeListeners;
    function collapse() {
        removeListeners();
        if (isWrapperExpanding(wrapper)) {
            if (expandedListener !== undefined) {
                removeEventListener(container, transitionEndEvent, expandedListener);
            }
            stopExpandingWrapper(wrapper);
        }
        if (!isCloneLoaded(clone) && showCloneListener !== undefined) {
            removeEventListener(clone, 'load', showCloneListener);
        }
        collapseWrapper(wrapper);
        hideOverlay(overlay);
        showImage(image);
        hideClone(clone);
        if (transitionEndEvent === null) {
            collapsed(overlay, wrapper);
        }
        else {
            var collapsedListener_1 = addEventListener(container, transitionEndEvent, function () {
                if (collapsedListener_1 !== undefined) {
                    removeEventListener(container, transitionEndEvent, collapsedListener_1);
                }
                collapsed(overlay, wrapper);
            });
            if (collapsedListener_1 === undefined) {
                collapsed(overlay, wrapper);
            }
            else {
                transitionToCentre(container, document, target, imageSize, imagePosition, use3d);
            }
        }
        refreshContainer(container, recalculateScale);
        restoreContainer(container);
    }
    var initialScrollY = pageScrollY(window);
    var pressedEsc = addEventListener(document, 'keyup', escKeyPressed(collapse));
    var dismissed = addEventListener(container, 'click', function () { return collapse(); });
    var scrolledAway = addEventListener(window, 'scroll', scrolled(initialScrollY, scrollY, function () { return collapse(); }, function () { return pageScrollY(window); }));
    var resized = addEventListener(window, 'resize', function () {
        imagePosition = positionFrom(wrapper.getBoundingClientRect());
        recalculateScale();
    });
    removeListeners = function () {
        removeEventListener(document, 'keyup', pressedEsc);
        removeEventListener(container, 'click', dismissed);
        removeEventListener(window, 'scroll', scrolledAway);
        removeEventListener(window, 'resize', resized);
    };
    expandWrapper(wrapper, image.height);
    activateImage(image);
    if (transitionEndEvent === null || expandedListener === undefined) {
        expanded(wrapper, container, target, imageSize, imagePosition, clone, showCloneListener, transitionEndEvent, image);
    }
    else {
        transitionToCentre(container, document, target, imageSize, imagePosition, use3d);
    }
}
function clickedZoomable(event, zoomListener, scrollDelta) {
    var image = event.target;
    var parent = image.parentElement;
    var grandParent = parent.parentElement;
    var alreadySetUp = isContainer(parent);
    var wrapper = alreadySetUp ? grandParent : parent;
    var src = resolveSrc(wrapper, image);
    var transformProperty = vendorProperty(document.body.style, 'transform');
    if (transformProperty === null || event.metaKey || event.ctrlKey) {
        window.open(src, '_blank');
    }
    else {
        if (zoomListener !== undefined) {
            removeEventListener(document.body, 'click', zoomListener);
        }
        var transitionProperty = vendorProperty(document.body.style, 'transition');
        var showClone_1 = alreadySetUp ? undefined : setUp(src, wrapper, image);
        var overlay = addOverlay(document);
        zoom(wrapper, image, transformProperty, transitionProperty, showClone_1, scrollDelta, overlay);
    }
}
function addZoomListener(scrollDelta) {
    if (scrollDelta === void 0) { scrollDelta = DEFAULT_SCROLL_DELTA; }
    var listener = addEventListener(document.body, 'click', function (event) {
        if (isZoomable(event.target)) {
            event.preventDefault();
            removeEventListener(document.body, 'click', listener);
            clickedZoomable(event, listener, scrollDelta);
        }
    });
}

ready(document, function () { return addZoomListener(); });

})));
//# sourceMappingURL=zoom.js.map
