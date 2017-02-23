/*!
 * zoom.ts v5.0.0
 * https://www.michael-bull.com/projects/zoom.ts
 * 
 * Copyright (c) 2017 Michael Bull (https://www.michael-bull.com)
 * @license ISC
 */
!function(t){function e(i){if(n[i])return n[i].exports;var o=n[i]={i:i,l:!1,exports:{}};return t[i].call(o.exports,o,o.exports,e),o.l=!0,o.exports}var n={};return e.m=t,e.c=n,e.i=function(t){return t},e.d=function(t,n,i){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:i})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="dist/",e(e.s=12)}([function(t,e,n){"use strict";function i(t){"loading"===document.readyState?document.addEventListener("DOMContentLoaded",function(){t()}):t()}function o(){return(document.documentElement||document.body).clientWidth}function r(){return(document.documentElement||document.body).clientHeight}function s(){return void 0===window.pageYOffset?(document.documentElement||document.body).scrollTop:window.pageYOffset}e.ready=i,e.viewportWidth=o,e.viewportHeight=r,e.scrollY=s},function(t,e,n){"use strict";function i(t){t.offsetHeight}function o(t,e){return f?"translate3d("+t+"px, "+e+"px, 0)":"translate("+t+"px, "+e+"px)"}function r(t){var e=t.getBoundingClientRect();return new u.Dimension(e.left,e.top,t.clientWidth,t.clientHeight)}function s(t,e){if(h)for(var n=0,i=p;n<i.length;n++){var o=i[n];t.addEventListener(o,e)}else e(new Event(p[0]))}function a(t,e){for(var n=0,i=p;n<i.length;n++){var o=i[n];t.removeEventListener(o,e)}}function c(t){var e=t.parentElement;if(null!==e){var n=e.getAttribute("data-src");if(null!==n)return n}return t.src}function l(t,e){var n=Number(t.getAttribute("data-width")||1/0),i=Number(t.getAttribute("data-height")||1/0),o=Math.min(d.viewportWidth(),n)/e.width,r=Math.min(d.viewportHeight(),i)/e.height;return Math.min(o,r)}var u=n(5),d=n(0),h=n(9),f=n(10),p=["transitionend","webkitTransitionEnd","oTransitionEnd","MSTransitionEnd"];e.repaint=i,e.translate=o,e.dimensions=r,e.addTransitionEndListener=s,e.removeTransitionEndListener=a,e.srcAttribute=c,e.scaleToMaxViewport=l},function(t,e){for(var n,i=["webkitTransform","MozTransform","msTransform","OTransform","transform"],o=document.createElement("p"),r=0;r<i.length;r++)if(n=i[r],null!=o.style[n]){t.exports=n;break}},function(t,e,n){"use strict";function i(){var t=document.createElement("div");t.classList.add("zoom__overlay"),document.body.addEventListener("click",function(e){var n=e.target;if(n instanceof HTMLImageElement&&n.classList.contains("zoom__element"))if(e.preventDefault(),!s||e.metaKey||e.ctrlKey)window.open(o.srcAttribute(n),"_blank");else{var i=n.parentElement;if(null!==i&&i.classList.contains("zoom")){var a=o.dimensions(n),c=new r.Zoom(t,i,n,a);c.show()}}})}var o=n(1),r=n(6),s=n(2);e.addListeners=i},function(t,e,n){var i=n(7);"string"==typeof i&&(i=[[t.i,i,""]]);n(11)(i,{});i.locals&&(t.exports=i.locals)},function(t,e,n){"use strict";var i=function(){function t(t,e,n,i){this.left=t,this.top=e,this.width=n,this.height=i}return t}();e.Dimension=i},function(t,e,n){"use strict";var i=n(1),o=n(0),r=27,s=70,a=30,c=function(){function t(t,e,n,c){var l=this;this.transforming=!1,this.finishedExpandingContainer=function(){l.container.style.transition="initial",l.transforming=!1,l.zoom(),i.repaint(l.container),l.container.style.transition="",i.removeTransitionEndListener(l.container,l.finishedExpandingContainer)},this.resizeListener=function(){l.zoom()},this.scrollListener=function(){Math.abs(l.initialScrollY-o.scrollY())>s&&l.hide()},this.closeListener=function(){document.body.removeChild(l.overlay),l.element.style.opacity="1",l.container.removeChild(l.clone),l.container.classList.remove("zoom--active"),i.removeTransitionEndListener(l.container,l.closeListener)},this.clickListener=function(){l.hide()},this.keyboardListener=function(t){t.keyCode===r&&l.hide()},this.touchStartListener=function(t){l.initialTouchY=t.touches[0].pageY,t.target.addEventListener("touchmove",l.touchMoveListener)},this.touchMoveListener=function(t){Math.abs(t.touches[0].pageY-l.initialTouchY)>a&&l.hide()},this.overlay=t,this.container=e,this.element=n,this.original=c}return t.prototype.show=function(){this.showOverlay(),this.expandContainer(),this.addClone(),this.addEventListeners()},t.prototype.hide=function(){this.removeEventListeners(),this.hideOverlay(),this.collapseContainer()},t.prototype.zoom=function(){var t=i.scaleToMaxViewport(this.container,this.original),e=this.original.width*t,n=this.original.height*t,r=(o.viewportWidth()-e)/2,s=(o.viewportHeight()-n)/2,a=this.original.left+(this.original.width-e)/2,c=this.original.top+(this.original.height-n)/2;if(this.transforming){var l=(r-a)/t,u=(s-c)/t;this.container.style.transform="scale("+t+") "+i.translate(l,u)}else this.container.style.transform="",this.container.style.left=r-this.original.left+"px",this.container.style.top=s-this.original.top+"px",this.container.style.width=Math.round(e)+"px",this.container.style.maxWidth=Math.round(e)+"px",this.container.style.height=Math.round(n)+"px"},t.prototype.showOverlay=function(){document.body.appendChild(this.overlay),i.repaint(this.overlay),this.overlay.classList.add("zoom__overlay--visible")},t.prototype.hideOverlay=function(){this.overlay.classList.remove("zoom__overlay--visible"),i.removeTransitionEndListener(this.container,this.finishedExpandingContainer),i.addTransitionEndListener(this.container,this.closeListener)},t.prototype.expandContainer=function(){this.container.classList.add("zoom--active"),i.addTransitionEndListener(this.container,this.finishedExpandingContainer),this.transforming=!0,this.zoom()},t.prototype.collapseContainer=function(){this.container.style.transition="initial",this.transforming=!0,this.zoom(),i.repaint(this.container),this.container.style.transition="",this.container.style.transform="",this.container.style.left="",this.container.style.top="",this.container.style.width="",this.container.style.maxWidth="",this.container.style.height=""},t.prototype.addClone=function(){var t=this;this.clone=document.createElement("img"),this.clone.classList.add("zoom__clone"),this.clone.onload=function(){t.element.style.opacity="0",t.container.appendChild(t.clone)},this.clone.src=i.srcAttribute(this.element)},t.prototype.addEventListeners=function(){this.initialScrollY=o.scrollY(),window.addEventListener("resize",this.resizeListener),window.addEventListener("scroll",this.scrollListener),document.addEventListener("keyup",this.keyboardListener),document.addEventListener("touchstart",this.touchStartListener),this.clone.addEventListener("click",this.clickListener)},t.prototype.removeEventListeners=function(){window.removeEventListener("resize",this.resizeListener),window.removeEventListener("scroll",this.scrollListener),document.removeEventListener("keyup",this.keyboardListener),document.removeEventListener("touchstart",this.touchStartListener),document.removeEventListener("touchmove",this.touchMoveListener),this.clone.removeEventListener("click",this.clickListener)},t}();e.Zoom=c},function(t,e,n){e=t.exports=n(8)(),e.push([t.i,".zoom{position:relative;line-height:0;text-align:center;-webkit-transition:-webkit-transform .3s cubic-bezier(.2,0,.2,1);transition:-webkit-transform .3s cubic-bezier(.2,0,.2,1);transition:transform .3s cubic-bezier(.2,0,.2,1);transition:transform .3s cubic-bezier(.2,0,.2,1),-webkit-transform .3s cubic-bezier(.2,0,.2,1);will-change:transition}.zoom--active{z-index:2}.zoom__element{cursor:pointer;cursor:-moz-zoom-in;cursor:-webkit-zoom-in}.zoom__clone{position:absolute;cursor:pointer;cursor:-moz-zoom-out;cursor:-webkit-zoom-out}.zoom__clone,.zoom__overlay{top:0;right:0;bottom:0;left:0}.zoom__overlay{position:fixed;z-index:1;background:#fff;opacity:0;filter:'alpha(opacity=0)';-webkit-transition:opacity .3s;transition:opacity .3s;will-change:opacity,filter}.zoom__overlay--visible{opacity:1;filter:\"alpha(opacity=100)\"}",""])},function(t,e){t.exports=function(){var t=[];return t.toString=function(){for(var t=[],e=0;e<this.length;e++){var n=this[e];n[2]?t.push("@media "+n[2]+"{"+n[1]+"}"):t.push(n[1])}return t.join("")},t.i=function(e,n){"string"==typeof e&&(e=[[null,e,""]]);for(var i={},o=0;o<this.length;o++){var r=this[o][0];"number"==typeof r&&(i[r]=!0)}for(o=0;o<e.length;o++){var s=e[o];"number"==typeof s[0]&&i[s[0]]||(n&&!s[2]?s[2]=n:n&&(s[2]="("+s[2]+") and ("+n+")"),t.push(s))}},t}},function(t,e){function n(t){if(!i)return!1;if(!t)return null!=i;var e=getComputedStyle(t)[i];return""!==e&&0!==parseFloat(e)}for(var i,o=["transitionDuration","MozTransitionDuration","webkitTransitionDuration"];o.length;){var r=o.shift();r in document.body.style&&(i=r)}t.exports=n},function(t,e,n){var i=n(2);if(i&&window.getComputedStyle){var o={webkitTransform:"-webkit-transform",OTransform:"-o-transform",msTransform:"-ms-transform",MozTransform:"-moz-transform",transform:"transform"},r=document.createElement("div");r.style[i]="translate3d(1px,1px,1px)",document.body.insertBefore(r,null);var s=getComputedStyle(r).getPropertyValue(o[i]);document.body.removeChild(r),t.exports=null!=s&&s.length&&"none"!=s}else t.exports=!1},function(t,e){function n(t,e){for(var n=0;n<t.length;n++){var i=t[n],o=h[i.id];if(o){o.refs++;for(var r=0;r<o.parts.length;r++)o.parts[r](i.parts[r]);for(;r<i.parts.length;r++)o.parts.push(c(i.parts[r],e))}else{for(var s=[],r=0;r<i.parts.length;r++)s.push(c(i.parts[r],e));h[i.id]={id:i.id,refs:1,parts:s}}}}function i(t){for(var e=[],n={},i=0;i<t.length;i++){var o=t[i],r=o[0],s=o[1],a=o[2],c=o[3],l={css:s,media:a,sourceMap:c};n[r]?n[r].parts.push(l):e.push(n[r]={id:r,parts:[l]})}return e}function o(t,e){var n=m(),i=g[g.length-1];if("top"===t.insertAt)i?i.nextSibling?n.insertBefore(e,i.nextSibling):n.appendChild(e):n.insertBefore(e,n.firstChild),g.push(e);else{if("bottom"!==t.insertAt)throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");n.appendChild(e)}}function r(t){t.parentNode.removeChild(t);var e=g.indexOf(t);e>=0&&g.splice(e,1)}function s(t){var e=document.createElement("style");return e.type="text/css",o(t,e),e}function a(t){var e=document.createElement("link");return e.rel="stylesheet",o(t,e),e}function c(t,e){var n,i,o;if(e.singleton){var c=y++;n=v||(v=s(e)),i=l.bind(null,n,c,!1),o=l.bind(null,n,c,!0)}else t.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(n=a(e),i=d.bind(null,n),o=function(){r(n),n.href&&URL.revokeObjectURL(n.href)}):(n=s(e),i=u.bind(null,n),o=function(){r(n)});return i(t),function(e){if(e){if(e.css===t.css&&e.media===t.media&&e.sourceMap===t.sourceMap)return;i(t=e)}else o()}}function l(t,e,n,i){var o=n?"":i.css;if(t.styleSheet)t.styleSheet.cssText=b(e,o);else{var r=document.createTextNode(o),s=t.childNodes;s[e]&&t.removeChild(s[e]),s.length?t.insertBefore(r,s[e]):t.appendChild(r)}}function u(t,e){var n=e.css,i=e.media;if(i&&t.setAttribute("media",i),t.styleSheet)t.styleSheet.cssText=n;else{for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(n))}}function d(t,e){var n=e.css,i=e.sourceMap;i&&(n+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(i))))+" */");var o=new Blob([n],{type:"text/css"}),r=t.href;t.href=URL.createObjectURL(o),r&&URL.revokeObjectURL(r)}var h={},f=function(t){var e;return function(){return"undefined"==typeof e&&(e=t.apply(this,arguments)),e}},p=f(function(){return/msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase())}),m=f(function(){return document.head||document.getElementsByTagName("head")[0]}),v=null,y=0,g=[];t.exports=function(t,e){if("undefined"!=typeof DEBUG&&DEBUG&&"object"!=typeof document)throw new Error("The style-loader cannot be used in a non-browser environment");e=e||{},"undefined"==typeof e.singleton&&(e.singleton=p()),"undefined"==typeof e.insertAt&&(e.insertAt="bottom");var o=i(t);return n(o,e),function(t){for(var r=[],s=0;s<o.length;s++){var a=o[s],c=h[a.id];c.refs--,r.push(c)}if(t){var l=i(t);n(l,e)}for(var s=0;s<r.length;s++){var c=r[s];if(0===c.refs){for(var u=0;u<c.parts.length;u++)c.parts[u]();delete h[c.id]}}}};var b=function(){var t=[];return function(e,n){return t[e]=n,t.filter(Boolean).join("\n")}}()},function(t,e,n){"use strict";n(4);var i=n(0),o=n(3);i.ready(function(){o.addListeners()})}]);