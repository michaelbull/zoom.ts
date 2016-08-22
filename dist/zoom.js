/*!
 * zoom.ts v2.1.1
 * https://michael-bull.com/projects/zoom.ts
 * 
 * Copyright (c) 2016 Michael Bull (https://michael-bull.com)
 * Copyright (c) 2013 @fat
 * @license MIT
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.zoom = global.zoom || {})));
}(this, (function (exports) { 'use strict';

function __extends(d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

/**
 * The class name of the {@link Overlay}'s {@link _element}.
 */
var CLASS = 'zoom-overlay';
/**
 * Represents an overlay that is appended to the document and creates a backdrop behind the zoomed element.
 */
var Overlay = (function () {
    /**
     * Creates a new {@link Overlay}.
     */
    function Overlay() {
        /**
         * The underlying element.
         */
        this._element = document.createElement('div');
        /**
         * The current state.
         */
        this._state = 'hidden';
        this._element.className = CLASS;
    }
    /**
     * Adds the {@link _element} to the document's body.
     */
    Overlay.prototype.add = function () {
        document.body.classList.add(CLASS + '-' + this._state);
        document.body.appendChild(this._element);
    };
    Object.defineProperty(Overlay.prototype, "state", {
        /**
         * Gets the current state.
         * @returns The current state.
         */
        get: function () {
            return this._state;
        },
        /**
         * Sets the current state.
         * @param state The state to set.
         */
        set: function (state) {
            document.body.classList.remove(CLASS + '-' + this._state);
            this._state = state;
            document.body.classList.add(CLASS + '-' + this._state);
        },
        enumerable: true,
        configurable: true
    });
    return Overlay;
}());

/**
 * The attribute key used to indicate which zoom function (in or out) should occur once the element is clicked.
 */
var ZOOM_FUNCTION_KEY = 'data-zoom';
/**
 * An attribute value that indicates this element should zoom in when clicked.
 */
var ZOOM_IN_VALUE = 'zoom-in';
/**
 * An attribute value that indicates this element should zoom out when clicked.
 */
var ZOOM_OUT_VALUE = 'zoom-out';
/**
 * The attribute key used to indicate the src of the resource to load when this element is zoomed in.
 */
var FULL_SRC_KEY = 'data-zoom-src';
/**
 * The attribute key used to indicate whether a video should continue to play once zoomed out.
 */
var PLAY_VIDEO_KEY = 'data-zoom-play';
/**
 * An attribute value that indicates that this video should continue playing once zoomed out.
 */
var ALWAYS_PLAY_VIDEO_VALUE = 'always';

/**
 * Contains utility methods for calculating {@link Dimensions}.
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

/**
 * The event types to listen for that trigger at the end of an element's transition.
 */
var transitionEndEvents = [
    'transitionend',
    'webkitTransitionEnd',
    'oTransitionEnd'
];
/**
 * Contains utility methods for HTMLElements.
 */
