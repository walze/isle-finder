const q=function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const n of o)if(n.type==="childList")for(const a of n.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function t(o){const n={};return o.integrity&&(n.integrity=o.integrity),o.referrerpolicy&&(n.referrerPolicy=o.referrerpolicy),o.crossorigin==="use-credentials"?n.credentials="include":o.crossorigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(o){if(o.ep)return;o.ep=!0;const n=t(o);fetch(o.href,n)}};q();const D="modulepreload",M=function(e,r){return new URL(e,r).href},A={},Y=function(r,t,i){return!t||t.length===0?r():Promise.all(t.map(o=>{if(o=M(o,i),o in A)return;A[o]=!0;const n=o.endsWith(".css"),a=n?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${o}"]${a}`))return;const c=document.createElement("link");if(c.rel=n?"stylesheet":D,n||(c.as="script",c.crossOrigin=""),c.href=o,document.head.appendChild(c),n)return new Promise((u,s)=>{c.addEventListener("load",u),c.addEventListener("error",()=>s(new Error(`Unable to preload CSS for ${o}`)))})})).then(()=>r())};var E=function(e,r){return E=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,i){t.__proto__=i}||function(t,i){for(var o in i)Object.prototype.hasOwnProperty.call(i,o)&&(t[o]=i[o])},E(e,r)};function T(e,r){if(typeof r!="function"&&r!==null)throw new TypeError("Class extends value "+String(r)+" is not a constructor or null");E(e,r);function t(){this.constructor=e}e.prototype=r===null?Object.create(r):(t.prototype=r.prototype,new t)}function et(e,r,t,i){function o(n){return n instanceof t?n:new t(function(a){a(n)})}return new(t||(t=Promise))(function(n,a){function c(f){try{s(i.next(f))}catch(d){a(d)}}function u(f){try{s(i.throw(f))}catch(d){a(d)}}function s(f){f.done?n(f.value):o(f.value).then(c,u)}s((i=i.apply(e,r||[])).next())})}function rt(e,r){var t={label:0,sent:function(){if(n[0]&1)throw n[1];return n[1]},trys:[],ops:[]},i,o,n,a;return a={next:c(0),throw:c(1),return:c(2)},typeof Symbol=="function"&&(a[Symbol.iterator]=function(){return this}),a;function c(s){return function(f){return u([s,f])}}function u(s){if(i)throw new TypeError("Generator is already executing.");for(;t;)try{if(i=1,o&&(n=s[0]&2?o.return:s[0]?o.throw||((n=o.return)&&n.call(o),0):o.next)&&!(n=n.call(o,s[1])).done)return n;switch(o=0,n&&(s=[s[0]&2,n.value]),s[0]){case 0:case 1:n=s;break;case 4:return t.label++,{value:s[1],done:!1};case 5:t.label++,o=s[1],s=[0];continue;case 7:s=t.ops.pop(),t.trys.pop();continue;default:if(n=t.trys,!(n=n.length>0&&n[n.length-1])&&(s[0]===6||s[0]===2)){t=0;continue}if(s[0]===3&&(!n||s[1]>n[0]&&s[1]<n[3])){t.label=s[1];break}if(s[0]===6&&t.label<n[1]){t.label=n[1],n=s;break}if(n&&t.label<n[2]){t.label=n[2],t.ops.push(s);break}n[2]&&t.ops.pop(),t.trys.pop();continue}s=r.call(e,t)}catch(f){s=[6,f],o=0}finally{i=n=0}if(s[0]&5)throw s[1];return{value:s[0]?s[1]:void 0,done:!0}}}function m(e){var r=typeof Symbol=="function"&&Symbol.iterator,t=r&&e[r],i=0;if(t)return t.call(e);if(e&&typeof e.length=="number")return{next:function(){return e&&i>=e.length&&(e=void 0),{value:e&&e[i++],done:!e}}};throw new TypeError(r?"Object is not iterable.":"Symbol.iterator is not defined.")}function S(e,r){var t=typeof Symbol=="function"&&e[Symbol.iterator];if(!t)return e;var i=t.call(e),o,n=[],a;try{for(;(r===void 0||r-- >0)&&!(o=i.next()).done;)n.push(o.value)}catch(c){a={error:c}}finally{try{o&&!o.done&&(t=i.return)&&t.call(i)}finally{if(a)throw a.error}}return n}function w(e,r,t){if(t||arguments.length===2)for(var i=0,o=r.length,n;i<o;i++)(n||!(i in r))&&(n||(n=Array.prototype.slice.call(r,0,i)),n[i]=r[i]);return e.concat(n||Array.prototype.slice.call(r))}function x(e){return this instanceof x?(this.v=e,this):new x(e)}function nt(e,r,t){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var i=t.apply(e,r||[]),o,n=[];return o={},a("next"),a("throw"),a("return"),o[Symbol.asyncIterator]=function(){return this},o;function a(l){i[l]&&(o[l]=function(p){return new Promise(function(v,h){n.push([l,p,v,h])>1||c(l,p)})})}function c(l,p){try{u(i[l](p))}catch(v){d(n[0][3],v)}}function u(l){l.value instanceof x?Promise.resolve(l.value.v).then(s,f):d(n[0][2],l)}function s(l){c("next",l)}function f(l){c("throw",l)}function d(l,p){l(p),n.shift(),n.length&&c(n[0][0],n[0][1])}}function it(e){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var r=e[Symbol.asyncIterator],t;return r?r.call(e):(e=typeof m=="function"?m(e):e[Symbol.iterator](),t={},i("next"),i("throw"),i("return"),t[Symbol.asyncIterator]=function(){return this},t);function i(n){t[n]=e[n]&&function(a){return new Promise(function(c,u){a=e[n](a),o(c,u,a.done,a.value)})}}function o(n,a,c,u){Promise.resolve(u).then(function(s){n({value:s,done:c})},a)}}function y(e){return typeof e=="function"}function B(e){var r=function(i){Error.call(i),i.stack=new Error().stack},t=e(r);return t.prototype=Object.create(Error.prototype),t.prototype.constructor=t,t}var _=B(function(e){return function(t){e(this),this.message=t?t.length+` errors occurred during unsubscription:
`+t.map(function(i,o){return o+1+") "+i.toString()}).join(`
  `):"",this.name="UnsubscriptionError",this.errors=t}});function U(e,r){if(e){var t=e.indexOf(r);0<=t&&e.splice(t,1)}}var O=function(){function e(r){this.initialTeardown=r,this.closed=!1,this._parentage=null,this._finalizers=null}return e.prototype.unsubscribe=function(){var r,t,i,o,n;if(!this.closed){this.closed=!0;var a=this._parentage;if(a)if(this._parentage=null,Array.isArray(a))try{for(var c=m(a),u=c.next();!u.done;u=c.next()){var s=u.value;s.remove(this)}}catch(h){r={error:h}}finally{try{u&&!u.done&&(t=c.return)&&t.call(c)}finally{if(r)throw r.error}}else a.remove(this);var f=this.initialTeardown;if(y(f))try{f()}catch(h){n=h instanceof _?h.errors:[h]}var d=this._finalizers;if(d){this._finalizers=null;try{for(var l=m(d),p=l.next();!p.done;p=l.next()){var v=p.value;try{I(v)}catch(h){n=n!=null?n:[],h instanceof _?n=w(w([],S(n)),S(h.errors)):n.push(h)}}}catch(h){i={error:h}}finally{try{p&&!p.done&&(o=l.return)&&o.call(l)}finally{if(i)throw i.error}}}if(n)throw new _(n)}},e.prototype.add=function(r){var t;if(r&&r!==this)if(this.closed)I(r);else{if(r instanceof e){if(r.closed||r._hasParent(this))return;r._addParent(this)}(this._finalizers=(t=this._finalizers)!==null&&t!==void 0?t:[]).push(r)}},e.prototype._hasParent=function(r){var t=this._parentage;return t===r||Array.isArray(t)&&t.includes(r)},e.prototype._addParent=function(r){var t=this._parentage;this._parentage=Array.isArray(t)?(t.push(r),t):t?[t,r]:r},e.prototype._removeParent=function(r){var t=this._parentage;t===r?this._parentage=null:Array.isArray(t)&&U(t,r)},e.prototype.remove=function(r){var t=this._finalizers;t&&U(t,r),r instanceof e&&r._removeParent(this)},e.EMPTY=function(){var r=new e;return r.closed=!0,r}(),e}(),ot=O.EMPTY;function G(e){return e instanceof O||e&&"closed"in e&&y(e.remove)&&y(e.add)&&y(e.unsubscribe)}function I(e){y(e)?e():e.unsubscribe()}var k={onUnhandledError:null,onStoppedNotification:null,Promise:void 0,useDeprecatedSynchronousErrorHandling:!1,useDeprecatedNextContext:!1},P={setTimeout:function(e,r){for(var t=[],i=2;i<arguments.length;i++)t[i-2]=arguments[i];var o=P.delegate;return o!=null&&o.setTimeout?o.setTimeout.apply(o,w([e,r],S(t))):setTimeout.apply(void 0,w([e,r],S(t)))},clearTimeout:function(e){var r=P.delegate;return((r==null?void 0:r.clearTimeout)||clearTimeout)(e)},delegate:void 0};function V(e){P.setTimeout(function(){var r=k.onUnhandledError;if(r)r(e);else throw e})}function L(){}var j=function(e){T(r,e);function r(t){var i=e.call(this)||this;return i.isStopped=!1,t?(i.destination=t,G(t)&&t.add(i)):i.destination=W,i}return r.create=function(t,i,o){return new z(t,i,o)},r.prototype.next=function(t){this.isStopped||this._next(t)},r.prototype.error=function(t){this.isStopped||(this.isStopped=!0,this._error(t))},r.prototype.complete=function(){this.isStopped||(this.isStopped=!0,this._complete())},r.prototype.unsubscribe=function(){this.closed||(this.isStopped=!0,e.prototype.unsubscribe.call(this),this.destination=null)},r.prototype._next=function(t){this.destination.next(t)},r.prototype._error=function(t){try{this.destination.error(t)}finally{this.unsubscribe()}},r.prototype._complete=function(){try{this.destination.complete()}finally{this.unsubscribe()}},r}(O),$=Function.prototype.bind;function g(e,r){return $.call(e,r)}var H=function(){function e(r){this.partialObserver=r}return e.prototype.next=function(r){var t=this.partialObserver;if(t.next)try{t.next(r)}catch(i){b(i)}},e.prototype.error=function(r){var t=this.partialObserver;if(t.error)try{t.error(r)}catch(i){b(i)}else b(r)},e.prototype.complete=function(){var r=this.partialObserver;if(r.complete)try{r.complete()}catch(t){b(t)}},e}(),z=function(e){T(r,e);function r(t,i,o){var n=e.call(this)||this,a;if(y(t)||!t)a={next:t!=null?t:void 0,error:i!=null?i:void 0,complete:o!=null?o:void 0};else{var c;n&&k.useDeprecatedNextContext?(c=Object.create(t),c.unsubscribe=function(){return n.unsubscribe()},a={next:t.next&&g(t.next,c),error:t.error&&g(t.error,c),complete:t.complete&&g(t.complete,c)}):a=t}return n.destination=new H(a),n}return r}(j);function b(e){V(e)}function K(e){throw e}var W={closed:!0,next:L,error:K,complete:L};function J(e){return e}function Q(e){return y(e==null?void 0:e.lift)}function C(e){return function(r){if(Q(r))return r.lift(function(t){try{return e(t,this)}catch(i){this.error(i)}});throw new TypeError("Unable to lift unknown Observable type")}}function R(e,r,t,i,o){return new X(e,r,t,i,o)}var X=function(e){T(r,e);function r(t,i,o,n,a,c){var u=e.call(this,t)||this;return u.onFinalize=a,u.shouldUnsubscribe=c,u._next=i?function(s){try{i(s)}catch(f){t.error(f)}}:e.prototype._next,u._error=n?function(s){try{n(s)}catch(f){t.error(f)}finally{this.unsubscribe()}}:e.prototype._error,u._complete=o?function(){try{o()}catch(s){t.error(s)}finally{this.unsubscribe()}}:e.prototype._complete,u}return r.prototype.unsubscribe=function(){var t;if(!this.shouldUnsubscribe||this.shouldUnsubscribe()){var i=this.closed;e.prototype.unsubscribe.call(this),!i&&((t=this.onFinalize)===null||t===void 0||t.call(this))}},r}(j);function Z(e,r){return C(function(t,i){var o=0;t.subscribe(R(i,function(n){i.next(e.call(r,n,o++))}))})}function N(e,r,t){var i=y(e)||r||t?{next:e,error:r,complete:t}:e;return i?C(function(o,n){var a;(a=i.subscribe)===null||a===void 0||a.call(i);var c=!0;o.subscribe(R(n,function(u){var s;(s=i.next)===null||s===void 0||s.call(i,u),n.next(u)},function(){var u;c=!1,(u=i.complete)===null||u===void 0||u.call(i),n.complete()},function(u){var s;c=!1,(s=i.error)===null||s===void 0||s.call(i,u),n.error(u)},function(){var u,s;c&&((u=i.unsubscribe)===null||u===void 0||u.call(i)),(s=i.finalize)===null||s===void 0||s.call(i)}))}):J}const st=(e,r)=>[e,r],at=(e,r,t=1)=>Array.from({length:(r-e)/t+1},(i,o)=>e+o*t),tt=(e,r)=>{if(!e)throw r instanceof Error?r:new Error(r||"Assertion failed")},ct=e=>{const r=e.split(`
`),t=r[0].split(",");return r.slice(1).map(o=>{const n=o.split(",");return t.reduce((a,c,u)=>{var s;return Object.assign(a,{[c.trim()]:(s=n[u])==null?void 0:s.trim()})},{})})},ut=(e="log")=>N(console[e]),lt=e=>e.pipe(Z(r=>t=>r.reduce((i,o)=>o(i),t))),F=document.querySelector("#app");tt(F,"No app element found");Y(()=>import("./App.41fc72ad.js").then(e=>e.A),["App.41fc72ad.js","App.96de50ac.css"],import.meta.url).then(({default:e})=>new e({target:F}));export{st as A,ut as B,ot as E,z as S,T as _,j as a,G as b,k as c,y as d,B as e,O as f,U as g,m as h,J as i,nt as j,rt as k,x as l,et as m,it as n,C as o,R as p,Z as q,V as r,w as s,S as t,Y as u,ct as v,tt as w,N as x,at as y,lt as z};
