(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var ZoomedImageElement_1 = require('./element/ZoomedImageElement');
var ZoomedVideoElement_1 = require('./element/ZoomedVideoElement');
var Attributes_1 = require('./util/Attributes');
var Classes_1 = require('./util/Classes');
var Dimensions_1 = require('./util/Dimensions');
/**
 * The key code for the Esc key.
 */
var ESCAPE_KEY_CODE = 27;
/**
 * The amount of pixels required to scroll vertically with a scroll wheel or keyboard to dismiss a zoomed element.
 */
var SCROLL_Y_DELTA = 70;
/**
 * The amount of pixels required to scroll vertically with a touch screen to dismiss a zoomed element.
 */
var TOUCH_Y_DELTA = 30;
/**
 * The overlay element.
 */
var overlay = document.createElement('div');
overlay.className = Classes_1.OVERLAY_CLASS;
/**
 * Entry point to the library.
 */
var Zoom = (function () {
    function Zoom() {
        var _this = this;
        /**
         * An event listener that calls {@link close} if the difference between the {@link _initialScrollY} and
         * {@link Dimensions.scrollY} is more than {@link SCROLL_Y_DELTA}.
         */
        this.scrollListener = function () {
            if (Math.abs(_this._initialScrollY - Dimensions_1.Dimensions.scrollY()) > SCROLL_Y_DELTA) {
                _this.close();
            }
        };
        /**
         * An event listener that calls {@link close} if the event's key code was the {@link ESCAPE_KEY_CODE}.
         * @param event The keyboard event.
         */
        this.keyboardListener = function (event) {
            if (event.keyCode === ESCAPE_KEY_CODE) {
                _this.close();
            }
        };
        /**
         * An event listener that records the event's {@link _initialTouchY} and then adds {@link touchMoveListener}.
         * @param event The touch start event.
         */
        this.touchStartListener = function (event) {
            _this._initialTouchY = event.touches[0].pageY;
            event.target.addEventListener('touchmove', _this.touchMoveListener);
        };
        /**
         * An event listener that calls {@link close} and removes itself if the difference between
         * {@link _initialTouchY} and the current touch Y position is more than {@link TOUCH_Y_DELTA}.
         * @param event The touch movement event.
         */
        this.touchMoveListener = function (event) {
            if (Math.abs(event.touches[0].pageY - _this._initialTouchY) > TOUCH_Y_DELTA) {
                _this.close();
                event.target.removeEventListener('touchmove', _this.touchMoveListener);
            }
        };
    }
    /**
     * Executes a function when the DOM is fully loaded.
     * @param fn The function to execute.
     * @see http://youmightnotneedjquery.com/#ready
     */
    Zoom.ready = function (fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function () {
                fn();
            });
        }
        else {
            fn();
        }
    };
    /**
     * Listens for click events on {@link Zoomable} elements and appends the {@link overlay} to the document.
     */
    Zoom.prototype.listen = function () {
        var _this = this;
        Zoom.ready(function () {
            document.body.addEventListener('click', function (event) {
                var target = event.target;
                if (target.getAttribute(Attributes_1.ZOOM_FUNCTION_KEY) === Attributes_1.ZOOM_IN_VALUE) {
                    _this.zoom(event);
                }
                else if (target.getAttribute(Attributes_1.ZOOM_FUNCTION_KEY) === Attributes_1.ZOOM_OUT_VALUE) {
                    _this.close();
                }
            });
            document.body.appendChild(overlay);
        });
    };
    /**
     * Zooms in on an element.
     * @param event The click event that occurred when interacting with the element.
     */
    Zoom.prototype.zoom = function (event) {
        event.stopPropagation();
        var bodyClassList = document.body.classList;
        if (bodyClassList.contains(Classes_1.OVERLAY_OPEN_CLASS) || bodyClassList.contains(Classes_1.OVERLAY_LOADING_CLASS)) {
            return;
        }
        var target = event.target;
        if (event.metaKey || event.ctrlKey) {
            var url = target.getAttribute(Attributes_1.FULL_SRC_KEY) || target.currentSrc || target.src;
            window.open(url, '_blank');
            return;
        }
        if (target.width >= window.innerWidth) {
            // target is already as big (or bigger), therefore we gain nothing from zooming in on it
            return;
        }
        if (target.tagName === 'IMG' || target.tagName === 'PICTURE') {
            this._current = new ZoomedImageElement_1.ZoomedImageElement(target);
        }
        else {
            this._current = new ZoomedVideoElement_1.ZoomedVideoElement(target);
        }
        this._current.open();
        this.addCloseListeners();
        this._initialScrollY = Dimensions_1.Dimensions.scrollY();
    };
    /**
     * Closes {@link _current}.
     */
    Zoom.prototype.close = function () {
        if (this._current) {
            this._current.close();
            this.removeCloseListeners();
            this._current = undefined;
        }
    };
    /**
     * Adds event listeners to the page to listen for element dismissal.
     */
    Zoom.prototype.addCloseListeners = function () {
        window.addEventListener('scroll', this.scrollListener);
        document.addEventListener('keyup', this.keyboardListener);
        document.addEventListener('touchstart', this.touchStartListener);
    };
    /**
     * Removes the event listeners that were listening for element dismissal.
     */
    Zoom.prototype.removeCloseListeners = function () {
        window.removeEventListener('scroll', this.scrollListener);
        document.removeEventListener('keyup', this.keyboardListener);
        document.removeEventListener('touchstart', this.touchStartListener);
    };
    return Zoom;
}());
exports.Zoom = Zoom;

},{"./element/ZoomedImageElement":3,"./element/ZoomedVideoElement":4,"./util/Attributes":6,"./util/Classes":7,"./util/Dimensions":8}],2:[function(require,module,exports){
"use strict";
var Attributes_1 = require('../util/Attributes');
var Classes_1 = require('../util/Classes');
var Dimensions_1 = require('../util/Dimensions');
var Style_1 = require('../util/Style');
var wrap = document.createElement('div');
wrap.className = Classes_1.WRAP_CLASS;
/**
 * Represents a {@link Zoomable} element that may be opened or closed.
 */
var ZoomedElement = (function () {
    /**
     * Creates a new {@link ZoomedElement}
     * @param element The underlying HTMLElement.
     */
    function ZoomedElement(element) {
        var _this = this;
        /**
         * An event lister that adds the {@link OVERLAY_TRANSITIONING_CLASS} to the document body.
         */
        this.openedListener = function () {
            ZoomedElement.removeTransitionEndListener(_this._element, _this.openedListener);
            document.body.classList.remove(Classes_1.OVERLAY_TRANSITIONING_CLASS);
        };
        /**
         * An event listener that closes the zoomed view.
         */
        this.closedListener = function () {
            ZoomedElement.removeTransitionEndListener(_this._element, _this.closedListener);
            if (wrap.parentNode) {
                _this._element.setAttribute(Attributes_1.ZOOM_FUNCTION_KEY, Attributes_1.ZOOM_IN_VALUE);
                wrap.parentNode.replaceChild(_this._element, wrap);
                document.body.classList.remove(Classes_1.OVERLAY_TRANSITIONING_CLASS);
                _this.zoomedOut();
            }
        };
        this._fullSrc = element.getAttribute(Attributes_1.FULL_SRC_KEY) || element.currentSrc || element.src;
        this._element = element;
    }
    /**
     * Adds an event listener that is called on the end of a transition.
     * @param element The element whose events should be listened to.
     * @param listener The listener to call once an event is received.
     */
    ZoomedElement.addTransitionEndListener = function (element, listener) {
        if ('transition' in document.body.style) {
            element.addEventListener('transitionend', listener);
            element.addEventListener('webkitTransitionEnd', listener);
        }
        else {
            listener(undefined);
        }
    };
    /**
     * Removes an event listener that is called on the end of a transition.
     * @param element The element whose events should no longer be listened to.
     * @param listener The listener to remove.
     */
    ZoomedElement.removeTransitionEndListener = function (element, listener) {
        element.removeEventListener('transitionend', listener);
        element.removeEventListener('webkitTransitionEnd', listener);
    };
    /**
     * Opens the zoomed view.
     */
    ZoomedElement.prototype.open = function () {
        document.body.classList.add(Classes_1.OVERLAY_LOADING_CLASS);
        this.zoomedIn();
        this._element.src = this._fullSrc;
        ZoomedElement.addTransitionEndListener(this._element, this.openedListener);
    };
    /**
     * Closes the zoomed view.
     */
    ZoomedElement.prototype.close = function () {
        var bodyClassList = document.body.classList;
        bodyClassList.remove(Classes_1.OVERLAY_OPEN_CLASS);
        bodyClassList.add(Classes_1.OVERLAY_TRANSITIONING_CLASS);
        Style_1.Style.transform(this._element, '');
        Style_1.Style.transform(wrap, '');
        ZoomedElement.addTransitionEndListener(this._element, this.closedListener);
    };
    /**
     * Called once the {@link _fullSrc} src of the {@link _element} is loaded.
     * @param width The width of the {@link _element}.
     * @param height The height of the {@link _element}.
     */
    ZoomedElement.prototype.loaded = function (width, height) {
        var bodyClassList = document.body.classList;
        bodyClassList.remove(Classes_1.OVERLAY_LOADING_CLASS);
        bodyClassList.add(Classes_1.OVERLAY_TRANSITIONING_CLASS);
        bodyClassList.add(Classes_1.OVERLAY_OPEN_CLASS);
        this._element.parentNode.insertBefore(wrap, this._element);
        wrap.appendChild(this._element);
        this._element.setAttribute(Attributes_1.ZOOM_FUNCTION_KEY, Attributes_1.ZOOM_OUT_VALUE);
        this.scaleElement(width, height);
        this.translateWrap();
    };
    /**
     * Forces the {@link _element} to repaint on the canvas.
     */
    ZoomedElement.prototype.repaint = function () {
        /* tslint:disable */
        this._element.offsetWidth;
        /* tslint:enable */
    };
    /**
     * Scales the {@link _element} to fill the dimensions of the viewport.
     * @param width The width of the {@link _element}.
     * @param height The height of the {@link _element}.
     */
    ZoomedElement.prototype.scaleElement = function (width, height) {
        this.repaint();
        var viewportWidth = Dimensions_1.Dimensions.viewportWidth();
        var viewportHeight = Dimensions_1.Dimensions.viewportHeight();
        var viewportAspectRatio = viewportWidth / viewportHeight;
        var maxScaleFactor = width / this.width();
        var aspectRatio = width / height;
        var scaleFactor;
        if (width < viewportWidth && height < viewportHeight) {
            scaleFactor = maxScaleFactor;
        }
        else if (aspectRatio < viewportAspectRatio) {
            scaleFactor = (viewportHeight / height) * maxScaleFactor;
        }
        else {
            scaleFactor = (viewportWidth / width) * maxScaleFactor;
        }
        Style_1.Style.transform(this._element, 'scale(' + scaleFactor + ')');
    };
    /**
     * Translates the coordinates of the {@link wrap} to offset the {@link _element} to the center of the page.
     */
    ZoomedElement.prototype.translateWrap = function () {
        this.repaint();
        var scrollX = Dimensions_1.Dimensions.scrollX();
        var scrollY = Dimensions_1.Dimensions.scrollY();
        var viewportWidth = Dimensions_1.Dimensions.viewportWidth();
        var viewportHeight = Dimensions_1.Dimensions.viewportHeight();
        var viewportX = viewportWidth / 2;
        var viewportY = scrollY + (viewportHeight / 2);
        var element = this._element;
        var rect = element.getBoundingClientRect();
        var centerX = rect.left + scrollX + ((element.width || element.offsetWidth) / 2);
        var centerY = rect.top + scrollY + ((element.height || element.offsetHeight) / 2);
        var x = Math.round(viewportX - centerX);
        var y = Math.round(viewportY - centerY);
        Style_1.Style.transform(wrap, 'translate(' + x + 'px, ' + y + 'px) translateZ(0)');
    };
    return ZoomedElement;
}());
exports.ZoomedElement = ZoomedElement;

},{"../util/Attributes":6,"../util/Classes":7,"../util/Dimensions":8,"../util/Style":9}],3:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Attributes_1 = require('../util/Attributes');
var ZoomedElement_1 = require('./ZoomedElement');
/**
 * Represents a {@link ZoomedElement} whose underlying element is an HTMLImageElement.
 */
