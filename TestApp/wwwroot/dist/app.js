/*! For license information please see app.js.LICENSE.txt */
(()=>{var t={332:(t,e,n)=>{"use strict";n.r(e),n.d(e,{default:()=>s});var r=n(81),o=n.n(r),i=n(645),a=n.n(i)()(o());a.push([t.id,".main-nav li .glyphicon {\n    margin-right: 10px;\n}\n\n/* Highlighting rules for nav menu items */\n.main-nav li a.router-link-active,\n.main-nav li a.router-link-active:hover,\n.main-nav li a.router-link-active:focus {\n    background-color: #4189C7;\n    color: white;\n}\n\n/* Keep the nav menu independent of scrolling and on top of other items */\n.main-nav {\n    position: fixed;\n    top: 0;\n    left: 0;\n    right: 0;\n    z-index: 1;\n}\n\n@media (max-width: 767px) {\n    /* On small screens, the nav menu spans the full width of the screen. Leave a space for it. */\n    body {\n        padding-top: 50px;\n    }\n}\n\n@media (min-width: 768px) {\n    /* On small screens, convert the nav menu to a vertical sidebar */\n    .main-nav {\n        height: 100%;\n        width: calc(25% - 20px);\n    }\n    .main-nav .navbar {\n        border-radius: 0px;\n        border-width: 0px;\n        height: 100%;\n    }\n    .main-nav .navbar-header {\n        float: none;\n    }\n    .main-nav .navbar-collapse {\n        border-top: 1px solid #444;\n        padding: 0px;\n    }\n    .main-nav .navbar ul {\n        float: none;\n    }\n    .main-nav .navbar li {\n        float: none;\n        font-size: 15px;\n        margin: 6px;\n    }\n    .main-nav .navbar li a {\n        padding: 10px 16px;\n        border-radius: 4px;\n    }\n    .main-nav .navbar a {\n        /* If a menu item's text is too long, truncate it */\n        width: 100%;\n        white-space: nowrap;\n        overflow: hidden;\n        text-overflow: ellipsis;\n    }\n}\n",""]);const s=a},645:t=>{"use strict";t.exports=function(t){var e=[];return e.toString=function(){return this.map((function(e){var n="",r=void 0!==e[5];return e[4]&&(n+="@supports (".concat(e[4],") {")),e[2]&&(n+="@media ".concat(e[2]," {")),r&&(n+="@layer".concat(e[5].length>0?" ".concat(e[5]):""," {")),n+=t(e),r&&(n+="}"),e[2]&&(n+="}"),e[4]&&(n+="}"),n})).join("")},e.i=function(t,n,r,o,i){"string"==typeof t&&(t=[[null,t,void 0]]);var a={};if(r)for(var s=0;s<this.length;s++){var c=this[s][0];null!=c&&(a[c]=!0)}for(var u=0;u<t.length;u++){var f=[].concat(t[u]);r&&a[f[0]]||(void 0!==i&&(void 0===f[5]||(f[1]="@layer".concat(f[5].length>0?" ".concat(f[5]):""," {").concat(f[1],"}")),f[5]=i),n&&(f[2]?(f[1]="@media ".concat(f[2]," {").concat(f[1],"}"),f[2]=n):f[2]=n),o&&(f[4]?(f[1]="@supports (".concat(f[4],") {").concat(f[1],"}"),f[4]=o):f[4]="".concat(o)),e.push(f))}},e}},81:t=>{"use strict";t.exports=function(t){return t[1]}},702:function(t,e,n){t.exports=function(){"use strict";function t(t){return"function"==typeof t}var e=Array.isArray?Array.isArray:function(t){return"[object Array]"===Object.prototype.toString.call(t)},r=0,o=void 0,i=void 0,a=function(t,e){d[r]=t,d[r+1]=e,2===(r+=2)&&(i?i(h):g())};var s="undefined"!=typeof window?window:void 0,c=s||{},u=c.MutationObserver||c.WebKitMutationObserver,f="undefined"==typeof self&&"undefined"!=typeof process&&"[object process]"==={}.toString.call(process),l="undefined"!=typeof Uint8ClampedArray&&"undefined"!=typeof importScripts&&"undefined"!=typeof MessageChannel;function p(){var t=setTimeout;return function(){return t(h,1)}}var d=new Array(1e3);function h(){for(var t=0;t<r;t+=2)(0,d[t])(d[t+1]),d[t]=void 0,d[t+1]=void 0;r=0}var v,y,b,m,g=void 0;function w(t,e){var n=arguments,r=this,o=new this.constructor(j);void 0===o[O]&&F(o);var i,s=r._state;return s?(i=n[s-1],a((function(){return L(s,o,i,r._result)}))):E(r,o,t,e),o}function _(t){if(t&&"object"==typeof t&&t.constructor===this)return t;var e=new this(j);return R(e,t),e}g=f?function(){return process.nextTick(h)}:u?(y=0,b=new u(h),m=document.createTextNode(""),b.observe(m,{characterData:!0}),function(){m.data=y=++y%2}):l?((v=new MessageChannel).port1.onmessage=h,function(){return v.port2.postMessage(0)}):void 0===s?function(){try{var t=n(327);return o=t.runOnLoop||t.runOnContext,function(){o(h)}}catch(t){return p()}}():p();var O=Math.random().toString(36).substring(16);function j(){}var x=void 0,P=new D;function A(t){try{return t.then}catch(t){return P.error=t,P}}function S(e,n,r){n.constructor===e.constructor&&r===w&&n.constructor.resolve===_?function(t,e){1===e._state?C(t,e._result):2===e._state?k(t,e._result):E(e,void 0,(function(e){return R(t,e)}),(function(e){return k(t,e)}))}(e,n):r===P?k(e,P.error):void 0===r?C(e,n):t(r)?function(t,e,n){a((function(t){var r=!1,o=function(t,e,n,r){try{t.call(e,n,r)}catch(t){return t}}(n,e,(function(n){r||(r=!0,e!==n?R(t,n):C(t,n))}),(function(e){r||(r=!0,k(t,e))}),t._label);!r&&o&&(r=!0,k(t,o))}),t)}(e,n,r):C(e,n)}function R(t,e){var n;t===e?k(t,new TypeError("You cannot resolve a promise with itself")):"function"==typeof(n=e)||"object"==typeof n&&null!==n?S(t,e,A(e)):C(t,e)}function T(t){t._onerror&&t._onerror(t._result),M(t)}function C(t,e){t._state===x&&(t._result=e,t._state=1,0!==t._subscribers.length&&a(M,t))}function k(t,e){t._state===x&&(t._state=2,t._result=e,a(T,t))}function E(t,e,n,r){var o=t._subscribers,i=o.length;t._onerror=null,o[i]=e,o[i+1]=n,o[i+2]=r,0===i&&t._state&&a(M,t)}function M(t){var e=t._subscribers,n=t._state;if(0!==e.length){for(var r=void 0,o=void 0,i=t._result,a=0;a<e.length;a+=3)r=e[a],o=e[a+n],r?L(n,r,o,i):o(i);t._subscribers.length=0}}function D(){this.error=null}var U=new D;function L(e,n,r,o){var i=t(r),a=void 0,s=void 0,c=void 0,u=void 0;if(i){if((a=function(t,e){try{return t(e)}catch(t){return U.error=t,U}}(r,o))===U?(u=!0,s=a.error,a=null):c=!0,n===a)return void k(n,new TypeError("A promises callback cannot return that same promise."))}else a=o,c=!0;n._state!==x||(i&&c?R(n,a):u?k(n,s):1===e?C(n,a):2===e&&k(n,a))}var I=0;function F(t){t[O]=I++,t._state=void 0,t._result=void 0,t._subscribers=[]}function N(t,n){this._instanceConstructor=t,this.promise=new t(j),this.promise[O]||F(this.promise),e(n)?(this._input=n,this.length=n.length,this._remaining=n.length,this._result=new Array(this.length),0===this.length?C(this.promise,this._result):(this.length=this.length||0,this._enumerate(),0===this._remaining&&C(this.promise,this._result))):k(this.promise,new Error("Array Methods must be provided an Array"))}function B(t){this[O]=I++,this._result=this._state=void 0,this._subscribers=[],j!==t&&("function"!=typeof t&&function(){throw new TypeError("You must pass a resolver function as the first argument to the promise constructor")}(),this instanceof B?function(t,e){try{e((function(e){R(t,e)}),(function(e){k(t,e)}))}catch(e){k(t,e)}}(this,t):function(){throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.")}())}function H(){var t=void 0;if(void 0!==n.g)t=n.g;else if("undefined"!=typeof self)t=self;else try{t=Function("return this")()}catch(t){throw new Error("polyfill failed because global object is unavailable in this environment")}var e=t.Promise;if(e){var r=null;try{r=Object.prototype.toString.call(e.resolve())}catch(t){}if("[object Promise]"===r&&!e.cast)return}t.Promise=B}return N.prototype._enumerate=function(){for(var t=this.length,e=this._input,n=0;this._state===x&&n<t;n++)this._eachEntry(e[n],n)},N.prototype._eachEntry=function(t,e){var n=this._instanceConstructor,r=n.resolve;if(r===_){var o=A(t);if(o===w&&t._state!==x)this._settledAt(t._state,e,t._result);else if("function"!=typeof o)this._remaining--,this._result[e]=t;else if(n===B){var i=new n(j);S(i,t,o),this._willSettleAt(i,e)}else this._willSettleAt(new n((function(e){return e(t)})),e)}else this._willSettleAt(r(t),e)},N.prototype._settledAt=function(t,e,n){var r=this.promise;r._state===x&&(this._remaining--,2===t?k(r,n):this._result[e]=n),0===this._remaining&&C(r,this._result)},N.prototype._willSettleAt=function(t,e){var n=this;E(t,void 0,(function(t){return n._settledAt(1,e,t)}),(function(t){return n._settledAt(2,e,t)}))},B.all=function(t){return new N(this,t).promise},B.race=function(t){var n=this;return e(t)?new n((function(e,r){for(var o=t.length,i=0;i<o;i++)n.resolve(t[i]).then(e,r)})):new n((function(t,e){return e(new TypeError("You must pass an array to race."))}))},B.resolve=_,B.reject=function(t){var e=new this(j);return k(e,t),e},B._setScheduler=function(t){i=t},B._setAsap=function(t){a=t},B._asap=a,B.prototype={constructor:B,then:w,catch:function(t){return this.then(null,t)}},H(),B.polyfill=H,B.Promise=B,B}()},933:(t,e,n)=>{var r=n(332);"string"==typeof r&&(r=[[t.id,r,""]]);n(723)(r,{hmr:!0,transform:void 0,insertInto:void 0}),r.locals&&(t.exports=r.locals)},723:(t,e,n)=>{var r,o,i={},a=(r=function(){return window&&document&&document.all&&!window.atob},function(){return void 0===o&&(o=r.apply(this,arguments)),o}),s=function(t,e){return e?e.querySelector(t):document.querySelector(t)},c=function(t){var e={};return function(t,n){if("function"==typeof t)return t();if(void 0===e[t]){var r=s.call(this,t,n);if(window.HTMLIFrameElement&&r instanceof window.HTMLIFrameElement)try{r=r.contentDocument.head}catch(t){r=null}e[t]=r}return e[t]}}(),u=null,f=0,l=[],p=n(947);function d(t,e){for(var n=0;n<t.length;n++){var r=t[n],o=i[r.id];if(o){o.refs++;for(var a=0;a<o.parts.length;a++)o.parts[a](r.parts[a]);for(;a<r.parts.length;a++)o.parts.push(g(r.parts[a],e))}else{var s=[];for(a=0;a<r.parts.length;a++)s.push(g(r.parts[a],e));i[r.id]={id:r.id,refs:1,parts:s}}}}function h(t,e){for(var n=[],r={},o=0;o<t.length;o++){var i=t[o],a=e.base?i[0]+e.base:i[0],s={css:i[1],media:i[2],sourceMap:i[3]};r[a]?r[a].parts.push(s):n.push(r[a]={id:a,parts:[s]})}return n}function v(t,e){var n=c(t.insertInto);if(!n)throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");var r=l[l.length-1];if("top"===t.insertAt)r?r.nextSibling?n.insertBefore(e,r.nextSibling):n.appendChild(e):n.insertBefore(e,n.firstChild),l.push(e);else if("bottom"===t.insertAt)n.appendChild(e);else{if("object"!=typeof t.insertAt||!t.insertAt.before)throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");var o=c(t.insertAt.before,n);n.insertBefore(e,o)}}function y(t){if(null===t.parentNode)return!1;t.parentNode.removeChild(t);var e=l.indexOf(t);e>=0&&l.splice(e,1)}function b(t){var e=document.createElement("style");if(void 0===t.attrs.type&&(t.attrs.type="text/css"),void 0===t.attrs.nonce){var r=n.nc;r&&(t.attrs.nonce=r)}return m(e,t.attrs),v(t,e),e}function m(t,e){Object.keys(e).forEach((function(n){t.setAttribute(n,e[n])}))}function g(t,e){var n,r,o,i;if(e.transform&&t.css){if(!(i="function"==typeof e.transform?e.transform(t.css):e.transform.default(t.css)))return function(){};t.css=i}if(e.singleton){var a=f++;n=u||(u=b(e)),r=O.bind(null,n,a,!1),o=O.bind(null,n,a,!0)}else t.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(n=function(t){var e=document.createElement("link");return void 0===t.attrs.type&&(t.attrs.type="text/css"),t.attrs.rel="stylesheet",m(e,t.attrs),v(t,e),e}(e),r=x.bind(null,n,e),o=function(){y(n),n.href&&URL.revokeObjectURL(n.href)}):(n=b(e),r=j.bind(null,n),o=function(){y(n)});return r(t),function(e){if(e){if(e.css===t.css&&e.media===t.media&&e.sourceMap===t.sourceMap)return;r(t=e)}else o()}}t.exports=function(t,e){if("undefined"!=typeof DEBUG&&DEBUG&&"object"!=typeof document)throw new Error("The style-loader cannot be used in a non-browser environment");(e=e||{}).attrs="object"==typeof e.attrs?e.attrs:{},e.singleton||"boolean"==typeof e.singleton||(e.singleton=a()),e.insertInto||(e.insertInto="head"),e.insertAt||(e.insertAt="bottom");var n=h(t,e);return d(n,e),function(t){for(var r=[],o=0;o<n.length;o++){var a=n[o];(s=i[a.id]).refs--,r.push(s)}for(t&&d(h(t,e),e),o=0;o<r.length;o++){var s;if(0===(s=r[o]).refs){for(var c=0;c<s.parts.length;c++)s.parts[c]();delete i[s.id]}}}};var w,_=(w=[],function(t,e){return w[t]=e,w.filter(Boolean).join("\n")});function O(t,e,n,r){var o=n?"":r.css;if(t.styleSheet)t.styleSheet.cssText=_(e,o);else{var i=document.createTextNode(o),a=t.childNodes;a[e]&&t.removeChild(a[e]),a.length?t.insertBefore(i,a[e]):t.appendChild(i)}}function j(t,e){var n=e.css,r=e.media;if(r&&t.setAttribute("media",r),t.styleSheet)t.styleSheet.cssText=n;else{for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(n))}}function x(t,e,n){var r=n.css,o=n.sourceMap,i=void 0===e.convertToAbsoluteUrls&&o;(e.convertToAbsoluteUrls||i)&&(r=p(r)),o&&(r+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(o))))+" */");var a=new Blob([r],{type:"text/css"}),s=t.href;t.href=URL.createObjectURL(a),s&&URL.revokeObjectURL(s)}},947:t=>{t.exports=function(t){var e="undefined"!=typeof window&&window.location;if(!e)throw new Error("fixUrls requires window.location");if(!t||"string"!=typeof t)return t;var n=e.protocol+"//"+e.host,r=n+e.pathname.replace(/\/[^\/]*$/,"/");return t.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi,(function(t,e){var o,i=e.trim().replace(/^"(.*)"$/,(function(t,e){return e})).replace(/^'(.*)'$/,(function(t,e){return e}));return/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(i)?t:(o=0===i.indexOf("//")?i:0===i.indexOf("/")?n+i:r+i.replace(/^\.\//,""),"url("+JSON.stringify(o)+")")}))}},788:(t,e,n)=>{t.exports=n(99)(144)},671:(t,e,n)=>{t.exports=n(99)(345)},254:(t,e,n)=>{t.exports=n(99)(734)},99:t=>{"use strict";t.exports=vendor_f22b82494aa4bc4a64cf},327:()=>{}},e={};function n(r){var o=e[r];if(void 0!==o)return o.exports;var i=e[r]={id:r,exports:{}};return t[r].call(i.exports,i,i.exports,n),i.exports}n.n=t=>{var e=t&&t.__esModule?()=>t.default:()=>t;return n.d(e,{a:e}),e},n.d=(t,e)=>{for(var r in e)n.o(e,r)&&!n.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:e[r]})},n.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"==typeof window)return window}}(),n.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),n.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},(()=>{"use strict";n(254);var t=n(788),e=n(671);function r(t){return r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},r(t)}function o(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function i(){return"undefined"!=typeof Reflect&&Reflect.defineMetadata&&Reflect.getOwnMetadataKeys}function a(t,e){s(t,e),Object.getOwnPropertyNames(e.prototype).forEach((function(n){s(t.prototype,e.prototype,n)})),Object.getOwnPropertyNames(e).forEach((function(n){s(t,e,n)}))}function s(t,e,n){(n?Reflect.getOwnMetadataKeys(e,n):Reflect.getOwnMetadataKeys(e)).forEach((function(r){var o=n?Reflect.getOwnMetadata(r,e,n):Reflect.getOwnMetadata(r,e);n?Reflect.defineMetadata(r,o,t,n):Reflect.defineMetadata(r,o,t)}))}var c={__proto__:[]}instanceof Array;function u(t,e){var n=e.prototype._init;e.prototype._init=function(){var e=this,n=Object.getOwnPropertyNames(t);if(t.$options.props)for(var r in t.$options.props)t.hasOwnProperty(r)||n.push(r);n.forEach((function(n){Object.defineProperty(e,n,{get:function(){return t[n]},set:function(e){t[n]=e},configurable:!0})}))};var r=new e;e.prototype._init=n;var o={};return Object.keys(r).forEach((function(t){void 0!==r[t]&&(o[t]=r[t])})),o}var f=["data","beforeCreate","created","beforeMount","mounted","beforeDestroy","destroyed","beforeUpdate","updated","activated","deactivated","render","errorCaptured","serverPrefetch"];function l(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};n.name=n.name||e._componentTag||e.name;var r=e.prototype;Object.getOwnPropertyNames(r).forEach((function(t){if("constructor"!==t)if(f.indexOf(t)>-1)n[t]=r[t];else{var e=Object.getOwnPropertyDescriptor(r,t);void 0!==e.value?"function"==typeof e.value?(n.methods||(n.methods={}))[t]=e.value:(n.mixins||(n.mixins=[])).push({data:function(){return o({},t,e.value)}}):(e.get||e.set)&&((n.computed||(n.computed={}))[t]={get:e.get,set:e.set})}})),(n.mixins||(n.mixins=[])).push({data:function(){return u(this,e)}});var s=e.__decorators__;s&&(s.forEach((function(t){return t(n)})),delete e.__decorators__);var c=Object.getPrototypeOf(e.prototype),l=c instanceof t.default?c.constructor:t.default,p=l.extend(n);return d(p,e,l),i()&&a(p,e),p}var p={prototype:!0,arguments:!0,callee:!0,caller:!0};function d(t,e,n){Object.getOwnPropertyNames(e).forEach((function(o){if(!p[o]){var i=Object.getOwnPropertyDescriptor(t,o);if(!i||i.configurable){var a,s,u=Object.getOwnPropertyDescriptor(e,o);if(!c){if("cid"===o)return;var f=Object.getOwnPropertyDescriptor(n,o);if(s=r(a=u.value),null!=a&&("object"===s||"function"===s)&&f&&f.value===u.value)return}Object.defineProperty(t,o,u)}}}))}function h(t){return"function"==typeof t?l(t):function(e){return l(e,t)}}h.registerHooks=function(t){var e;f.push.apply(f,function(t){if(Array.isArray(t)){for(var e=0,n=new Array(t.length);e<t.length;e++)n[e]=t[e];return n}}(e=t)||function(t){if(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t))return Array.from(t)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}())};const v=h;"undefined"!=typeof Reflect&&Reflect.getMetadata,n(933);var y,b=(y=function(t,e){return y=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])},y(t,e)},function(t,e){function n(){this.constructor=t}y(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)});const m=function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return b(e,t),e.prototype.render=function(t){return t("header",[t("nav",{class:"navbar navbar-expand-sm navbar-toggleable-sm navbar-light bg-white border-bottom box-shadow mb-3"},[t("div",{class:"container"},[t("a",{class:"navbar-brand",attrs:{href:"/"}},["TSX + Vue.js 2"]),t("button",{class:"navbar-toggler",attrs:{type:"button","data-toggle":"collapse","data-target":".navbar-collapse","aria-controls":"navbarSupportedContent","aria-expanded":"false","aria-label":"Toggle navigation"}},[t("span",{class:"navbar-toggler-icon"})]),t("div",{class:"navbar-collapse collapse d-sm-inline-flex justify-content-between"},[t("ul",{class:"navbar-nav flex-grow-1"},[" ",t("li",{class:"nav-item"},[t("router-link",{attrs:{to:"/"}},["Home"])]),"   ",t("li",{class:"nav-item"},[t("router-link",{attrs:{to:"/counter"}},["Counter"])]),"   ",t("li",{class:"nav-item"},[t("router-link",{attrs:{to:"/fetchdata"}},["Fetch data"])])," "])])])])])},function(t,e,n,r){var o,i=arguments.length,a=i<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,n,r);else for(var s=t.length-1;s>=0;s--)(o=t[s])&&(a=(i<3?o(a):i>3?o(e,n,a):o(e,n))||a);return i>3&&a&&Object.defineProperty(e,n,a),a}([v],e)}(t.default);var g=function(){var t=function(e,n){return t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])},t(e,n)};return function(e,n){function r(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)}}();const w=function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return g(e,t),e.prototype.render=function(t){return t("div",{attrs:{id:"app-root"},class:"container-fluid"},[t(m),t("router-view")])},function(t,e,n,r){var o,i=arguments.length,a=i<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,n,r);else for(var s=t.length-1;s>=0;s--)(o=t[s])&&(a=(i<3?o(a):i>3?o(e,n,a):o(e,n))||a);return i>3&&a&&Object.defineProperty(e,n,a),a}([v],e)}(t.default);var _=function(){var t=function(e,n){return t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])},t(e,n)};return function(e,n){function r(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)}}();const O=function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e.currentcount=5,e}return _(e,t),e.prototype.incrementCounter=function(){this.currentcount++},e.prototype.render=function(t){var e=this;return t("div",[t("h1",["Counter TSX"]),t("p",["Counter done the TSX + Vue.js 2 way"]),t("p",["Current count: ",t("strong",[this.currentcount])]),t("button",{on:{click:function(){e.incrementCounter()}}},["Increment"])])},function(t,e,n,r){var o,i=arguments.length,a=i<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,n,r);else for(var s=t.length-1;s>=0;s--)(o=t[s])&&(a=(i<3?o(a):i>3?o(e,n,a):o(e,n))||a);return i>3&&a&&Object.defineProperty(e,n,a),a}([v],e)}(t.default);var j=function(){var t=function(e,n){return t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])},t(e,n)};return function(e,n){function r(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)}}();const x=function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return j(e,t),e.prototype.render=function(t){return t("div",[t("h1",["Hello, world!"]),t("p",["Welcome to your new single-page application, built with:"]),t("ul",[t("li",[t("a",{attrs:{href:"https://get.asp.net/"}},["ASP.NET Core"])," and ",t("a",{attrs:{href:"https://msdn.microsoft.com/en-us/library/67ef8sbd.aspx"}},["C#"])," for cross-platform server-side code"]),t("li",[t("a",{attrs:{href:"https://vuejs.org/"}},["Vue.js"])," and ",t("a",{attrs:{href:"http://www.typescriptlang.org/"}},["TypeScript"])," for client-side code"]),t("li",[t("a",{attrs:{href:"https://webpack.github.io/"}},["Webpack"])," for building and bundling client-side resources"]),t("li",[t("a",{attrs:{href:"http://getbootstrap.com/"}},["Bootstrap"])," for layout and styling"])]),t("p",["To help you get started, we've also set up:"]),t("ul",[t("li",[t("strong",["Client-side navigation"]),". For example, click ",t("em",["Counter"])," then ",t("em",["Back"])," to return here."]),t("li",[t("strong",["Webpack dev middleware"]),". In development mode, there's no need to run the ",t("code",["webpack"])," build tool. Your client-side resources are dynamically built on demand. Updates are available as soon as you modify any file."]),t("li",[t("strong",["Hot module replacement"]),". In development mode, you don't even need to reload the page after making most changes. Within seconds of saving changes to files, your Vue app will be rebuilt and a new instance injected is into the page."]),t("li",[t("strong",["Efficient production builds"]),". In production mode, development-time features are disabled, and the ",t("code",["webpack"])," build tool produces minified static CSS and JavaScript files."])])])},function(t,e,n,r){var o,i=arguments.length,a=i<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,n,r);else for(var s=t.length-1;s>=0;s--)(o=t[s])&&(a=(i<3?o(a):i>3?o(e,n,a):o(e,n))||a);return i>3&&a&&Object.defineProperty(e,n,a),a}([v],e)}(t.default);var P=function(){var t=function(e,n){return t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])},t(e,n)};return function(e,n){function r(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)}}(),A=function(t,e,n,r){return new(n||(n=Promise))((function(o,i){function a(t){try{c(r.next(t))}catch(t){i(t)}}function s(t){try{c(r.throw(t))}catch(t){i(t)}}function c(t){var e;t.done?o(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(a,s)}c((r=r.apply(t,e||[])).next())}))},S=function(t,e){var n,r,o,i,a={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function s(i){return function(s){return function(i){if(n)throw new TypeError("Generator is already executing.");for(;a;)try{if(n=1,r&&(o=2&i[0]?r.return:i[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,i[1])).done)return o;switch(r=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return a.label++,{value:i[1],done:!1};case 5:a.label++,r=i[1],i=[0];continue;case 7:i=a.ops.pop(),a.trys.pop();continue;default:if(!((o=(o=a.trys).length>0&&o[o.length-1])||6!==i[0]&&2!==i[0])){a=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){a.label=i[1];break}if(6===i[0]&&a.label<o[1]){a.label=o[1],o=i;break}if(o&&a.label<o[2]){a.label=o[2],a.ops.push(i);break}o[2]&&a.ops.pop(),a.trys.pop();continue}i=e.call(t,a)}catch(t){i=[6,t],r=0}finally{n=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,s])}}};const R=function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e.forecasts=[],e.loading=!0,e}return P(e,t),e.prototype.mounted=function(){return A(this,void 0,void 0,(function(){return S(this,(function(t){switch(t.label){case 0:return[4,this.refreshData()];case 1:return t.sent(),[2]}}))}))},e.prototype.refreshData=function(){return A(this,void 0,void 0,(function(){var t;return S(this,(function(e){switch(e.label){case 0:return t=this,[4,this.getDataAsync()];case 1:return t.forecasts=e.sent(),[2]}}))}))},e.prototype.getDataAsync=function(){return A(this,void 0,void 0,(function(){var t,e;return S(this,(function(n){switch(n.label){case 0:return this.loading=!0,[4,fetch("/api/SampleData/WeatherForecasts")];case 1:return t=n.sent(),e=t.json(),this.loading=!1,[2,e]}}))}))},e.prototype.render=function(t){var e=this;return t("div",[t("h1",["Weather forecast"]),t("p",["This component demonstrates fetching data from the server.",t("button",{attrs:{type:"button"},on:{click:function(){e.refreshData()}}},["Refresh data"])]),t("br"),this.renderForecastsTable(t)])},e.prototype.renderForecastsTable=function(t){return this.loading?t("p",[t("em",["Loading..."])]):t("table",{class:"table"},[t("thead",[t("tr",[t("th",["Date"]),t("th",["Temp. (C)"]),t("th",["Temp. (F)"]),t("th",["Summary"])])]),t("tbody",[this.forecasts.map((function(e){return t("tr",{key:e.dateFormatted},[t("td",[e.dateFormatted]),t("td",[e.temperatureC]),t("td",[e.temperatureF]),t("td",[e.summary])])}))])])},function(t,e,n,r){var o,i=arguments.length,a=i<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,n,r);else for(var s=t.length-1;s>=0;s--)(o=t[s])&&(a=(i<3?o(a):i>3?o(e,n,a):o(e,n))||a);return i>3&&a&&Object.defineProperty(e,n,a),a}([v],e)}(t.default);window.Promise||(window.Promise=n(702).Promise),t.default.use(e.default);var T=[{path:"/",component:x},{path:"/counter",component:O},{path:"/fetchdata",component:R}];new t.default({el:"#app-root",router:new e.default({mode:"history",routes:T}),render:function(t){return t(w)}})})()})();