(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var ZoomedImageElement_1 = require('./element/ZoomedImageElement');
var ZoomedVideoElement_1 = require('./element/ZoomedVideoElement');
var Attributes_1 = require('./util/Attributes');
var Classes_1 = require('./util/Classes');
var Dimensions_1 = require('./util/Dimensions');
var ESCAPE_KEY_CODE = 27;
/* pixels required to scroll vertically with a mouse/keyboard for a zoomed image to be dismissed */
var SCROLL_Y_DELTA = 70;
/* pixels required to scroll vertically with a touch screen for a zoomed image to be dismissed  */
var TOUCH_Y_DELTA = 30;
var overlay = document.createElement('div');
overlay.className = Classes_1.OVERLAY_CLASS;
var ZoomListener = (function () {
    function ZoomListener() {
        var _this = this;
        this.scrollListener = function () {
            if (Math.abs(_this._initialScrollY - Dimensions_1.Dimensions.scrollY()) >= SCROLL_Y_DELTA) {
                _this.close();
            }
        };
        this.keyboardListener = function (event) {
            if (event.keyCode === ESCAPE_KEY_CODE) {
                _this.close();
            }
        };
        this.touchStartListener = function (event) {
            _this._initialTouchY = event.touches[0].pageY;
            event.target.addEventListener('touchmove', _this.touchMoveListener);
        };
        this.touchMoveListener = function (event) {
            if (Math.abs(event.touches[0].pageY - _this._initialTouchY) > TOUCH_Y_DELTA) {
                _this.close();
                event.target.removeEventListener('touchmove', _this.touchMoveListener);
            }
        };
    }
    /*!
     * http://youmightnotneedjquery.com/#ready
     */
    ZoomListener.ready = function (fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function () {
                fn();
            });
        }
        else {
            fn();
        }
    };
    ZoomListener.prototype.listen = function () {
        var _this = this;
        ZoomListener.ready(function () {
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
    ZoomListener.prototype.zoom = function (event) {
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
    ZoomListener.prototype.close = function () {
        if (this._current) {
            this._current.close();
            this.removeCloseListeners();
            this._current = undefined;
        }
    };
    ZoomListener.prototype.addCloseListeners = function () {
        window.addEventListener('scroll', this.scrollListener);
        document.addEventListener('keyup', this.keyboardListener);
        document.addEventListener('touchstart', this.touchStartListener);
    };
    ZoomListener.prototype.removeCloseListeners = function () {
        window.removeEventListener('scroll', this.scrollListener);
        document.removeEventListener('keyup', this.keyboardListener);
        document.removeEventListener('touchstart', this.touchStartListener);
    };
    return ZoomListener;
}());
exports.ZoomListener = ZoomListener;

},{"./element/ZoomedImageElement":3,"./element/ZoomedVideoElement":4,"./util/Attributes":6,"./util/Classes":7,"./util/Dimensions":8}],2:[function(require,module,exports){
"use strict";
var Attributes_1 = require('../util/Attributes');
var Classes_1 = require('../util/Classes');
var Dimensions_1 = require('../util/Dimensions');
var wrap = document.createElement('div');
wrap.className = Classes_1.WRAP_CLASS;
var ZoomedElement = (function () {
    function ZoomedElement(element) {
        var _this = this;
        this.openedListener = function () {
            _this.opened();
        };
        this.closedListener = function () {
            _this.closed();
        };
        this._fullSrc = element.getAttribute(Attributes_1.FULL_SRC_KEY) || element.currentSrc || element.src;
        this._element = element;
    }
    ZoomedElement.transformStyle = function (element, style) {
        element.style.webkitTransform = style;
        element.style.transform = style;
    };
    ZoomedElement.addTransitionEndListener = function (element, listener) {
        if ('transition' in document.body.style) {
            element.addEventListener('transitionend', listener);
            element.addEventListener('webkitTransitionEnd', listener);
        }
        else {
            listener(undefined);
        }
    };
    ZoomedElement.removeTransitionEndListener = function (element, listener) {
        element.removeEventListener('transitionend', listener);
        element.removeEventListener('webkitTransitionEnd', listener);
    };
    ZoomedElement.prototype.open = function () {
        document.body.classList.add(Classes_1.OVERLAY_LOADING_CLASS);
        this.zoomedIn();
        this._element.src = this._fullSrc;
        ZoomedElement.addTransitionEndListener(this._element, this.openedListener);
    };
    ZoomedElement.prototype.close = function () {
        var bodyClassList = document.body.classList;
        bodyClassList.remove(Classes_1.OVERLAY_OPEN_CLASS);
        bodyClassList.add(Classes_1.OVERLAY_TRANSITIONING_CLASS);
        ZoomedElement.transformStyle(this._element, '');
        ZoomedElement.transformStyle(wrap, '');
        ZoomedElement.addTransitionEndListener(this._element, this.closedListener);
    };
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
    ZoomedElement.prototype.repaint = function () {
        /* tslint:disable */
        this._element.offsetWidth;
        /* tslint:enable */
    };
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
        ZoomedElement.transformStyle(this._element, 'scale(' + scaleFactor + ')');
    };
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
        ZoomedElement.transformStyle(wrap, 'translate(' + x + 'px, ' + y + 'px) translateZ(0)');
    };
    ZoomedElement.prototype.opened = function () {
        ZoomedElement.removeTransitionEndListener(this._element, this.openedListener);
        document.body.classList.remove(Classes_1.OVERLAY_TRANSITIONING_CLASS);
    };
    ZoomedElement.prototype.closed = function () {
        ZoomedElement.removeTransitionEndListener(this._element, this.closedListener);
        if (wrap.parentNode) {
            this._element.setAttribute(Attributes_1.ZOOM_FUNCTION_KEY, Attributes_1.ZOOM_IN_VALUE);
            wrap.parentNode.replaceChild(this._element, wrap);
            document.body.classList.remove(Classes_1.OVERLAY_TRANSITIONING_CLASS);
            this.disposed();
        }
    };
    return ZoomedElement;
}());
exports.ZoomedElement = ZoomedElement;

},{"../util/Attributes":6,"../util/Classes":7,"../util/Dimensions":8}],3:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Attributes_1 = require('../util/Attributes');
var ZoomedElement_1 = require('./ZoomedElement');
var ZoomedImageElement = (function (_super) {
    __extends(ZoomedImageElement, _super);
    function ZoomedImageElement(element) {
        _super.call(this, element);
        this._image = element;
    }
    ZoomedImageElement.prototype.zoomedIn = function () {
        var _this = this;
        var image = document.createElement('img');
        image.onload = function () {
            _this.loaded(image.width, image.height);
            _this._image.removeAttribute(Attributes_1.FULL_SRC_KEY);
        };
        image.src = this._fullSrc;
    };
    ZoomedImageElement.prototype.disposed = function () {
        /* empty */
    };
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
var ZoomedVideoElement = (function (_super) {
    __extends(ZoomedVideoElement, _super);
    function ZoomedVideoElement(element) {
        _super.call(this, element);
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
    ZoomedVideoElement.prototype.disposed = function () {
        if (this._video.getAttribute(Attributes_1.PLAY_VIDEO_KEY) === Attributes_1.ALWAYS_PLAY_VIDEO_VALUE) {
            this._video.play();
        }
    };
    ZoomedVideoElement.prototype.width = function () {
        return this._video.width || this._video.videoWidth;
    };
    return ZoomedVideoElement;
}(ZoomedElement_1.ZoomedElement));
exports.ZoomedVideoElement = ZoomedVideoElement;

},{"../util/Attributes":6,"./ZoomedElement":2}],5:[function(require,module,exports){
"use strict";
var ZoomListener_1 = require('./ZoomListener');
new ZoomListener_1.ZoomListener().listen();

},{"./ZoomListener":1}],6:[function(require,module,exports){
"use strict";
exports.ZOOM_FUNCTION_KEY = 'data-zoom';
exports.ZOOM_IN_VALUE = 'zoom-in';
exports.ZOOM_OUT_VALUE = 'zoom-out';
/* the media in data-zoom-src="value" is loaded and displayed when the image is zoomed in */
exports.FULL_SRC_KEY = 'data-zoom-src';
/* when data-zoom-play="always" then the video will continue playing even after dismissed from zoom */
exports.PLAY_VIDEO_KEY = 'data-zoom-play';
exports.ALWAYS_PLAY_VIDEO_VALUE = 'always';

},{}],7:[function(require,module,exports){
"use strict";
exports.OVERLAY_CLASS = 'zoom-overlay';
exports.OVERLAY_OPEN_CLASS = 'zoom-overlay-open';
exports.OVERLAY_LOADING_CLASS = 'zoom-overlay-loading';
exports.OVERLAY_TRANSITIONING_CLASS = 'zoom-overlay-transitioning';
exports.WRAP_CLASS = 'zoom-wrap';

},{}],8:[function(require,module,exports){
"use strict";
var Dimensions = (function () {
    function Dimensions() {
    }
    /* http://help.dottoro.com/ljnvjiow.php */
    Dimensions.scrollX = function () {
        return window.pageXOffset || document.body.scrollLeft || 0;
    };
    Dimensions.scrollY = function () {
        return window.pageYOffset || document.body.scrollTop || 0;
    };
    /* http://stackoverflow.com/a/9410162 */
    Dimensions.viewportWidth = function () {
        return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth || 0;
    };
    Dimensions.viewportHeight = function () {
        return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0;
    };
    return Dimensions;
}());
exports.Dimensions = Dimensions;

},{}]},{},[5]);