var ElementUtils = (function () {
    function ElementUtils() {
    }
    /**
     * Forces an element to repaint on the canvas.
     */
    ElementUtils.repaint = function (element) {
        /* tslint:disable */
        element.offsetWidth;
        /* tslint:enable */
    };
    /**
     * Sets an element's transform style property.
     * @param element The element.
     * @param style The style to apply to the transform property.
     */
    ElementUtils.transform = function (element, style) {
        element.style.webkitTransform = style;
        element.style.transform = style;
    };
    /**
     * Removes an element's transform style property.
     * @param element The element.
     */
    ElementUtils.removeTransform = function (element) {
        element.style.removeProperty('webkitTransform');
        element.style.removeProperty('transform');
    };
    /**
     * Adds an event listener that is called on the end of a transition.
     * @param element The element whose events should be listened to.
     * @param listener The listener to call once an event is received.
     */
    ElementUtils.addTransitionEndListener = function (element, listener) {
        if ('transition' in document.body.style) {
            for (var _i = 0, transitionEndEvents_1 = transitionEndEvents; _i < transitionEndEvents_1.length; _i++) {
                var event = transitionEndEvents_1[_i];
                console.log('add event listener to event: ' + event);
                element.addEventListener(event, listener);
            }
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
    ElementUtils.removeTransitionEndListener = function (element, listener) {
        for (var _i = 0, transitionEndEvents_2 = transitionEndEvents; _i < transitionEndEvents_2.length; _i++) {
            var event = transitionEndEvents_2[_i];
            element.removeEventListener(event, listener);
        }
    };
    /**
     * Calculates the required translation to place an element in the center of the viewport.
     * @param element The element.
     * @returns The calculated translation.
     */
    ElementUtils.translateToCenter = function (element) {
        var viewportWidth = Dimensions.viewportWidth();
        var viewportHeight = Dimensions.viewportHeight();
        var scrollX = Dimensions.scrollX();
        var scrollY = Dimensions.scrollY();
        var viewportX = viewportWidth / 2;
        var viewportY = scrollY + (viewportHeight / 2);
        var rect = element.getBoundingClientRect();
        var centerX = rect.left + scrollX + ((element.width || element.offsetWidth) / 2);
        var centerY = rect.top + scrollY + ((element.height || element.offsetHeight) / 2);
        var x = Math.round(viewportX - centerX);
        var y = Math.round(viewportY - centerY);
        return 'translate(' + x + 'px, ' + y + 'px) translateZ(0)';
    };
    /**
     * Calculates the required scale to fill the viewport with an element.
     * @param originalWidth The original width of the element.
     * @param width The width of the element.
     * @param height The height of the element.
     * @returns The calculated scale.
     */
    ElementUtils.scaleToViewport = function (originalWidth, width, height) {
        var viewportWidth = Dimensions.viewportWidth();
        var viewportHeight = Dimensions.viewportHeight();
        var viewportAspectRatio = viewportWidth / viewportHeight;
        var maxScaleFactor = width / originalWidth;
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
        return 'scale(' + scaleFactor + ')';
    };
    return ElementUtils;
}());

/**
 * Represents a {@link Zoomable} element that may be opened or closed.
 */
var ZoomedElement = (function () {
    /**
     * Creates a new {@link ZoomedElement}
     * @param element The underlying HTMLElement.
     * @param overlay The {@link Overlay}.
     */
    function ZoomedElement(element, overlay) {
        var _this = this;
        /**
         * An event lister that sets the {@link Overlay}'s {@link State} to open.
         */
        this.openedListener = function () {
            ElementUtils.removeTransitionEndListener(_this._element, _this.openedListener);
            _this._overlay.state = 'open';
        };
        /**
         * An event listener that sets the {@link Overlay}'s {@link State} to hidden and sets the {@link _element}'s
         * {@link ZOOM_FUNCTION_KEY} attribute to {@link ZOOM_IN_VALUE}.
         */
        this.closedListener = function () {
            ElementUtils.removeTransitionEndListener(_this._element, _this.closedListener);
            _this._overlay.state = 'hidden';
            _this._element.setAttribute(ZOOM_FUNCTION_KEY, ZOOM_IN_VALUE);
            _this.zoomedOut();
        };
        this._fullSrc = element.getAttribute(FULL_SRC_KEY) || element.currentSrc || element.src;
        this._element = element;
        this._overlay = overlay;
    }
    /**
     * Opens the zoomed view.
     */
    ZoomedElement.prototype.open = function () {
        this._overlay.state = 'loading';
        this.zoomedIn();
        this._element.src = this._fullSrc;
        ElementUtils.addTransitionEndListener(this._element, this.openedListener);
    };
    /**
     * Closes the zoomed view.
     */
    ZoomedElement.prototype.close = function () {
        this._overlay.state = 'closing';
        ElementUtils.removeTransform(this._element);
        ElementUtils.addTransitionEndListener(this._element, this.closedListener);
    };
    /**
     * Called once the {@link _fullSrc} of the {@link _element} is loaded.
     * @param width The width of the {@link _fullSrc} element.
     * @param height The height of the {@link _fullSrc} element.
     */
    ZoomedElement.prototype.loaded = function (width, height) {
        this._overlay.state = 'opening';
        this._element.setAttribute(ZOOM_FUNCTION_KEY, ZOOM_OUT_VALUE);
        var translation = ElementUtils.translateToCenter(this._element);
        var scale = ElementUtils.scaleToViewport(this.width(), width, height);
        ElementUtils.repaint(this._element);
        ElementUtils.transform(this._element, translation + ' ' + scale);
    };
    return ZoomedElement;
}());

/**
 * Represents a {@link ZoomedElement} whose underlying element is an HTMLImageElement.
 */
var ZoomedImageElement = (function (_super) {
    __extends(ZoomedImageElement, _super);
    /**
     * Creates a new {@link ZoomedImageElement}.
     * @param element The underlying image element.
     * @param overlay The {@link Overlay}.
     */
    function ZoomedImageElement(element, overlay) {
        _super.call(this, element, overlay);
        this._image = element;
    }
    ZoomedImageElement.prototype.zoomedIn = function () {
        var _this = this;
        var image = document.createElement('img');
        image.onload = function () {
            _this.loaded(image.width, image.height);
            _this._image.removeAttribute(FULL_SRC_KEY);
        };
        image.src = this._fullSrc;
    };
    ZoomedImageElement.prototype.zoomedOut = function () {
        /* empty */
    };
    ZoomedImageElement.prototype.width = function () {
        return this._image.width;
    };
    return ZoomedImageElement;
}(ZoomedElement));

/**
 * Represents a {@link ZoomedElement} whose underlying element is a HTMLVideoElement.
 */
var ZoomedVideoElement = (function (_super) {
    __extends(ZoomedVideoElement, _super);
    /**
     * Creates a new {@link ZoomedVideoElement}.
     * @param element The underlying video element.
     * @param overlay The {@link Overlay}.
     */
    function ZoomedVideoElement(element, overlay) {
        _super.call(this, element, overlay);
        this._video = element;
    }
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
    ZoomedVideoElement.prototype.zoomedOut = function () {
        if (this._video.getAttribute(PLAY_VIDEO_KEY) === ALWAYS_PLAY_VIDEO_VALUE) {
            this._video.play();
        }
    };
    ZoomedVideoElement.prototype.width = function () {
        return this._video.width || this._video.videoWidth;
    };
    return ZoomedVideoElement;
}(ZoomedElement));

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
 * Entry point to the library.
 */
var Zoom = (function () {
    function Zoom() {
        var _this = this;
        /**
         * The {@link Overlay}.
         */
        this._overlay = new Overlay();
        /**
         * An event listener that calls {@link close} if the difference between the {@link _initialScrollY} and
         * {@link Dimensions.scrollY} is more than {@link SCROLL_Y_DELTA}.
         */
        this.scrollListener = function () {
            if (Math.abs(_this._initialScrollY - Dimensions.scrollY()) > SCROLL_Y_DELTA) {
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
     * Listens for click events on {@link Zoomable} elements and adds the {@link _overlay} to the document.
     */
    Zoom.prototype.listen = function () {
        var _this = this;
        Zoom.ready(function () {
            document.body.addEventListener('click', function (event) {
                var target = event.target;
                var operation = target.getAttribute(ZOOM_FUNCTION_KEY);
                if (operation === ZOOM_IN_VALUE) {
                    _this.zoom(event);
                }
                else if (operation === ZOOM_OUT_VALUE) {
                    _this.close();
                }
            });
            _this._overlay.add();
        });
    };
    /**
     * Zooms in on an element.
     * @param event The click event that occurred when interacting with the element.
     */
    Zoom.prototype.zoom = function (event) {
        event.stopPropagation();
        if (this._overlay.state !== 'hidden') {
            return;
        }
        var target = event.target;
        if (event.metaKey || event.ctrlKey) {
            var url = target.getAttribute(FULL_SRC_KEY) || target.currentSrc || target.src;
            window.open(url, '_blank');
            return;
        }
        if (target.width >= window.innerWidth) {
            // target is already as big (or bigger), therefore we gain nothing from zooming in on it
            return;
        }
        if (target.tagName === 'IMG' || target.tagName === 'PICTURE') {
            this._current = new ZoomedImageElement(target, this._overlay);
        }
        else {
            this._current = new ZoomedVideoElement(target, this._overlay);
        }
        this._current.open();
        this.addCloseListeners();
        this._initialScrollY = Dimensions.scrollY();
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

Object.defineProperty(exports, '__esModule', { value: true });

})));