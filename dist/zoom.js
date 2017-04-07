/*
 zoom.ts v7.5.0
 https://www.michael-bull.com/projects/zoom.ts

 Copyright (c) 2017 Michael Bull (https://www.michael-bull.com)
 @license ISC
*/
function C(){function D(a){return[a.left,a.top]}function E(a,b){return[a[0]/b,a[1]/b]}function F(a,b){return[a[0]-b[0],a[1]-b[1]]}function L(a,b){a=[a[0]/b[0],a[1]/b[1]];return Math.min(a[0],a[1])}function M(a,b){return F(E(F(a,b.size),2),b.position)}function N(a){return[a.clientWidth,a.clientHeight]}function O(a,b){a=a.getAttribute("data-"+b);return null===a?Infinity:Number(a)}function Y(a){"function"!==typeof a.preventDefault&&(a.preventDefault=function(){a.returnValue=!1});"function"!==typeof a.stopPropagation&&
(a.stopPropagation=function(){a.cancelBubble=!0});if("mouseover"===a.type){var b=a;void 0===b.relatedTarget&&void 0!==b.fromElement&&(b.relatedTarget=b.fromElement)}else"mouseout"===a.type&&(b=a,void 0===b.relatedTarget&&void 0!==b.toElement&&(b.relatedTarget=b.toElement));return a}function v(a,b){"function"===typeof a?a(b):a.handleEvent(b)}function u(a,b,d,c){function e(a){var b;void 0===b&&(b=window);if(void 0===a)if(void 0!==b.event)a=b.event;else throw Error("No current event to handle.");v(d,
Y(a))}void 0===c&&(c=!1);var f=a.addEventListener,k=a.attachEvent;if("function"===typeof f)return f.call(a,b,e,c),e;if("function"===typeof k&&k.call(a,"on"+b,e))return e}function y(a,b,d){var c;void 0===c&&(c=!1);var e=u(a,b,function(c){void 0!==e&&n(a,b,e);v(d,c)},c);return e}function n(a,b,d){var c=a.removeEventListener,e=a.detachEvent;"function"===typeof c?c.call(a,b,d):"function"===typeof e&&e.call(a,b,d)}function z(a){return"CSS1Compat"===a.compatMode?a.documentElement:a.body}function Z(a,b){"complete"===
a.readyState?b():y(a,"DOMContentLoaded",function(){return b()})}function P(a,b){a=a.createElement("div");a.className=b;return a}function p(a,b){return{position:a,size:b}}function Q(a){a=a.getBoundingClientRect();return p(D(a),[a.width,a.height])}function G(a,b,d,c,e){a.left=b;a.top=d;a.width=c;a.maxWidth=c;a.height=e}function A(a,b){var d=b.position;b=b.size;G(a,d[0]+"px",d[1]+"px",b[0]+"px",b[1]+"px")}function B(a,b,d){a=N(z(a));var c=d.size;b=L([Math.min(a[0],b[0]),Math.min(a[1],b[1])],d.size);
b=[c[0]*b,c[1]*b];return{position:M(a,p(d.position,b)),size:b}}function R(a){return 0<a.length}function t(a,b){return-1!==a.className.indexOf(b)}function q(a,b){a.className=a.className.split(" ").concat(b).filter(R).join(" ")}function l(a,b){a.className=a.className.split(" ").filter(function(a){return R(a)&&a!==b}).join(" ")}function S(a){q(a,"zoom__element--hidden")}function T(a){q(a,"zoom__element--active")}function H(a,b){a=a.getAttribute("data-src");return null===a?b.src:a}function aa(a){var b=
document.createElement("img");b.className="zoom__clone";b.src=a;y(b,"load",function(){return q(b,"zoom__clone--loaded")});return b}function ba(a){return function(){void 0!==a.clone&&t(a.b,"zoom--expanded")&&!t(a.clone,"zoom__clone--visible")&&(q(a.clone,"zoom__clone--visible"),S(a.c))}}function I(a,b){q(b,"zoom__clone--visible");S(a)}function ca(a,b){l(a,"zoom__element--hidden");l(b,"zoom__clone--visible")}function x(a){return t(a,"zoom__clone--loaded")}function J(a,b,d,c,e){a=N(z(a));c=L([Math.min(a[0],
c[0]),Math.min(a[1],c[1])],e.size);var f;f=e.size;f=[f[0]*c,f[1]*c];var k=e.position;e=E(F(e.size,f),2);e=E(M(a,p([k[0]+e[0],k[1]+e[1]],f)),c);d.style[b.f]=b.l?"scale("+c+") "+("translate3d("+e[0]+"px, "+e[1]+"px, 0)"):"scale("+c+") "+("translate("+e[0]+"px, "+e[1]+"px)")}function U(a,b,d){a.style[b]="initial";d();a.offsetHeight;a.style[b]=""}function da(a){return function(b){27===b.keyCode&&(b.preventDefault(),b.stopPropagation(),v(a,b))}}function ea(a,b,d,c){return function(e){Math.abs(a-d())>=
b&&v(c,e)}}function V(a,b,d,c){var e=u(a,"scroll",ea(void 0===a.pageYOffset?z(a.document).scrollTop:a.pageYOffset,b.m,function(){return void 0===a.pageYOffset?z(a.document).scrollTop:a.pageYOffset},c)),f=u(a.document,"keyup",da(c)),k=u(d,"click",c);return function(){n(a,"scroll",e);n(a.document,"keyup",f);n(d,"click",k)}}function fa(a){var b=""+a.charAt(0).toUpperCase()+a.substr(1),d=ga.map(function(a){return""+a+b});return[a].concat(d)}function W(a,b){var d=0;for(b=fa(b);d<b.length;d++){var c=b[d];
if(c in a)return c}}function K(a,b,d){void 0!==d.clone&&ca(d.c,d.clone);l(d.c,"zoom__element--active");a.document.body.removeChild(d.h);l(d.b,"zoom--collapsing");d.b.style.height="";setTimeout(function(){return X(a,b)},1)}function ha(a,b,d,c,e){var f=Q(d.c),k=u(a,"resize",function(){var b=D(d.b.getBoundingClientRect());f=p(b,f.size);A(d.a.style,B(a.document,c,f))}),h;h=V(a,b,d.a,function(){h();n(a,"resize",k);void 0===d.clone||void 0===e||x(d.clone)||n(d.clone,"load",e);l(d.b,"zoom--expanded");G(d.a.style,
"","","","");K(a,b,d)});q(d.b,"zoom--expanded");d.b.style.height=d.c.height+"px";T(d.c);A(d.a.style,B(document,c,f))}function ia(a,b,d,c,e,f){function k(){void 0!==c.clone&&x(c.clone)&&!t(c.clone,"zoom__clone--visible")&&(void 0!==f&&n(c.clone,b.g,f),I(c.c,c.clone));l(c.b,"zoom--expanding");q(c.b,"zoom--expanded");U(c.a,b.transitionProperty,function(){c.a.style[b.f]="";A(c.a.style,B(a.document,e,h))})}var h=Q(c.c),g=u(a,"resize",function(){var d=D(c.b.getBoundingClientRect());h=p(d,h.size);d=c.b;
t(d,"zoom--expanding")||t(d,"zoom--collapsing")?J(a.document,b,c.a,e,h):A(c.a.style,B(a.document,e,h))}),m,r;r=V(a,d,c.a,function(){r();n(a,"resize",g);void 0===c.clone||void 0===f||x(c.clone)||n(c.clone,"load",f);l(c.h,"zoom__overlay--visible");q(c.b,"zoom--collapsing");var k=y(c.a,b.g,function(){K(a,d,c)});t(c.b,"zoom--expanding")?(void 0!==m&&n(c.a,b.g,m),c.a.style[b.f]="",l(c.b,"zoom--expanding")):(U(c.a,b.transitionProperty,function(){J(a.document,b,c.a,e,h)}),c.a.style[b.f]="",G(c.a.style,"",
"","",""),l(c.b,"zoom--expanded"));void 0===k&&K(a,d,c)});q(c.b,"zoom--expanding");c.b.style.height=c.c.height+"px";T(c.c);m=y(c.a,b.g,function(){return k()});void 0===m?k():J(a.document,b,c.a,e,h)}function X(a,b){var d=u(a.document.body,"click",function(c){var e=c.target;if(e instanceof HTMLImageElement&&null!==e.parentElement&&t(e,"zoom__element")){c.preventDefault();c.stopPropagation();var f=d,e=c.target,k=e.parentElement,h=t(k,"zoom__container"),k=h?k.parentElement:k;if(c.metaKey||c.ctrlKey)a.open(H(k,
e),"_blank");else{void 0!==f&&n(a.document.body,"click",f);var g,f=a.document;c=P(f,"zoom__overlay");f.body.appendChild(c);c.offsetHeight;q(c,"zoom__overlay--visible");if(h){g=e.parentElement;var h=g.parentElement,m;H(h,e)!==e.src&&(m=g.children.item(1));g={h:c,b:h,a:g,c:e,clone:m};void 0!==g.clone&&x(g.clone)&&I(e,g.clone)}else m=P(document,"zoom__container"),h=e.parentElement,f=H(h,e),f!==e.src&&(g=aa(f)),g={h:c,b:h,a:m,c:e,clone:g},g.b.replaceChild(g.a,e),g.a.appendChild(e),void 0!==g.clone&&g.a.appendChild(g.clone);
m=void 0;void 0!==g.clone&&(x(g.clone)?I(e,g.clone):m=u(g.clone,"load",ba(g)));var e=g.b,e=[O(e,"width"),O(e,"height")],r,h=document.body.style;c=W(h,"transform");h=W(h,"transition");f=!1;void 0!==c&&(f=!0);k=!1;void 0!==h&&(r=ja[h],k=null!==r);var l=!1;if(void 0!==c){var p=a.getComputedStyle,v=ka[c];if("function"===typeof p&&void 0!==v){var w=a.document,l=w.body,w=w.createElement("p");w.style[c]="translate3d(1px,1px,1px)";l.appendChild(w);p=p(w).getPropertyValue(v);l.removeChild(w);l=0<p.length&&
"none"!==p}else l=!1}r={f:c,transitionProperty:h,g:r,i:f,j:k,l:l};r.i&&r.j?ia(a,r,b,g,e,m):ha(a,b,g,e,m)}}})}var ka={WebkitTransform:"-webkit-transform",MozTransform:"-moz-transform",msTransform:"-ms-transform",o:"-o-transform",transform:"transform"},ja={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",s:"oTransitionEnd",msTransition:"MSTransitionEnd",transition:"transitionend"},ga=["Webkit","Moz","ms","O"];(function(a,b){void 0===b&&(b={m:50});Z(a.document,function(){return X(a,
b)})})(window)}"undefined"!==typeof module?C():"function"===typeof define&&define.u?define(C):C();