var ZoomedImageElement = (function (_super) {
    __extends(ZoomedImageElement, _super);
    /**
     * Creates a new {@link ZoomedImageElement}.
     * @param element The underlying image element.
     */
    function ZoomedImageElement(element) {
        _super.call(this, element);
        this._image = element;
    }
    /**
     * @inheritDoc
     */
    ZoomedImageElement.prototype.zoomedIn = function () {
        var _this = this;
        var image = document.createElement('img');
        image.onload = function () {
            _this.loaded(image.width, image.height);
            _this._image.removeAttribute(Attributes_1.FULL_SRC_KEY);
        };
        image.src = this._fullSrc;
    };
    /**
     * @inheritDoc
     */
    ZoomedImageElement.prototype.zoomedOut = function () {
        /* empty */
    };
    /**
     * @inheritDoc
     */
    ZoomedImageElement.prototype.width = function () {
        return this._image.width;
    };
    return ZoomedImageElement;
}(ZoomedElement_1.ZoomedElement));
exports.ZoomedImageElement = ZoomedImageElement;

},{"../util/Attributes":6,"./ZoomedElement":2}],4:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Attributes_1 = require('../util/Attributes');
var ZoomedElement_1 = require('./ZoomedElement');
/**
 * Represents a {@link ZoomedElement} whose underlying element is a HTMLVideoElement.
 */
