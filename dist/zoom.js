/*
 zoom.ts v7.5.0
 https://www.michael-bull.com/projects/zoom.ts

 Copyright (c) 2017 Michael Bull (https://www.michael-bull.com)
 @license ISC
*/
'use strict';(function(){function K(a,b){a=a.getAttribute("data-"+b);return null===a||(a=Number(a),isNaN(a))?Infinity:a}function L(a){void 0===a&&(a=window);void 0===a.pageYOffset?(a=a.document,a=(a.compatMode===M?a.documentElement:a.body).scrollTop):a=a.pageYOffset;return a}function Z(a){"function"!==typeof a.preventDefault&&(a.preventDefault=function(){a.returnValue=!1});"function"!==typeof a.stopPropagation&&(a.stopPropagation=function(){a.cancelBubble=!0});if("mouseover"===a.type){var b=a;void 0===
b.relatedTarget&&void 0!==b.fromElement&&(b.relatedTarget=b.fromElement)}else"mouseout"===a.type&&(b=a,void 0===b.relatedTarget&&void 0!==b.toElement&&(b.relatedTarget=b.toElement));return a}function v(a,b){"function"===typeof a?a(b):a.handleEvent(b)}function u(a,b,d,c){function e(a){if(void 0===a)if(void 0!==window.event)a=window.event;else throw Error("No current event to handle.");v(d,Z(a))}void 0===c&&(c=!1);var h=a.addEventListener,f=a.attachEvent;if("function"===typeof h)return h.call(a,b,e,
c),e;if("function"===typeof f&&f.call(a,"on"+b,e))return e}function n(a,b,d){var c=a.removeEventListener,e=a.detachEvent;"function"===typeof c?c.call(a,b,d):"function"===typeof e&&e.call(a,b,d)}function aa(a){return function(b){27===b.keyCode&&(b.preventDefault(),b.stopPropagation(),v(a,b))}}function ba(a,b,d,c){return function(e){Math.abs(a-d())>=b&&v(c,e)}}function N(a,b,d){var c=u(window,"scroll",ba(L(),a.m,L,d)),e=u(document,"keyup",aa(d)),h=u(b,"click",d);return function(){n(window,"scroll",
c);n(document,"keyup",e);n(b,"click",h)}}function w(a,b,d){var c;void 0===c&&(c=!1);var e=u(a,b,function(c){void 0!==e&&n(a,b,e);v(d,c)},c);return e}function ca(a){var b=document;"complete"===b.readyState?a():w(b,"DOMContentLoaded",function(){return a()})}function O(){var a=document,a=a.compatMode===M?a.documentElement:a.body;return[a.clientWidth,a.clientHeight]}function P(a){var b=document.createElement("div");b.className=a;return b}function da(a){var b=""+a.charAt(0).toUpperCase()+a.substr(1),d=
ea.map(function(a){return""+a+b});return[a].concat(d)}function B(a,b){var d=0;for(b=da(b);d<b.length;d++){var c=b[d];if(c in a)return c}}function p(a,b){return{position:a,size:b}}function Q(a){a=a.getBoundingClientRect();return p(C(a),[a.width,a.height])}function D(a,b,d,c,e){a.left=b;a.top=d;a.width=c;a.maxWidth=c;a.height=e}function y(a,b){var d=b.position;b=b.size;D(a,d[0]+"px",d[1]+"px",b[0]+"px",b[1]+"px")}function z(a,b){var d=O(),c;c=b.size;a=R([Math.min(d[0],a[0]),Math.min(d[1],a[1])],b.size);
c=[c[0]*a,c[1]*a];return{position:S(d,p(b.position,c)),size:c}}function C(a){return[a.left,a.top]}function E(a,b){return[a[0]/b,a[1]/b]}function F(a,b){return[a[0]-b[0],a[1]-b[1]]}function R(a,b){a=[a[0]/b[0],a[1]/b[1]];return Math.min(a[0],a[1])}function S(a,b){return F(E(F(a,b.size),2),b.position)}function G(a,b,d,c){var e;e=O();d=R([Math.min(e[0],d[0]),Math.min(e[1],d[1])],c.size);var h;h=c.size;h=[h[0]*d,h[1]*d];var f=c.position;c=E(F(c.size,h),2);e=E(S(e,p([f[0]+c[0],f[1]+c[1]],h)),d);b.style[a.f]=
a.j?"scale3d("+d+", "+d+", 1) "+("translate3d("+e[0]+"px, "+e[1]+"px, 0)"):"scale("+d+") "+("translate("+e[0]+"px, "+e[1]+"px)")}function T(a,b,d){a.style[b]="initial";d();a.offsetHeight;a.style[b]=""}function U(a,b,d){return 0<a.length&&d.indexOf(a)===b}function fa(a){return function(b,d,c){return b!==a&&U(b,d,c)}}function r(a,b){return-1!==a.className.indexOf(b)}function t(a,b){a.className=a.className.split(" ").concat(b).filter(U).join(" ")}function l(a,b){a.className=a.className.split(" ").filter(fa(b)).join(" ")}
function V(a){t(a,"zoom__element--active")}function H(a,b){a=a.getAttribute("data-src");return null===a?b.src:a}function ga(a){var b=document.createElement("img");b.className="zoom__clone";b.src=a;w(b,"load",function(){return t(b,"zoom__clone--loaded")});return b}function ha(a){return function(){void 0!==a.clone&&r(a.b,"zoom--expanded")&&!r(a.clone,"zoom__clone--visible")&&A(a.c,a.clone)}}function x(a){return r(a,"zoom__clone--loaded")}function A(a,b){t(b,"zoom__clone--visible");t(a,"zoom__element--hidden")}
function ia(a,b){l(a,"zoom__element--hidden");l(b,"zoom__clone--visible")}function I(a,b){void 0!==b.clone&&ia(b.c,b.clone);l(b.c,"zoom__element--active");document.body.removeChild(b.h);l(b.b,"zoom--collapsing");b.b.style.height="";setTimeout(function(){return W(a)},1)}function ja(a,b,d,c){var e=Q(b.c),h=u(window,"resize",function(){var a=C(b.b.getBoundingClientRect());e=p(a,e.size);y(b.a.style,z(d,e))}),f;f=N(a,b.a,function(){f();n(window,"resize",h);void 0===b.clone||void 0===c||x(b.clone)||n(b.clone,
"load",c);l(b.b,"zoom--expanded");D(b.a.style,"","","","");I(a,b)});t(b.b,"zoom--expanded");b.b.style.height=b.c.height+"px";V(b.c);y(b.a.style,z(d,e))}function ka(a,b,d,c,e){function h(){void 0!==b.clone&&x(b.clone)&&!r(b.clone,"zoom__clone--visible")&&(void 0!==c&&n(b.clone,e.g,c),A(b.c,b.clone));l(b.b,"zoom--expanding");t(b.b,"zoom--expanded");T(b.a,e.transitionProperty,function(){b.a.style[e.f]="";y(b.a.style,z(d,f))})}var f=Q(b.c),g=u(window,"resize",function(){var a=C(b.b.getBoundingClientRect());
f=p(a,f.size);a=b.b;r(a,"zoom--expanding")||r(a,"zoom--collapsing")?G(e,b.a,d,f):y(b.a.style,z(d,f))}),m,q;q=N(a,b.a,function(){q();n(window,"resize",g);void 0===b.clone||void 0===c||x(b.clone)||n(b.clone,"load",c);l(b.h,"zoom__overlay--visible");t(b.b,"zoom--collapsing");var h=w(b.a,e.g,function(){I(a,b)});r(b.b,"zoom--expanding")?(void 0!==m&&n(b.a,e.g,m),b.a.style[e.f]="",l(b.b,"zoom--expanding")):(T(b.a,e.transitionProperty,function(){G(e,b.a,d,f)}),b.a.style[e.f]="",D(b.a.style,"","","",""),
l(b.b,"zoom--expanded"));void 0===h&&I(a,b)});t(b.b,"zoom--expanding");b.b.style.height=b.c.height+"px";V(b.c);m=w(b.a,e.g,function(){return h()});void 0===m?h():G(e,b.a,d,f)}function W(a){var b=u(document.body,"click",function(d){var c=d.target;if(c instanceof HTMLImageElement&&null!==c.parentElement&&null!==c.parentElement&&null!==c.parentElement.parentElement&&r(c,"zoom__element")){d.preventDefault();d.stopPropagation();var e=b,c=d.target,h=c.parentElement,f=r(h,"zoom__container"),h=f?h.parentElement:
h;if(d.metaKey||d.ctrlKey)window.open(H(h,c),"_blank");else{void 0!==e&&n(document.body,"click",e);var g;d=P("zoom__overlay");document.body.appendChild(d);d.offsetHeight;t(d,"zoom__overlay--visible");if(f){g=c.parentElement;var f=g.parentElement,m;H(f,c)!==c.src&&(m=g.children.item(1));g={h:d,b:f,a:g,c:c,clone:m};void 0!==g.clone&&x(g.clone)&&A(c,g.clone)}else m=P("zoom__container"),f=c.parentElement,e=H(f,c),e!==c.src&&(g=ga(e)),g={h:d,b:f,a:m,c:c,clone:g},g.b.replaceChild(g.a,c),g.a.appendChild(c),
void 0!==g.clone&&g.a.appendChild(g.clone);m=void 0;void 0!==g.clone&&(x(g.clone)?A(c,g.clone):m=u(g.clone,"load",ha(g)));var c=g.b,c=[K(c,"width"),K(c,"height")],q,f=document.body.style;d=B(f,"transform");f=B(f,"transition");e=!1;void 0!==d&&(e=!0);h=!1;void 0!==f&&(q=la[f],h=void 0!==q);var k=!1;if(void 0!==d)if(k=document.body.style,void 0!==B(k,"perspective"))if("WebkitPerspective"in k){k=document.createElement("div");k.id=J;k.style.position="absolute";var l=document.createElement("style");l.textContent=
ma;var p=document.body;p.appendChild(l);p.appendChild(k);var v=k.offsetWidth,w=k.offsetHeight;p.removeChild(l);p.removeChild(k);k=v===X&&w===Y}else k=!0;else k=!1;q={f:d,transitionProperty:f,g:q,i:e,j:k,l:h};q.i&&q.l?ka(a,g,c,m,q):ja(a,g,c,m)}}})}var M="CSS1Compat",ea=["Webkit","Moz","ms","O"],J="test3d",X=4,Y=8,ma=""+("#"+J+"{margin:0;padding:0;border:0;width:0;height:0}")+"@media (transform-3d),(-webkit-transform-3d){"+("#"+J+"{width:"+(X+"px")+";height:"+(Y+"px")+"}")+"}",la={WebkitTransition:"webkitTransitionEnd",
MozTransition:"transitionend",OTransition:"oTransitionEnd",msTransition:"MSTransitionEnd",transition:"transitionend"},na={m:50};(function(a){void 0===a&&(a=na);ca(function(){return W(a)})})()})();
