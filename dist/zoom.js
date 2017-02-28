/*!
 * zoom.ts v7.1.0
 * https://www.michael-bull.com/projects/zoom.ts
 * 
 * Copyright (c) 2017 Michael Bull (https://www.michael-bull.com)
 * @license ISC
 */
!function(t){function e(i){if(n[i])return n[i].exports;var o=n[i]={i:i,l:!1,exports:{}};return t[i].call(o.exports,o,o.exports,e),o.l=!0,o.exports}var n={};return e.m=t,e.c=n,e.i=function(t){return t},e.d=function(t,n,i){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:i})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="dist/",e(e.s=12)}([function(t,e,n){"use strict";function i(t){"loading"===document.readyState?document.addEventListener("DOMContentLoaded",function(){return t()}):t()}function o(){return(document.documentElement||document.body).clientWidth}function r(){return(document.documentElement||document.body).clientHeight}function s(){return void 0===window.pageYOffset?(document.documentElement||document.body).scrollTop:window.pageYOffset}Object.defineProperty(e,"__esModule",{value:!0}),e.ready=i,e.viewportWidth=o,e.viewportHeight=r,e.scrollY=s},function(t,e){var n,i,o=["webkitTransform","MozTransform","msTransform","OTransform","transform"],r=document.createElement("p");for(i=0;i<o.length;i++)if(n=o[i],null!=r.style[n]){t.exports=n;break}},function(t,e,n){"use strict";function i(t){A=t.cloneNode(!0),R=k.createDiv("zoom__container"),R.appendChild(A),U.replaceChild(R,t)}function o(t,e){N=!0,A=e,R=t,D=R.children.item(1)}function r(){a(),h(),y(),w(),l()}function s(){N=!1,u(),_(),g(),p(),c()}function a(){U.style.height=A.height+"px"}function c(){U.style.height=""}function l(){P=T.scrollY(),M.add(window,"resize",W),M.add(window,"scroll",Y),M.add(document,"keyup",I),M.add(R,"click",G)}function u(){M.remove(window,"resize",W),M.remove(window,"scroll",Y),M.remove(document,"keyup",I),M.remove(R,"click",G)}function d(t){D=k.createClone(t),M.add(D,"load",K),R.appendChild(D)}function f(){A.classList.add("zoom__element--hidden"),D.classList.add("zoom__clone--visible")}function p(){A.classList.remove("zoom__element--hidden"),D.classList.remove("zoom__clone--visible")}function m(){R.style.transition="initial",v(),k.repaint(R),R.style.transition=""}function v(){var t,e,n,i,o=k.fillViewportScale(U,H),r=H.width*o,s=H.height*o,a=(T.viewportWidth()-r)/2,c=(T.viewportHeight()-s)/2,l=R.style;"expanding"===B||"collapsing"===B?(t=H.left+(H.width-r)/2,e=H.top+(H.height-s)/2,n=(a-t)/o,i=(c-e)/o,l[C]="scale("+o+") "+k.translate(n,i)):(l[C]="",l.left=a-H.left+"px",l.top=c-H.top+"px",l.width=r+"px",l.maxWidth=r+"px",l.height=s+"px")}function h(){document.body.appendChild(S)}function b(){document.body.removeChild(S)}function y(){k.repaint(S),S.classList.add("zoom__overlay--visible")}function g(){S.classList.remove("zoom__overlay--visible"),k.removeTransitionEndListener(R,F)}function w(){B="expanding",H=k.dimensions(A),x(),k.addTransitionEndListener(R,F),v()}function _(){B="collapsing",k.addTransitionEndListener(R,J),m();var t=R.style;t[C]="",t.left="",t.top="",t.width="",t.maxWidth="",t.height=""}function x(){U.classList.add("zoom--active"),A.classList.add("zoom__element--active")}function z(){U.classList.remove("zoom--active"),A.classList.remove("zoom__element--active")}function L(){M.add(document.body,"click",V)}function E(){M.remove(document.body,"click",V)}var k,T,C,M,O,j,S,U,R,A,D,B,N,P,H,W,Y,I,V,G,K,F,J;Object.defineProperty(e,"__esModule",{value:!0}),k=n(5),T=n(0),C=n(1),M=n(8),O=27,j=50,S=k.createDiv("zoom__overlay"),B="collapsed",N=!1,W=function(){v()},Y=function(){Math.abs(P-T.scrollY())>j&&s()},I=function(t){t.keyCode===O&&s()},V=function(t){var e,n,s,a,c,l=t.target;if(l instanceof HTMLImageElement&&l.classList.contains("zoom__element")){if(e=l.parentElement,null===e)return;if(n=e.parentElement,null===n)return;if(t.preventDefault(),s=e.classList.contains("zoom__container"),a=s?n:e,a.classList.contains("zoom--active"))return;if(c=k.srcAttribute(a,l),void 0===C||t.metaKey||t.ctrlKey)return void window.open(c,"_blank");U=a,s?o(e,l):(i(l),d(c)),r()}},G=function(){s()},K=function(){M.remove(D,"load",K),N=!0,"expanded"===B&&f()},F=function(){B="expanded",k.removeTransitionEndListener(R,F),m(),N&&f()},J=function(){k.removeTransitionEndListener(R,J),b(),z()},e.start=L,e.stop=E},function(t,e,n){var i,o=n(6);"string"==typeof o&&(o=[[t.i,o,""]]),i=n(11)(o,{}),o.locals&&(t.exports=o.locals)},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=function(){function t(t,e,n,i){this.left=t,this.top=e,this.width=n,this.height=i}return t}();e.Dimension=i},function(t,e,n){"use strict";function i(t){t.offsetHeight}function o(t,e){var i=n(10);return i?"translate3d("+t+"px, "+e+"px, 0)":"translate("+t+"px, "+e+"px)"}function r(t){var e=t.getBoundingClientRect();return new f.Dimension(e.left,e.top,t.clientWidth,t.clientHeight)}function s(t,e){var i,o,r,s=n(9);if(s)for(i=0,o=m;i<o.length;i++)r=o[i],t.addEventListener(r,e);else e(new Event(m[0]))}function a(t,e){var n,i,o;for(n=0,i=m;n<i.length;n++)o=i[n],t.removeEventListener(o,e)}function c(t){var e=document.createElement("div");return e.className=t,e}function l(t){var e=document.createElement("img");return e.className="zoom__clone",e.src=t,e}function u(t,e){var n=t.getAttribute("data-src");return null!==n?n:e.src}function d(t,e){var n=+(t.getAttribute("data-width")||1/0),i=+(t.getAttribute("data-height")||1/0),o=Math.min(p.viewportWidth(),n)/e.width,r=Math.min(p.viewportHeight(),i)/e.height;return Math.min(o,r)}var f,p,m;Object.defineProperty(e,"__esModule",{value:!0}),f=n(4),p=n(0),m=["transitionend","webkitTransitionEnd","oTransitionEnd","MSTransitionEnd"],e.repaint=i,e.translate=o,e.dimensions=r,e.addTransitionEndListener=s,e.removeTransitionEndListener=a,e.createDiv=c,e.createClone=l,e.srcAttribute=u,e.fillViewportScale=d},function(t,e,n){e=t.exports=n(7)(),e.push([t.i,'.zoom{display:block;position:relative;width:100%;line-height:0;text-align:center}.zoom--active{z-index:2}.zoom__container{position:relative;-webkit-transition:-webkit-transform .3s cubic-bezier(.2,0,.2,1);transition:-webkit-transform .3s cubic-bezier(.2,0,.2,1);transition:transform .3s cubic-bezier(.2,0,.2,1);transition:transform .3s cubic-bezier(.2,0,.2,1),-webkit-transform .3s cubic-bezier(.2,0,.2,1);will-change:transform}.zoom__element{visibility:visible;opacity:1;-webkit-transition:visibility 0s linear 0s,opacity .4s 0s;transition:visibility 0s linear 0s,opacity .4s 0s;will-change:visibility,opacity;max-width:100%;cursor:pointer;cursor:-moz-zoom-in;cursor:-webkit-zoom-in}.zoom__element--active{width:100%}.zoom__clone,.zoom__element--hidden{visibility:hidden;opacity:0;-webkit-transition:visibility 0s linear .5s,opacity .1s .4s;transition:visibility 0s linear .5s,opacity .1s .4s}.zoom__clone{will-change:visibility,opacity;position:absolute;top:0;right:0;bottom:0;left:0;width:100%;cursor:pointer;cursor:-moz-zoom-out;cursor:-webkit-zoom-out}.zoom__clone--visible{visibility:visible;opacity:1;-webkit-transition:visibility 0s linear 0s,opacity .4s 0s;transition:visibility 0s linear 0s,opacity .4s 0s}.zoom__overlay{position:fixed;top:0;right:0;bottom:0;left:0;z-index:1;background:#fff;opacity:0;filter:"alpha(opacity=0)";-webkit-transition:opacity .3s;transition:opacity .3s;will-change:opacity,filter}.zoom__overlay--visible{opacity:1;filter:"alpha(opacity=100)"}',""])},function(t,e){t.exports=function(){var t=[];return t.toString=function(){var t,e,n=[];for(t=0;t<this.length;t++)e=this[t],e[2]?n.push("@media "+e[2]+"{"+e[1]+"}"):n.push(e[1]);return n.join("")},t.i=function(e,n){var i,o,r,s;for("string"==typeof e&&(e=[[null,e,""]]),i={},o=0;o<this.length;o++)r=this[o][0],"number"==typeof r&&(i[r]=!0);for(o=0;o<e.length;o++)s=e[o],"number"==typeof s[0]&&i[s[0]]||(n&&!s[2]?s[2]=n:n&&(s[2]="("+s[2]+") and ("+n+")"),t.push(s))},t}},function(t,e,n){var i,o;!function(r,s){i=s,o="function"==typeof i?i.call(e,n,e,t):i,!(void 0!==o&&(t.exports=o))}(this,function(){function t(t,e){return function(n,i,o,r){n[t]?n[t](i,o,r):n[e]&&n[e]("on"+i,o)}}return{add:t("addEventListener","attachEvent"),remove:t("removeEventListener","detachEvent")}})},function(t,e){function n(t){if(!i)return!1;if(!t)return null!=i;var e=getComputedStyle(t)[i];return""!==e&&0!==parseFloat(e)}for(var i,o,r=["transitionDuration","MozTransitionDuration","webkitTransitionDuration"];r.length;)o=r.shift(),o in document.body.style&&(i=o);t.exports=n},function(t,e,n){var i,o,r,s=n(1);s&&window.getComputedStyle?(i={webkitTransform:"-webkit-transform",OTransform:"-o-transform",msTransform:"-ms-transform",MozTransform:"-moz-transform",transform:"transform"},o=document.createElement("div"),o.style[s]="translate3d(1px,1px,1px)",document.body.insertBefore(o,null),r=getComputedStyle(o).getPropertyValue(i[s]),document.body.removeChild(o),t.exports=null!=r&&r.length&&"none"!=r):t.exports=!1},function(t,e){function n(t,e){var n,i,o,r,s;for(n=0;n<t.length;n++)if(i=t[n],o=p[i.id]){for(o.refs++,r=0;r<o.parts.length;r++)o.parts[r](i.parts[r]);for(;r<i.parts.length;r++)o.parts.push(c(i.parts[r],e))}else{for(s=[],r=0;r<i.parts.length;r++)s.push(c(i.parts[r],e));p[i.id]={id:i.id,refs:1,parts:s}}}function i(t){var e,n,i,o,r,s,a,c=[],l={};for(e=0;e<t.length;e++)n=t[e],i=n[0],o=n[1],r=n[2],s=n[3],a={css:o,media:r,sourceMap:s},l[i]?l[i].parts.push(a):c.push(l[i]={id:i,parts:[a]});return c}function o(t,e){var n=h(),i=g[g.length-1];if("top"===t.insertAt)i?i.nextSibling?n.insertBefore(e,i.nextSibling):n.appendChild(e):n.insertBefore(e,n.firstChild),g.push(e);else{if("bottom"!==t.insertAt)throw Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");n.appendChild(e)}}function r(t){t.parentNode.removeChild(t);var e=g.indexOf(t);e>=0&&g.splice(e,1)}function s(t){var e=document.createElement("style");return e.type="text/css",o(t,e),e}function a(t){var e=document.createElement("link");return e.rel="stylesheet",o(t,e),e}function c(t,e){var n,i,o,c;return e.singleton?(c=y++,n=b||(b=s(e)),i=l.bind(null,n,c,!1),o=l.bind(null,n,c,!0)):t.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(n=a(e),i=d.bind(null,n),o=function(){r(n),n.href&&URL.revokeObjectURL(n.href)}):(n=s(e),i=u.bind(null,n),o=function(){r(n)}),i(t),function(e){if(e){if(e.css===t.css&&e.media===t.media&&e.sourceMap===t.sourceMap)return;i(t=e)}else o()}}function l(t,e,n,i){var o,r,s=n?"":i.css;t.styleSheet?t.styleSheet.cssText=f(e,s):(o=document.createTextNode(s),r=t.childNodes,r[e]&&t.removeChild(r[e]),r.length?t.insertBefore(o,r[e]):t.appendChild(o))}function u(t,e){var n=e.css,i=e.media;if(i&&t.setAttribute("media",i),t.styleSheet)t.styleSheet.cssText=n;else{for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(n))}}function d(t,e){var n,i,o=e.css,r=e.sourceMap;r&&(o+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(r))))+" */"),n=new Blob([o],{type:"text/css"}),i=t.href,t.href=URL.createObjectURL(n),i&&URL.revokeObjectURL(i)}var f,p={},m=function(t){var e;return function(){return void 0===e&&(e=t.apply(this,arguments)),e}},v=m(function(){return/msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase())}),h=m(function(){return document.head||document.getElementsByTagName("head")[0]}),b=null,y=0,g=[];t.exports=function(t,e){if("undefined"!=typeof DEBUG&&DEBUG&&"object"!=typeof document)throw Error("The style-loader cannot be used in a non-browser environment");e=e||{},void 0===e.singleton&&(e.singleton=v()),void 0===e.insertAt&&(e.insertAt="bottom");var o=i(t);return n(o,e),function(t){var r,s,a,c,l,u=[];for(r=0;r<o.length;r++)s=o[r],a=p[s.id],a.refs--,u.push(a);for(t&&(c=i(t),n(c,e)),r=0;r<u.length;r++)if(a=u[r],0===a.refs){for(l=0;l<a.parts.length;l++)a.parts[l]();delete p[a.id]}}},f=function(){var t=[];return function(e,n){return t[e]=n,t.filter(Boolean).join("\n")}}()},function(t,e,n){"use strict";var i,o;Object.defineProperty(e,"__esModule",{value:!0}),n(3),i=n(0),o=n(2),i.ready(function(){return o.start()})}]);