var ZoomedVideoElement = (function (_super) {
    __extends(ZoomedVideoElement, _super);
    /**
     * Creates a new {@link ZoomedVideoElement}.
     * @param element The underlying video element.
     */
    function ZoomedVideoElement(element) {
        _super.call(this, element);
        this._video = element;
    }
    /**
     * @inheritDoc
     */
    ZoomedVideoElement.prototype.zoomedIn = function () {
        var _this = this;
        var video = document.createElement('video');
        var source = document.createElement('source');
        video.appendChild(source);
        video.addEventListener('canplay', function () {
            _this.loaded(video.videoWidth, video.videoHeight);
            _this._video.play();
        });
        source.src = this._fullSrc;
    };
    /**
     * @inheritDoc
     */
    ZoomedVideoElement.prototype.zoomedOut = function () {
        if (this._video.getAttribute(Attributes_1.PLAY_VIDEO_KEY) === Attributes_1.ALWAYS_PLAY_VIDEO_VALUE) {
            this._video.play();
        }
    };
    /**
     * @inheritDoc
     */
    ZoomedVideoElement.prototype.width = function () {
        return this._video.width || this._video.videoWidth;
    };
    return ZoomedVideoElement;
}(ZoomedElement_1.ZoomedElement));
exports.ZoomedVideoElement = ZoomedVideoElement;

},{"../util/Attributes":6,"./ZoomedElement":2}],5:[function(require,module,exports){
"use strict";
var Zoom_1 = require('./Zoom');
new Zoom_1.Zoom().listen();

},{"./Zoom":1}],6:[function(require,module,exports){
"use strict";
/**
 * The attribute key used to indicate which zoom function (in or out) should occur once the element is clicked.
 */
exports.ZOOM_FUNCTION_KEY = 'data-zoom';
/**
 * An attribute value that indicates this element should zoom in when clicked.
 */
exports.ZOOM_IN_VALUE = 'zoom-in';
/**
 * An attribute value that indicates this element should be zoomed out when clicked.
 */
exports.ZOOM_OUT_VALUE = 'zoom-out';
/**
 * The attribute key used to indicate the src of the resource to load when this element is zoomed in.
 */
exports.FULL_SRC_KEY = 'data-zoom-src';
/**
 * The attribute key used to indicate whether a video should continue to play once zoomed out.
 */
exports.PLAY_VIDEO_KEY = 'data-zoom-play';
/**
 * An attribute value that indicates that this video should continue playing once zoomed out.
 */
exports.ALWAYS_PLAY_VIDEO_VALUE = 'always';

},{}],7:[function(require,module,exports){
"use strict";
/**
 * The class name of the overlay element.
 */
exports.OVERLAY_CLASS = 'zoom-overlay';
/**
 * The class named added to the body when the zoom overlay is open.
 */
exports.OVERLAY_OPEN_CLASS = 'zoom-overlay-open';
/**
 * The class named added to the body when the zoom overlay is loading.
 */
exports.OVERLAY_LOADING_CLASS = 'zoom-overlay-loading';
/**
 * The class named added to the body when the zoom overlay is transitioning.
 */
exports.OVERLAY_TRANSITIONING_CLASS = 'zoom-overlay-transitioning';
/**
 * The class name of the wrap element.
 */
exports.WRAP_CLASS = 'zoom-wrap';

},{}],8:[function(require,module,exports){
"use strict";
/**
 * Contains utility methods relating to calculation of {@link Dimensions}.
 */
var Dimensions = (function () {
    function Dimensions() {
    }
    /**
     * Calculates the number of pixels in the document have been scrolled past horizontally.
     * @returns {number} The number of pixels in the document have been scrolled past horizontally.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollX#Notes
     */
    Dimensions.scrollX = function () {
        if (window.pageXOffset === undefined) {
            return (document.documentElement || document.body).scrollLeft;
        }
        else {
            return window.pageXOffset;
        }
    };
    /**
     * Calculates the number of pixels in the document have been scrolled past vertically.
     * @returns {number} The number of pixels in the document have been scrolled past vertically.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollX#Notes
     */
    Dimensions.scrollY = function () {
        if (window.pageYOffset === undefined) {
            return (document.documentElement || document.body).scrollTop;
        }
        else {
            return window.pageYOffset;
        }
    };
    /**
     * Calculates the width (in pixels) of the browser window viewport.
     * @returns {number} The width (in pixels) of the browser window viewport.
     * @see https://stackoverflow.com/questions/9410088/how-do-i-get-innerwidth-in-internet-explorer-8/9410162#9410162
     */
    Dimensions.viewportWidth = function () {
        if (window.innerWidth === undefined) {
            return (document.documentElement || document.body).clientWidth;
        }
        else {
            return window.innerWidth;
        }
    };
    /**
     * Calculates the height (in pixels) of the browser window viewport.
     * @returns {number} The height (in pixels) of the browser window viewport.
     * @see https://stackoverflow.com/questions/9410088/how-do-i-get-innerwidth-in-internet-explorer-8/9410162#9410162
     */
    Dimensions.viewportHeight = function () {
        if (window.innerHeight === undefined) {
            return (document.documentElement || document.body).clientHeight;
        }
        else {
            return window.innerHeight;
        }
    };
    return Dimensions;
}());
exports.Dimensions = Dimensions;

},{}],9:[function(require,module,exports){
"use strict";
/**
 * Contains {@link Style} related utility methods.
 */
var Style = (function () {
    function Style() {
    }
    /**
     * Sets an elements transform style property.
     * @param element The element to style.
     * @param style The style to apply to the transform property.
     */
    Style.transform = function (element, style) {
        element.style.webkitTransform = style;
        element.style.transform = style;
    };
    return Style;
}());
exports.Style = Style;

},{}]},{},[5]);
