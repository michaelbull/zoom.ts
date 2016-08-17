(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
exports.ZOOM_FUNCTION_KEY = 'data-zoom';
exports.ZOOM_IN_VALUE = 'zoom-in';
exports.ZOOM_OUT_VALUE = 'zoom-out';
exports.POSITION_MEMO_KEY = 'data-zoom-offset-key';
/* the media in data-zoom-src="value" is loaded and displayed when the image is zoomed in */
exports.FULL_SRC_KEY = 'data-zoom-src';
/* when data-zoom-play="always" then the video will continue playing even after dismissed from zoom */
exports.PLAY_VIDEO_KEY = 'data-zoom-play';
exports.ALWAYS_PLAY_VIDEO_VALUE = 'always';

},{}],2:[function(require,module,exports){
"use strict";
exports.OVERLAY_CLASS = 'zoom-overlay';
exports.OVERLAY_OPEN_CLASS = 'zoom-overlay-open';
exports.OVERLAY_TRANSITIONING_CLASS = 'zoom-overlay-transitioning';
exports.WRAP_CLASS = 'zoom-wrap';

},{}],3:[function(require,module,exports){
"use strict";
var Attributes_1 = require('./Attributes');
var Position = (function () {
    function Position(top, left) {
        this._top = top;
        this._left = left;
    }
    /*!
     * http://www.quirksmode.org/js/findpos.html
     */
    Position.of = function (element) {
        if (!element.offsetParent) {
            return Position.origin;
        }
        var key = element.getAttribute(Attributes_1.POSITION_MEMO_KEY);
        if (key) {
            return Position.cache[key];
        }
        do {
            key = String(Math.random());
        } while (Position.cache[key]);
        element.setAttribute(Attributes_1.POSITION_MEMO_KEY, key);
        Position.cache[key] = new Position(0, 0);
        var parent = element;
        do {
            var position = Position.cache[key];
            position._top += parent.offsetTop;
            position._left += parent.offsetLeft;
            parent = parent.offsetParent;
        } while (parent);
        return Position.cache[key];
    };
    Position.origin = new Position(0, 0);
    Position.cache = {};
    return Position;
}());
exports.Position = Position;

},{"./Attributes":1}],4:[function(require,module,exports){
"use strict";
var Attributes_1 = require('./Attributes');
var Classes_1 = require('./Classes');
var ZoomedImageElement_1 = require('./ZoomedImageElement');
var ZoomedVideoElement_1 = require('./ZoomedVideoElement');
var ESCAPE_KEY_CODE = 27;
/* pixels required to scroll vertically with a mouse/keyboard for a zoomed image to be dismissed */
var SCROLL_Y_DELTA = 70;
/* pixels required to scroll vertically with a touch screen for a zoomed image to be dismissed  */
var TOUCH_Y_DELTA = 30;
var ZoomListener = (function () {
    function ZoomListener() {
        var _this = this;
        this.scrollListener = function () {
            if (Math.abs(_this._initialScrollPosition - window.scrollY) >= SCROLL_Y_DELTA) {
                _this.close();
            }
        };
        this.keyboardListener = function (event) {
            if (event.keyCode === ESCAPE_KEY_CODE) {
                _this.close();
            }
        };
        this.touchStartListener = function (event) {
            _this._initialTouchPosition = event.touches[0].pageY;
            event.target.addEventListener('touchmove', _this.touchMoveListener);
        };
        this.touchMoveListener = function (event) {
            if (Math.abs(event.touches[0].pageY - _this._initialTouchPosition) > TOUCH_Y_DELTA) {
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
            var overlay = document.createElement('div');
            overlay.className = Classes_1.OVERLAY_CLASS;
            document.body.appendChild(overlay);
        });
    };
    ZoomListener.prototype.zoom = function (event) {
        event.stopPropagation();
        if (document.body.classList.contains(Classes_1.OVERLAY_OPEN_CLASS)) {
            return;
        }
        var target = event.target;
        if (event.metaKey || event.ctrlKey) {
            var url = target.getAttribute(Attributes_1.FULL_SRC_KEY) || target.currentSrc || target.src;
            window.open(url, '_blank');
            return;
        }
        if (target.width >= window.innerWidth) {
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
        this._initialScrollPosition = window.scrollY;
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

},{"./Attributes":1,"./Classes":2,"./ZoomedImageElement":6,"./ZoomedVideoElement":7}],5:[function(require,module,exports){
"use strict";
var Attributes_1 = require('./Attributes');
var Classes_1 = require('./Classes');
var Position_1 = require('./Position');
var ZoomedElement = (function () {
    function ZoomedElement(element) {
        var _this = this;
        this.openedListener = function () {
            _this.opened();
        };
        this.closedListener = function () {
            _this.closed();
        };
        this._element = element;
        this._fullSrc = element.getAttribute(Attributes_1.FULL_SRC_KEY) || element.currentSrc || element.src;
    }
    ZoomedElement.transformStyle = function (element, style) {
        element.style.webkitTransform = style;
        element.style.transform = style;
    };
    ZoomedElement.prototype.open = function () {
        document.body.classList.add(Classes_1.OVERLAY_TRANSITIONING_CLASS);
        document.body.classList.add(Classes_1.OVERLAY_OPEN_CLASS);
        this.zoomedIn();
        this._element.src = this._fullSrc;
        if ('transition' in document.body.style) {
            var element = this._element;
            element.addEventListener('transitionend', this.openedListener);
            element.addEventListener('webkitTransitionEnd', this.openedListener);
        }
        else {
            this.opened();
        }
    };
    ZoomedElement.prototype.close = function () {
        document.body.classList.remove(Classes_1.OVERLAY_OPEN_CLASS);
        document.body.classList.add(Classes_1.OVERLAY_TRANSITIONING_CLASS);
        ZoomedElement.transformStyle(this._element, '');
        ZoomedElement.transformStyle(this._wrap, '');
        if ('transition' in document.body.style) {
            var element = this._element;
            element.addEventListener('transitionend', this.closedListener);
            element.addEventListener('webkitTransitionEnd', this.closedListener);
        }
        else {
            this.closed();
        }
    };
    ZoomedElement.prototype.zoomOriginal = function (width, height) {
        this._wrap = document.createElement('div');
        this._wrap.className = Classes_1.WRAP_CLASS;
        this._element.parentNode.insertBefore(this._wrap, this._element);
        this._wrap.appendChild(this._element);
        this._element.setAttribute(Attributes_1.ZOOM_FUNCTION_KEY, Attributes_1.ZOOM_OUT_VALUE);
        this.scale(width, height);
        this.translate();
    };
    ZoomedElement.prototype.repaint = function () {
        /* tslint:disable */
        this._element.offsetWidth;
        /* tslint:enable */
    };
    ZoomedElement.prototype.scale = function (width, height) {
        this.repaint();
        var maxFactor = width / this.width();
        var aspectRatio = width / height;
        var viewportWidth = window.innerWidth;
        var viewportHeight = window.innerHeight;
        var viewportAspectRatio = viewportWidth / viewportHeight;
        var factor;
        if (width < viewportWidth && height < viewportHeight) {
            factor = maxFactor;
        }
        else if (aspectRatio < viewportAspectRatio) {
            factor = (viewportHeight / height) * maxFactor;
        }
        else {
            factor = (viewportWidth / width) * maxFactor;
        }
        ZoomedElement.transformStyle(this._element, 'scale(' + factor + ')');
    };
    ZoomedElement.prototype.translate = function () {
        this.repaint();
        var viewportX = window.innerWidth / 2;
        var viewportY = window.scrollY + (window.innerHeight / 2);
        var position = Position_1.Position.of(this._element);
        var mediaCenterX = position._left + ((this._element.width || this._element.offsetWidth) / 2);
        var mediaCenterY = position._top + ((this._element.height || this._element.offsetHeight) / 2);
        var x = Math.round(viewportX - mediaCenterX);
        var y = Math.round(viewportY - mediaCenterY);
        ZoomedElement.transformStyle(this._wrap, 'translate(' + x + 'px, ' + y + 'px) translateZ(0)');
    };
    ZoomedElement.prototype.opened = function () {
        this._element.removeEventListener('transitionend', this.openedListener);
        this._element.removeEventListener('webkitTransitionEnd', this.openedListener);
        document.body.classList.remove(Classes_1.OVERLAY_TRANSITIONING_CLASS);
    };
    ZoomedElement.prototype.closed = function () {
        this._element.removeEventListener('transitionend', this.closedListener);
        this._element.removeEventListener('webkitTransitionEnd', this.closedListener);
        if (this._wrap && this._wrap.parentNode) {
            this._element.setAttribute(Attributes_1.ZOOM_FUNCTION_KEY, Attributes_1.ZOOM_IN_VALUE);
            this._wrap.parentNode.replaceChild(this._element, this._wrap);
            document.body.classList.remove(Classes_1.OVERLAY_TRANSITIONING_CLASS);
            this.disposed();
        }
    };
    return ZoomedElement;
}());
exports.ZoomedElement = ZoomedElement;

},{"./Attributes":1,"./Classes":2,"./Position":3}],6:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Attributes_1 = require('./Attributes');
var ZoomedElement_1 = require('./ZoomedElement');
var ZoomedImageElement = (function (_super) {
    __extends(ZoomedImageElement, _super);
    function ZoomedImageElement() {
        _super.apply(this, arguments);
    }
    ZoomedImageElement.prototype.zoomedIn = function () {
        var _this = this;
        var image = document.createElement('img');
        image.onload = function () {
            _this.zoomOriginal(image.width, image.height);
            _this._element.removeAttribute(Attributes_1.FULL_SRC_KEY);
        };
        image.src = this._fullSrc;
    };
    ZoomedImageElement.prototype.disposed = function () {
        /* empty */
    };
    ZoomedImageElement.prototype.width = function () {
        return this._element.width;
    };
    return ZoomedImageElement;
}(ZoomedElement_1.ZoomedElement));
exports.ZoomedImageElement = ZoomedImageElement;

},{"./Attributes":1,"./ZoomedElement":5}],7:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Attributes_1 = require('./Attributes');
var ZoomedElement_1 = require('./ZoomedElement');
var ZoomedVideoElement = (function (_super) {
    __extends(ZoomedVideoElement, _super);
    function ZoomedVideoElement() {
        _super.apply(this, arguments);
    }
    ZoomedVideoElement.prototype.zoomedIn = function () {
        var _this = this;
        var video = document.createElement('video');
        var source = document.createElement('source');
        video.appendChild(source);
        video.addEventListener('canplay', function () {
            _this.zoomOriginal(video.videoWidth, video.videoHeight);
            _this._element.play();
        });
        source.src = this._fullSrc;
    };
    ZoomedVideoElement.prototype.disposed = function () {
        var video = this._element;
        if (this._element.getAttribute(Attributes_1.PLAY_VIDEO_KEY) === Attributes_1.ALWAYS_PLAY_VIDEO_VALUE) {
            video.play();
        }
    };
    ZoomedVideoElement.prototype.width = function () {
        return this._element.width || this._element.videoWidth;
    };
    return ZoomedVideoElement;
}(ZoomedElement_1.ZoomedElement));
exports.ZoomedVideoElement = ZoomedVideoElement;

},{"./Attributes":1,"./ZoomedElement":5}],8:[function(require,module,exports){
"use strict";
var ZoomListener_1 = require('./ZoomListener');
new ZoomListener_1.ZoomListener().listen();

},{"./ZoomListener":4}]},{},[8]);
