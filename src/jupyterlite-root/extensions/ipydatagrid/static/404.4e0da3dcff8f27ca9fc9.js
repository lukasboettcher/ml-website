"use strict";(self.webpackChunkipydatagrid=self.webpackChunkipydatagrid||[]).push([[404],{8404:(n,t,r)=>{r.r(t),r.d(t,{scaleBand:()=>c,scaleDiverging:()=>Pn,scaleDivergingLog:()=>En,scaleDivergingPow:()=>Un,scaleDivergingSqrt:()=>Cn,scaleDivergingSymlog:()=>Ln,scaleIdentity:()=>q,scaleImplicit:()=>o,scaleLinear:()=>S,scaleLog:()=>B,scaleOrdinal:()=>a,scalePoint:()=>f,scalePow:()=>G,scaleQuantile:()=>W,scaleQuantize:()=>X,scaleRadial:()=>V,scaleSequential:()=>Dn,scaleSequentialLog:()=>On,scaleSequentialPow:()=>Yn,scaleSequentialQuantile:()=>Rn,scaleSequentialSqrt:()=>Fn,scaleSequentialSymlog:()=>In,scaleSqrt:()=>H,scaleSymlog:()=>U,scaleThreshold:()=>$,scaleTime:()=>bn,scaleUtc:()=>Sn,tickFormat:()=>Z});var e=r(1573);function u(n,t){switch(arguments.length){case 0:break;case 1:this.range(n);break;default:this.range(t).domain(n)}return this}function i(n,t){switch(arguments.length){case 0:break;case 1:"function"==typeof n?this.interpolator(n):this.range(n);break;default:this.domain(n),"function"==typeof t?this.interpolator(t):this.range(t)}return this}const o=Symbol("implicit");function a(){var n=new e.InternMap,t=[],r=[],i=o;function c(e){let u=n.get(e);if(void 0===u){if(i!==o)return i;n.set(e,u=t.push(e)-1)}return r[u%r.length]}return c.domain=function(r){if(!arguments.length)return t.slice();t=[],n=new e.InternMap;for(const e of r)n.has(e)||n.set(e,t.push(e)-1);return c},c.range=function(n){return arguments.length?(r=Array.from(n),c):r.slice()},c.unknown=function(n){return arguments.length?(i=n,c):i},c.copy=function(){return a(t,r).unknown(i)},u.apply(c,arguments),c}function c(){var n,t,r=a().unknown(void 0),i=r.domain,o=r.range,l=0,f=1,s=!1,h=0,p=0,g=.5;function m(){var r=i().length,u=f<l,a=u?f:l,c=u?l:f;n=(c-a)/Math.max(1,r-h+2*p),s&&(n=Math.floor(n)),a+=(c-a-n*(r-h))*g,t=n*(1-h),s&&(a=Math.round(a),t=Math.round(t));var m=(0,e.range)(r).map((function(t){return a+n*t}));return o(u?m.reverse():m)}return delete r.unknown,r.domain=function(n){return arguments.length?(i(n),m()):i()},r.range=function(n){return arguments.length?([l,f]=n,l=+l,f=+f,m()):[l,f]},r.rangeRound=function(n){return[l,f]=n,l=+l,f=+f,s=!0,m()},r.bandwidth=function(){return t},r.step=function(){return n},r.round=function(n){return arguments.length?(s=!!n,m()):s},r.padding=function(n){return arguments.length?(h=Math.min(1,p=+n),m()):h},r.paddingInner=function(n){return arguments.length?(h=Math.min(1,n),m()):h},r.paddingOuter=function(n){return arguments.length?(p=+n,m()):p},r.align=function(n){return arguments.length?(g=Math.max(0,Math.min(1,n)),m()):g},r.copy=function(){return c(i(),[l,f]).round(s).paddingInner(h).paddingOuter(p).align(g)},u.apply(m(),arguments)}function l(n){var t=n.copy;return n.padding=n.paddingOuter,delete n.paddingInner,delete n.paddingOuter,n.copy=function(){return l(t())},n}function f(){return l(c.apply(null,arguments).paddingInner(1))}var s=r(1265),h=r(3626),p=r(5720);function g(n){return+n}var m=[0,1];function d(n){return n}function y(n,t){return(t-=n=+n)?function(r){return(r-n)/t}:(r=isNaN(t)?NaN:.5,function(){return r});var r}function v(n,t,r){var e=n[0],u=n[1],i=t[0],o=t[1];return u<e?(e=y(u,e),i=r(o,i)):(e=y(e,u),i=r(i,o)),function(n){return i(e(n))}}function M(n,t,r){var u=Math.min(n.length,t.length)-1,i=new Array(u),o=new Array(u),a=-1;for(n[u]<n[0]&&(n=n.slice().reverse(),t=t.slice().reverse());++a<u;)i[a]=y(n[a],n[a+1]),o[a]=r(t[a],t[a+1]);return function(t){var r=(0,e.bisect)(n,t,1,u)-1;return o[r](i[r](t))}}function k(n,t){return t.domain(n.domain()).range(n.range()).interpolate(n.interpolate()).clamp(n.clamp()).unknown(n.unknown())}function w(){var n,t,r,e,u,i,o=m,a=m,c=s.Z,l=d;function f(){var n,t,r,c=Math.min(o.length,a.length);return l!==d&&(n=o[0],t=o[c-1],n>t&&(r=n,n=t,t=r),l=function(r){return Math.max(n,Math.min(t,r))}),e=c>2?M:v,u=i=null,y}function y(t){return null==t||isNaN(t=+t)?r:(u||(u=e(o.map(n),a,c)))(n(l(t)))}return y.invert=function(r){return l(t((i||(i=e(a,o.map(n),h.Z)))(r)))},y.domain=function(n){return arguments.length?(o=Array.from(n,g),f()):o.slice()},y.range=function(n){return arguments.length?(a=Array.from(n),f()):a.slice()},y.rangeRound=function(n){return a=Array.from(n),c=p.Z,f()},y.clamp=function(n){return arguments.length?(l=!!n||d,f()):l!==d},y.interpolate=function(n){return arguments.length?(c=n,f()):c},y.unknown=function(n){return arguments.length?(r=n,y):r},function(r,e){return n=r,t=e,f()}}function N(){return w()(d,d)}var x=r(5551);function Z(n,t,r,u){var i,o=(0,e.tickStep)(n,t,r);switch((u=(0,x.formatSpecifier)(null==u?",f":u)).type){case"s":var a=Math.max(Math.abs(n),Math.abs(t));return null!=u.precision||isNaN(i=(0,x.precisionPrefix)(o,a))||(u.precision=i),(0,x.formatPrefix)(u,a);case"":case"e":case"g":case"p":case"r":null!=u.precision||isNaN(i=(0,x.precisionRound)(o,Math.max(Math.abs(n),Math.abs(t))))||(u.precision=i-("e"===u.type));break;case"f":case"%":null!=u.precision||isNaN(i=(0,x.precisionFixed)(o))||(u.precision=i-2*("%"===u.type))}return(0,x.format)(u)}function b(n){var t=n.domain;return n.ticks=function(n){var r=t();return(0,e.ticks)(r[0],r[r.length-1],null==n?10:n)},n.tickFormat=function(n,r){var e=t();return Z(e[0],e[e.length-1],null==n?10:n,r)},n.nice=function(r){null==r&&(r=10);var u,i,o=t(),a=0,c=o.length-1,l=o[a],f=o[c],s=10;for(f<l&&(i=l,l=f,f=i,i=a,a=c,c=i);s-- >0;){if((i=(0,e.tickIncrement)(l,f,r))===u)return o[a]=l,o[c]=f,t(o);if(i>0)l=Math.floor(l/i)*i,f=Math.ceil(f/i)*i;else{if(!(i<0))break;l=Math.ceil(l*i)/i,f=Math.floor(f*i)/i}u=i}return n},n}function S(){var n=N();return n.copy=function(){return k(n,S())},u.apply(n,arguments),b(n)}function q(n){var t;function r(n){return null==n||isNaN(n=+n)?t:n}return r.invert=r,r.domain=r.range=function(t){return arguments.length?(n=Array.from(t,g),r):n.slice()},r.unknown=function(n){return arguments.length?(t=n,r):t},r.copy=function(){return q(n).unknown(t)},n=arguments.length?Array.from(n,g):[0,1],b(r)}function A(n,t){var r,e=0,u=(n=n.slice()).length-1,i=n[e],o=n[u];return o<i&&(r=e,e=u,u=r,r=i,i=o,o=r),n[e]=t.floor(i),n[u]=t.ceil(o),n}function D(n){return Math.log(n)}function O(n){return Math.exp(n)}function I(n){return-Math.log(-n)}function Y(n){return-Math.exp(-n)}function F(n){return isFinite(n)?+("1e"+n):n<0?0:n}function R(n){return(t,r)=>-n(-t,r)}function z(n){const t=n(D,O),r=t.domain;let u,i,o=10;function a(){return u=function(n){return n===Math.E?Math.log:10===n&&Math.log10||2===n&&Math.log2||(n=Math.log(n),t=>Math.log(t)/n)}(o),i=function(n){return 10===n?F:n===Math.E?Math.exp:t=>Math.pow(n,t)}(o),r()[0]<0?(u=R(u),i=R(i),n(I,Y)):n(D,O),t}return t.base=function(n){return arguments.length?(o=+n,a()):o},t.domain=function(n){return arguments.length?(r(n),a()):r()},t.ticks=n=>{const t=r();let a=t[0],c=t[t.length-1];const l=c<a;l&&([a,c]=[c,a]);let f,s,h=u(a),p=u(c);const g=null==n?10:+n;let m=[];if(!(o%1)&&p-h<g){if(h=Math.floor(h),p=Math.ceil(p),a>0){for(;h<=p;++h)for(f=1;f<o;++f)if(s=h<0?f/i(-h):f*i(h),!(s<a)){if(s>c)break;m.push(s)}}else for(;h<=p;++h)for(f=o-1;f>=1;--f)if(s=h>0?f/i(-h):f*i(h),!(s<a)){if(s>c)break;m.push(s)}2*m.length<g&&(m=(0,e.ticks)(a,c,g))}else m=(0,e.ticks)(h,p,Math.min(p-h,g)).map(i);return l?m.reverse():m},t.tickFormat=(n,r)=>{if(null==n&&(n=10),null==r&&(r=10===o?"s":","),"function"!=typeof r&&(o%1||null!=(r=(0,x.formatSpecifier)(r)).precision||(r.trim=!0),r=(0,x.format)(r)),n===1/0)return r;const e=Math.max(1,o*n/t.ticks().length);return n=>{let t=n/i(Math.round(u(n)));return t*o<o-.5&&(t*=o),t<=e?r(n):""}},t.nice=()=>r(A(r(),{floor:n=>i(Math.floor(u(n))),ceil:n=>i(Math.ceil(u(n)))})),t}function B(){const n=z(w()).domain([1,10]);return n.copy=()=>k(n,B()).base(n.base()),u.apply(n,arguments),n}function P(n){return function(t){return Math.sign(t)*Math.log1p(Math.abs(t/n))}}function E(n){return function(t){return Math.sign(t)*Math.expm1(Math.abs(t))*n}}function L(n){var t=1,r=n(P(t),E(t));return r.constant=function(r){return arguments.length?n(P(t=+r),E(t)):t},b(r)}function U(){var n=L(w());return n.copy=function(){return k(n,U()).constant(n.constant())},u.apply(n,arguments)}function C(n){return function(t){return t<0?-Math.pow(-t,n):Math.pow(t,n)}}function T(n){return n<0?-Math.sqrt(-n):Math.sqrt(n)}function Q(n){return n<0?-n*n:n*n}function j(n){var t=n(d,d),r=1;function e(){return 1===r?n(d,d):.5===r?n(T,Q):n(C(r),C(1/r))}return t.exponent=function(n){return arguments.length?(r=+n,e()):r},b(t)}function G(){var n=j(w());return n.copy=function(){return k(n,G()).exponent(n.exponent())},u.apply(n,arguments),n}function H(){return G.apply(null,arguments).exponent(.5)}function J(n){return Math.sign(n)*n*n}function K(n){return Math.sign(n)*Math.sqrt(Math.abs(n))}function V(){var n,t=N(),r=[0,1],e=!1;function i(r){var u=K(t(r));return isNaN(u)?n:e?Math.round(u):u}return i.invert=function(n){return t.invert(J(n))},i.domain=function(n){return arguments.length?(t.domain(n),i):t.domain()},i.range=function(n){return arguments.length?(t.range((r=Array.from(n,g)).map(J)),i):r.slice()},i.rangeRound=function(n){return i.range(n).round(!0)},i.round=function(n){return arguments.length?(e=!!n,i):e},i.clamp=function(n){return arguments.length?(t.clamp(n),i):t.clamp()},i.unknown=function(t){return arguments.length?(n=t,i):n},i.copy=function(){return V(t.domain(),r).round(e).clamp(t.clamp()).unknown(n)},u.apply(i,arguments),b(i)}function W(){var n,t=[],r=[],i=[];function o(){var n=0,u=Math.max(1,r.length);for(i=new Array(u-1);++n<u;)i[n-1]=(0,e.quantileSorted)(t,n/u);return a}function a(t){return null==t||isNaN(t=+t)?n:r[(0,e.bisect)(i,t)]}return a.invertExtent=function(n){var e=r.indexOf(n);return e<0?[NaN,NaN]:[e>0?i[e-1]:t[0],e<i.length?i[e]:t[t.length-1]]},a.domain=function(n){if(!arguments.length)return t.slice();t=[];for(let r of n)null==r||isNaN(r=+r)||t.push(r);return t.sort(e.ascending),o()},a.range=function(n){return arguments.length?(r=Array.from(n),o()):r.slice()},a.unknown=function(t){return arguments.length?(n=t,a):n},a.quantiles=function(){return i.slice()},a.copy=function(){return W().domain(t).range(r).unknown(n)},u.apply(a,arguments)}function X(){var n,t=0,r=1,i=1,o=[.5],a=[0,1];function c(t){return null!=t&&t<=t?a[(0,e.bisect)(o,t,0,i)]:n}function l(){var n=-1;for(o=new Array(i);++n<i;)o[n]=((n+1)*r-(n-i)*t)/(i+1);return c}return c.domain=function(n){return arguments.length?([t,r]=n,t=+t,r=+r,l()):[t,r]},c.range=function(n){return arguments.length?(i=(a=Array.from(n)).length-1,l()):a.slice()},c.invertExtent=function(n){var e=a.indexOf(n);return e<0?[NaN,NaN]:e<1?[t,o[0]]:e>=i?[o[i-1],r]:[o[e-1],o[e]]},c.unknown=function(t){return arguments.length?(n=t,c):c},c.thresholds=function(){return o.slice()},c.copy=function(){return X().domain([t,r]).range(a).unknown(n)},u.apply(b(c),arguments)}function $(){var n,t=[.5],r=[0,1],i=1;function o(u){return null!=u&&u<=u?r[(0,e.bisect)(t,u,0,i)]:n}return o.domain=function(n){return arguments.length?(t=Array.from(n),i=Math.min(t.length,r.length-1),o):t.slice()},o.range=function(n){return arguments.length?(r=Array.from(n),i=Math.min(t.length,r.length-1),o):r.slice()},o.invertExtent=function(n){var e=r.indexOf(n);return[t[e-1],t[e]]},o.unknown=function(t){return arguments.length?(n=t,o):n},o.copy=function(){return $().domain(t).range(r).unknown(n)},u.apply(o,arguments)}var _=r(7879),nn=r(1222),tn=r(8179),rn=r(5086),en=r(7197),un=r(2784),on=r(9478),an=r(2776),cn=r(4584),ln=r(2209),fn=r(4878),sn=r(590),hn=r(9692),pn=r(7326),gn=r(7512),mn=r(1181);function dn(n,t,r,e,u,i){const o=[[rn.Z,1,nn.Ym],[rn.Z,5,5*nn.Ym],[rn.Z,15,15*nn.Ym],[rn.Z,30,30*nn.Ym],[i,1,nn.yB],[i,5,5*nn.yB],[i,15,15*nn.yB],[i,30,30*nn.yB],[u,1,nn.Y2],[u,3,3*nn.Y2],[u,6,6*nn.Y2],[u,12,12*nn.Y2],[e,1,nn.UD],[e,2,2*nn.UD],[r,1,nn.iM],[t,1,nn.jz],[t,3,3*nn.jz],[n,1,nn.qz]];function a(t,r,e){const u=Math.abs(r-t)/e,i=(0,_.bisector)((([,,n])=>n)).right(o,u);if(i===o.length)return n.every((0,_.tickStep)(t/nn.qz,r/nn.qz,e));if(0===i)return tn.Z.every(Math.max((0,_.tickStep)(t,r,e),1));const[a,c]=o[u/o[i-1][2]<o[i][2]/u?i-1:i];return a.every(c)}return[function(n,t,r){const e=t<n;e&&([n,t]=[t,n]);const u=r&&"function"==typeof r.range?r:a(n,t,r),i=u?u.range(n,+t+1):[];return e?i.reverse():i},a]}const[yn,vn]=dn(mn.Z,gn.Z,pn.Ox,hn.Z,sn.Z,fn.Z),[Mn,kn]=dn(ln.Z,cn.Z,an.OM,on.Z,un.Z,en.Z);var wn=r(4603);function Nn(n){return new Date(n)}function xn(n){return n instanceof Date?+n:+new Date(+n)}function Zn(n,t,r,e,u,i,o,a,c,l){var f=N(),s=f.invert,h=f.domain,p=l(".%L"),g=l(":%S"),m=l("%I:%M"),d=l("%I %p"),y=l("%a %d"),v=l("%b %d"),M=l("%B"),w=l("%Y");function x(n){return(c(n)<n?p:a(n)<n?g:o(n)<n?m:i(n)<n?d:e(n)<n?u(n)<n?y:v:r(n)<n?M:w)(n)}return f.invert=function(n){return new Date(s(n))},f.domain=function(n){return arguments.length?h(Array.from(n,xn)):h().map(Nn)},f.ticks=function(t){var r=h();return n(r[0],r[r.length-1],null==t?10:t)},f.tickFormat=function(n,t){return null==t?x:l(t)},f.nice=function(n){var r=h();return n&&"function"==typeof n.range||(n=t(r[0],r[r.length-1],null==n?10:n)),n?h(A(r,n)):f},f.copy=function(){return k(f,Zn(n,t,r,e,u,i,o,a,c,l))},f}function bn(){return u.apply(Zn(Mn,kn,ln.Z,cn.Z,an.OM,on.Z,un.Z,en.Z,rn.Z,wn.timeFormat).domain([new Date(2e3,0,1),new Date(2e3,0,2)]),arguments)}function Sn(){return u.apply(Zn(yn,vn,mn.Z,gn.Z,pn.Ox,hn.Z,sn.Z,fn.Z,rn.Z,wn.utcFormat).domain([Date.UTC(2e3,0,1),Date.UTC(2e3,0,2)]),arguments)}function qn(){var n,t,r,e,u,i=0,o=1,a=d,c=!1;function l(t){return null==t||isNaN(t=+t)?u:a(0===r?.5:(t=(e(t)-n)*r,c?Math.max(0,Math.min(1,t)):t))}function f(n){return function(t){var r,e;return arguments.length?([r,e]=t,a=n(r,e),l):[a(0),a(1)]}}return l.domain=function(u){return arguments.length?([i,o]=u,n=e(i=+i),t=e(o=+o),r=n===t?0:1/(t-n),l):[i,o]},l.clamp=function(n){return arguments.length?(c=!!n,l):c},l.interpolator=function(n){return arguments.length?(a=n,l):a},l.range=f(s.Z),l.rangeRound=f(p.Z),l.unknown=function(n){return arguments.length?(u=n,l):u},function(u){return e=u,n=u(i),t=u(o),r=n===t?0:1/(t-n),l}}function An(n,t){return t.domain(n.domain()).interpolator(n.interpolator()).clamp(n.clamp()).unknown(n.unknown())}function Dn(){var n=b(qn()(d));return n.copy=function(){return An(n,Dn())},i.apply(n,arguments)}function On(){var n=z(qn()).domain([1,10]);return n.copy=function(){return An(n,On()).base(n.base())},i.apply(n,arguments)}function In(){var n=L(qn());return n.copy=function(){return An(n,In()).constant(n.constant())},i.apply(n,arguments)}function Yn(){var n=j(qn());return n.copy=function(){return An(n,Yn()).exponent(n.exponent())},i.apply(n,arguments)}function Fn(){return Yn.apply(null,arguments).exponent(.5)}function Rn(){var n=[],t=d;function r(r){if(null!=r&&!isNaN(r=+r))return t(((0,e.bisect)(n,r,1)-1)/(n.length-1))}return r.domain=function(t){if(!arguments.length)return n.slice();n=[];for(let r of t)null==r||isNaN(r=+r)||n.push(r);return n.sort(e.ascending),r},r.interpolator=function(n){return arguments.length?(t=n,r):t},r.range=function(){return n.map(((r,e)=>t(e/(n.length-1))))},r.quantiles=function(t){return Array.from({length:t+1},((r,u)=>(0,e.quantile)(n,u/t)))},r.copy=function(){return Rn(t).domain(n)},i.apply(r,arguments)}var zn=r(108);function Bn(){var n,t,r,e,u,i,o,a=0,c=.5,l=1,f=1,h=d,g=!1;function m(n){return isNaN(n=+n)?o:(n=.5+((n=+i(n))-t)*(f*n<f*t?e:u),h(g?Math.max(0,Math.min(1,n)):n))}function y(n){return function(t){var r,e,u;return arguments.length?([r,e,u]=t,h=(0,zn.Z)(n,[r,e,u]),m):[h(0),h(.5),h(1)]}}return m.domain=function(o){return arguments.length?([a,c,l]=o,n=i(a=+a),t=i(c=+c),r=i(l=+l),e=n===t?0:.5/(t-n),u=t===r?0:.5/(r-t),f=t<n?-1:1,m):[a,c,l]},m.clamp=function(n){return arguments.length?(g=!!n,m):g},m.interpolator=function(n){return arguments.length?(h=n,m):h},m.range=y(s.Z),m.rangeRound=y(p.Z),m.unknown=function(n){return arguments.length?(o=n,m):o},function(o){return i=o,n=o(a),t=o(c),r=o(l),e=n===t?0:.5/(t-n),u=t===r?0:.5/(r-t),f=t<n?-1:1,m}}function Pn(){var n=b(Bn()(d));return n.copy=function(){return An(n,Pn())},i.apply(n,arguments)}function En(){var n=z(Bn()).domain([.1,1,10]);return n.copy=function(){return An(n,En()).base(n.base())},i.apply(n,arguments)}function Ln(){var n=L(Bn());return n.copy=function(){return An(n,Ln()).constant(n.constant())},i.apply(n,arguments)}function Un(){var n=j(Bn());return n.copy=function(){return An(n,Un()).exponent(n.exponent())},i.apply(n,arguments)}function Cn(){return Un.apply(null,arguments).exponent(.5)}}}]);