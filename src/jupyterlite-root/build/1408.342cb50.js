"use strict";(self.webpackChunk_JUPYTERLAB_CORE_OUTPUT=self.webpackChunk_JUPYTERLAB_CORE_OUTPUT||[]).push([[1408],{31408:(e,t,o)=>{o.r(t),o.d(t,{main:()=>f});var r=o(22715),s=o(65034),l=o(34610);const a=Promise.all([o.e(9344),o.e(8698),o.e(8023)]).then(o.bind(o,88880)),n=[o.e(7226).then(o.t.bind(o,97226,23)),o.e(9189).then(o.t.bind(o,69189,23)),o.e(2466).then(o.t.bind(o,22466,23))],i=["@jupyterlab/apputils-extension:workspaces","@jupyterlab/application-extension:logo","@jupyterlab/application-extension:main","@jupyterlab/application-extension:tree-resolver","@jupyterlab/apputils-extension:resolver","@jupyterlab/docmanager-extension:download","@jupyterlab/filebrowser-extension:download","@jupyterlab/filebrowser-extension:share-file","@jupyterlab/help-extension:about"];async function c(e,t){try{return(await window._JUPYTERLAB[e].get(t))()}catch(o){throw console.warn(`Failed to create module: package: ${e}; module: ${t}`),o}}async function f(){await a;const e=[],t=[],f=[],h=[],p=[],u=[],y=JSON.parse(l.PageConfig.getOption("federated_extensions")),b=new Set;function*x(e){let t;t=e.hasOwnProperty("__esModule")?e.default:e;let o=Array.isArray(t)?t:[t];for(let e of o)l.PageConfig.Extension.isDisabled(e.id)||i.includes(e.id)||i.includes(e.id.split(":")[0])||(yield e)}y.forEach((e=>{e.liteExtension?u.push(c(e.name,e.extension)):(e.extension&&(b.add(e.name),t.push(c(e.name,e.extension))),e.mimeExtension&&(b.add(e.name),f.push(c(e.name,e.mimeExtension))),e.style&&h.push(c(e.name,e.style)))}));const j=[];if(!b.has("@jupyterlab/json-extension"))try{let e=o(72429);for(let t of x(e))j.push(t)}catch(e){console.error(e)}if(!b.has("@jupyterlab/javascript-extension"))try{let e=o(11301);for(let t of x(e))j.push(t)}catch(e){console.error(e)}if(!b.has("@jupyterlab/pdf-extension"))try{let e=o(79227);for(let t of x(e))j.push(t)}catch(e){console.error(e)}if(!b.has("@jupyterlab/vega5-extension"))try{let e=o(64684);for(let t of x(e))j.push(t)}catch(e){console.error(e)}if(!b.has("@jupyterlite/iframe-extension"))try{let e=o(73894);for(let t of x(e))j.push(t)}catch(e){console.error(e)}if((await Promise.allSettled(f)).forEach((e=>{if("fulfilled"===e.status)for(let t of x(e.value))j.push(t);else console.error(e.reason)})),!b.has("@jupyterlab/application-extension"))try{let t=o(91187);for(let o of x(t))e.push(o)}catch(e){console.error(e)}if(!b.has("@jupyterlab/apputils-extension"))try{let t=o(21925);for(let o of x(t))e.push(o)}catch(e){console.error(e)}if(!b.has("@jupyterlab/celltags-extension"))try{let t=o(90646);for(let o of x(t))e.push(o)}catch(e){console.error(e)}if(!b.has("@jupyterlab/cell-toolbar-extension"))try{let t=o(43749);for(let o of x(t))e.push(o)}catch(e){console.error(e)}if(!b.has("@jupyterlab/codemirror-extension"))try{let t=o(30473);for(let o of x(t))e.push(o)}catch(e){console.error(e)}if(!b.has("@jupyterlab/completer-extension"))try{let t=o(53695);for(let o of x(t))e.push(o)}catch(e){console.error(e)}if(!b.has("@jupyterlab/console-extension"))try{let t=o(27572);for(let o of x(t))e.push(o)}catch(e){console.error(e)}if(!b.has("@jupyterlab/csvviewer-extension"))try{let t=o(86202);for(let o of x(t))e.push(o)}catch(e){console.error(e)}if(!b.has("@jupyterlab/docmanager-extension"))try{let t=o(4345);for(let o of x(t))e.push(o)}catch(e){console.error(e)}if(!b.has("@jupyterlab/documentsearch-extension"))try{let t=o(33373);for(let o of x(t))e.push(o)}catch(e){console.error(e)}if(!b.has("@jupyterlab/filebrowser-extension"))try{let t=o(99093);for(let o of x(t))e.push(o)}catch(e){console.error(e)}if(!b.has("@jupyterlab/fileeditor-extension"))try{let t=o(19343);for(let o of x(t))e.push(o)}catch(e){console.error(e)}if(!b.has("@jupyterlab/help-extension"))try{let t=o(41615);for(let o of x(t))e.push(o)}catch(e){console.error(e)}if(!b.has("@jupyterlab/htmlviewer-extension"))try{let t=o(9884);for(let o of x(t))e.push(o)}catch(e){console.error(e)}if(!b.has("@jupyterlab/imageviewer-extension"))try{let t=o(60321);for(let o of x(t))e.push(o)}catch(e){console.error(e)}if(!b.has("@jupyterlab/inspector-extension"))try{let t=o(52703);for(let o of x(t))e.push(o)}catch(e){console.error(e)}if(!b.has("@jupyterlab/launcher-extension"))try{let t=o(44754);for(let o of x(t))e.push(o)}catch(e){console.error(e)}if(!b.has("@jupyterlab/logconsole-extension"))try{let t=o(11055);for(let o of x(t))e.push(o)}catch(e){console.error(e)}if(!b.has("@jupyterlab/mainmenu-extension"))try{let t=o(2707);for(let o of x(t))e.push(o)}catch(e){console.error(e)}if(!b.has("@jupyterlab/markdownviewer-extension"))try{let t=o(52077);for(let o of x(t))e.push(o)}catch(e){console.error(e)}if(!b.has("@jupyterlab/mathjax2-extension"))try{let t=o(59159);for(let o of x(t))e.push(o)}catch(e){console.error(e)}if(!b.has("@jupyterlab/notebook-extension"))try{let t=o(12755);for(let o of x(t))e.push(o)}catch(e){console.error(e)}if(!b.has("@jupyterlab/rendermime-extension"))try{let t=o(57619);for(let o of x(t))e.push(o)}catch(e){console.error(e)}if(!b.has("@jupyterlab/running-extension"))try{let t=o(9263);for(let o of x(t))e.push(o)}catch(e){console.error(e)}if(!b.has("@jupyterlab/settingeditor-extension"))try{let t=o(37237);for(let o of x(t))e.push(o)}catch(e){console.error(e)}if(!b.has("@jupyterlab/shortcuts-extension"))try{let t=o(15637);for(let o of x(t))e.push(o)}catch(e){console.error(e)}if(!b.has("@jupyterlab/statusbar-extension"))try{let t=o(64222);for(let o of x(t))e.push(o)}catch(e){console.error(e)}if(!b.has("@jupyterlab/theme-dark-extension"))try{let t=o(28626);for(let o of x(t))e.push(o)}catch(e){console.error(e)}if(!b.has("@jupyterlab/theme-light-extension"))try{let t=o(13405);for(let o of x(t))e.push(o)}catch(e){console.error(e)}if(!b.has("@jupyterlab/toc-extension"))try{let t=o(84004);for(let o of x(t))e.push(o)}catch(e){console.error(e)}if(!b.has("@jupyterlab/tooltip-extension"))try{let t=o(6236);for(let o of x(t))e.push(o)}catch(e){console.error(e)}if(!b.has("@jupyterlab/translation-extension"))try{let t=o(38744);for(let o of x(t))e.push(o)}catch(e){console.error(e)}if(!b.has("@jupyterlab/ui-components-extension"))try{let t=o(13566);for(let o of x(t))e.push(o)}catch(e){console.error(e)}if(!b.has("@jupyterlite/application-extension"))try{let t=o(45635);for(let o of x(t))e.push(o)}catch(e){console.error(e)}(await Promise.allSettled(t)).forEach((t=>{if("fulfilled"===t.status)for(let o of x(t.value))e.push(o);else console.error(t.reason)})),(await Promise.all(n)).forEach((e=>{for(let t of x(e))p.push(t)})),(await Promise.allSettled(u)).forEach((e=>{if("fulfilled"===e.status)for(let t of x(e.value))p.push(t);else console.error(e.reason)})),(await Promise.allSettled(h)).filter((({status:e})=>"rejected"===e)).forEach((({reason:e})=>{console.error(e)}));const d=new s.JupyterLiteServer({});d.registerPluginModules(p),await d.start();const{serviceManager:m}=d,w=new r.JupyterLab({mimeExtensions:j,serviceManager:m,disabled:i});w.name=l.PageConfig.getOption("appName")||"JupyterLite",w.registerPluginModules(e),"true"===(l.PageConfig.getOption("exposeAppInBrowser")||"").toLowerCase()&&(window.jupyterapp=w),await w.start(),await w.restored}}}]);
//# sourceMappingURL=1408.342cb50.js.map