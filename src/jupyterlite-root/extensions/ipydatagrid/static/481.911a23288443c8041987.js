"use strict";(self.webpackChunkipydatagrid=self.webpackChunkipydatagrid||[]).push([[481],{8481:(t,n,i)=>{function r(t,n){if((i=(t=n?t.toExponential(n-1):t.toExponential()).indexOf("e"))<0)return null;var i,r=t.slice(0,i);return[r.length>1?r[0]+r.slice(2):r,+t.slice(i+1)]}function e(t){return(t=r(Math.abs(t)))?t[1]:NaN}i.r(n),i.d(n,{FormatSpecifier:()=>c,format:()=>m,formatDefaultLocale:()=>M,formatLocale:()=>v,formatPrefix:()=>d,formatSpecifier:()=>s,precisionFixed:()=>y,precisionPrefix:()=>b,precisionRound:()=>x});var o,a=/^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;function s(t){if(!(n=a.exec(t)))throw new Error("invalid format: "+t);var n;return new c({fill:n[1],align:n[2],sign:n[3],symbol:n[4],zero:n[5],width:n[6],comma:n[7],precision:n[8]&&n[8].slice(1),trim:n[9],type:n[10]})}function c(t){this.fill=void 0===t.fill?" ":t.fill+"",this.align=void 0===t.align?">":t.align+"",this.sign=void 0===t.sign?"-":t.sign+"",this.symbol=void 0===t.symbol?"":t.symbol+"",this.zero=!!t.zero,this.width=void 0===t.width?void 0:+t.width,this.comma=!!t.comma,this.precision=void 0===t.precision?void 0:+t.precision,this.trim=!!t.trim,this.type=void 0===t.type?"":t.type+""}function u(t,n){var i=r(t,n);if(!i)return t+"";var e=i[0],o=i[1];return o<0?"0."+new Array(-o).join("0")+e:e.length>o+1?e.slice(0,o+1)+"."+e.slice(o+1):e+new Array(o-e.length+2).join("0")}s.prototype=c.prototype,c.prototype.toString=function(){return this.fill+this.align+this.sign+this.symbol+(this.zero?"0":"")+(void 0===this.width?"":Math.max(1,0|this.width))+(this.comma?",":"")+(void 0===this.precision?"":"."+Math.max(0,0|this.precision))+(this.trim?"~":"")+this.type};const h={"%":function(t,n){return(100*t).toFixed(n)},b:function(t){return Math.round(t).toString(2)},c:function(t){return t+""},d:function(t){return Math.abs(t=Math.round(t))>=1e21?t.toLocaleString("en").replace(/,/g,""):t.toString(10)},e:function(t,n){return t.toExponential(n)},f:function(t,n){return t.toFixed(n)},g:function(t,n){return t.toPrecision(n)},o:function(t){return Math.round(t).toString(8)},p:function(t,n){return u(100*t,n)},r:u,s:function(t,n){var i=r(t,n);if(!i)return t+"";var e=i[0],a=i[1],s=a-(o=3*Math.max(-8,Math.min(8,Math.floor(a/3))))+1,c=e.length;return s===c?e:s>c?e+new Array(s-c+1).join("0"):s>0?e.slice(0,s)+"."+e.slice(s):"0."+new Array(1-s).join("0")+r(t,Math.max(0,n+s-1))[0]},X:function(t){return Math.round(t).toString(16).toUpperCase()},x:function(t){return Math.round(t).toString(16)}};function l(t){return t}var f,m,d,p=Array.prototype.map,g=["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"];function v(t){var n,i,r=void 0===t.grouping||void 0===t.thousands?l:(n=p.call(t.grouping,Number),i=t.thousands+"",function(t,r){for(var e=t.length,o=[],a=0,s=n[0],c=0;e>0&&s>0&&(c+s+1>r&&(s=Math.max(1,r-c)),o.push(t.substring(e-=s,e+s)),!((c+=s+1)>r));)s=n[a=(a+1)%n.length];return o.reverse().join(i)}),a=void 0===t.currency?"":t.currency[0]+"",c=void 0===t.currency?"":t.currency[1]+"",u=void 0===t.decimal?".":t.decimal+"",f=void 0===t.numerals?l:function(t){return function(n){return n.replace(/[0-9]/g,(function(n){return t[+n]}))}}(p.call(t.numerals,String)),m=void 0===t.percent?"%":t.percent+"",d=void 0===t.minus?"-":t.minus+"",v=void 0===t.nan?"NaN":t.nan+"";function M(t){var n=(t=s(t)).fill,i=t.align,e=t.sign,l=t.symbol,p=t.zero,M=t.width,y=t.comma,b=t.precision,x=t.trim,w=t.type;"n"===w?(y=!0,w="g"):h[w]||(void 0===b&&(b=12),x=!0,w="g"),(p||"0"===n&&"="===i)&&(p=!0,n="0",i="=");var k="$"===l?a:"#"===l&&/[boxX]/.test(w)?"0"+w.toLowerCase():"",S="$"===l?c:/[%p]/.test(w)?m:"",z=h[w],A=/[defgprs%]/.test(w);function N(t){var a,s,c,h=k,l=S;if("c"===w)l=z(t)+l,t="";else{var m=(t=+t)<0||1/t<0;if(t=isNaN(t)?v:z(Math.abs(t),b),x&&(t=function(t){t:for(var n,i=t.length,r=1,e=-1;r<i;++r)switch(t[r]){case".":e=n=r;break;case"0":0===e&&(e=r),n=r;break;default:if(!+t[r])break t;e>0&&(e=0)}return e>0?t.slice(0,e)+t.slice(n+1):t}(t)),m&&0==+t&&"+"!==e&&(m=!1),h=(m?"("===e?e:d:"-"===e||"("===e?"":e)+h,l=("s"===w?g[8+o/3]:"")+l+(m&&"("===e?")":""),A)for(a=-1,s=t.length;++a<s;)if(48>(c=t.charCodeAt(a))||c>57){l=(46===c?u+t.slice(a+1):t.slice(a))+l,t=t.slice(0,a);break}}y&&!p&&(t=r(t,1/0));var N=h.length+t.length+l.length,j=N<M?new Array(M-N+1).join(n):"";switch(y&&p&&(t=r(j+t,j.length?M-l.length:1/0),j=""),i){case"<":t=h+t+l+j;break;case"=":t=h+j+t+l;break;case"^":t=j.slice(0,N=j.length>>1)+h+t+l+j.slice(N);break;default:t=j+h+t+l}return f(t)}return b=void 0===b?6:/[gprs]/.test(w)?Math.max(1,Math.min(21,b)):Math.max(0,Math.min(20,b)),N.toString=function(){return t+""},N}return{format:M,formatPrefix:function(t,n){var i=M(((t=s(t)).type="f",t)),r=3*Math.max(-8,Math.min(8,Math.floor(e(n)/3))),o=Math.pow(10,-r),a=g[8+r/3];return function(t){return i(o*t)+a}}}}function M(t){return f=v(t),m=f.format,d=f.formatPrefix,f}function y(t){return Math.max(0,-e(Math.abs(t)))}function b(t,n){return Math.max(0,3*Math.max(-8,Math.min(8,Math.floor(e(n)/3)))-e(Math.abs(t)))}function x(t,n){return t=Math.abs(t),n=Math.abs(n)-t,Math.max(0,e(n)-e(t))+1}M({decimal:".",thousands:",",grouping:[3],currency:["$",""],minus:"-"})}}]);