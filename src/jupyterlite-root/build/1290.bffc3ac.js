"use strict";(self.webpackChunk_JUPYTERLAB_CORE_OUTPUT=self.webpackChunk_JUPYTERLAB_CORE_OUTPUT||[]).push([[1290,5129],{25129:(e,t,o)=>{o.r(t),o.d(t,{addCommands:()=>v,default:()=>g});var i,a=o(22715),n=o(45030),r=o(28673),l=o(49718);!function(e){e.resetImage="imageviewer:reset-image",e.zoomIn="imageviewer:zoom-in",e.zoomOut="imageviewer:zoom-out",e.flipHorizontal="imageviewer:flip-horizontal",e.flipVertical="imageviewer:flip-vertical",e.rotateClockwise="imageviewer:rotate-clockwise",e.rotateCounterclockwise="imageviewer:rotate-counterclockwise",e.invertColors="imageviewer:invert-colors"}(i||(i={}));const c=["png","gif","jpeg","bmp","ico","tiff"],d="Image",s="Image (Text)",m=["svg","xbm"],u=new RegExp(`[.](${m.join("|")})$`),g={activate:function(e,t,o,a){const l=t.load("jupyterlab");function g(t,o){var i,a;o.context.pathChanged.connect((()=>{w.save(o)})),w.add(o);const n=e.docRegistry.getFileTypesForPath(o.context.path);n.length>0&&(o.title.icon=n[0].icon,o.title.iconClass=null!==(i=n[0].iconClass)&&void 0!==i?i:"",o.title.iconLabel=null!==(a=n[0].iconLabel)&&void 0!==a?a:"")}[new r.ImageViewerFactory({name:d,modelName:"base64",fileTypes:[...c,...m],defaultFor:c,readOnly:!0}),new r.ImageViewerFactory({name:s,modelName:"text",fileTypes:m,defaultFor:m,readOnly:!0})].forEach((t=>{e.docRegistry.addWidgetFactory(t),t.widgetCreated.connect(g)}));const w=new n.WidgetTracker({namespace:"image-widget"});if(a&&a.restore(w,{command:"docmanager:open",args:e=>({path:e.context.path,factory:u.test(e.context.path)?s:d}),name:e=>e.context.path}),v(e,w,t),o){const e=l.__("Image Viewer");[i.zoomIn,i.zoomOut,i.resetImage,i.rotateClockwise,i.rotateCounterclockwise,i.flipHorizontal,i.flipVertical,i.invertColors].forEach((t=>{o.addItem({command:t,category:e})}))}return w},id:"@jupyterlab/imageviewer-extension:plugin",provides:r.IImageTracker,requires:[l.ITranslator],optional:[n.ICommandPalette,a.ILayoutRestorer],autoStart:!0};function v(e,t,o){const i=o.load("jupyterlab"),{commands:a,shell:n}=e;function r(){return null!==t.currentWidget&&t.currentWidget===n.currentWidget}a.addCommand("imageviewer:zoom-in",{execute:function(){var e;const o=null===(e=t.currentWidget)||void 0===e?void 0:e.content;o&&(o.scale=o.scale>1?o.scale+.5:2*o.scale)},label:i.__("Zoom In"),isEnabled:r}),a.addCommand("imageviewer:zoom-out",{execute:function(){var e;const o=null===(e=t.currentWidget)||void 0===e?void 0:e.content;o&&(o.scale=o.scale>1?o.scale-.5:o.scale/2)},label:i.__("Zoom Out"),isEnabled:r}),a.addCommand("imageviewer:reset-image",{execute:function(){var e;const o=null===(e=t.currentWidget)||void 0===e?void 0:e.content;o&&(o.scale=1,o.colorinversion=0,o.resetRotationFlip())},label:i.__("Reset Image"),isEnabled:r}),a.addCommand("imageviewer:rotate-clockwise",{execute:function(){var e;const o=null===(e=t.currentWidget)||void 0===e?void 0:e.content;o&&o.rotateClockwise()},label:i.__("Rotate Clockwise"),isEnabled:r}),a.addCommand("imageviewer:rotate-counterclockwise",{execute:function(){var e;const o=null===(e=t.currentWidget)||void 0===e?void 0:e.content;o&&o.rotateCounterclockwise()},label:i.__("Rotate Counterclockwise"),isEnabled:r}),a.addCommand("imageviewer:flip-horizontal",{execute:function(){var e;const o=null===(e=t.currentWidget)||void 0===e?void 0:e.content;o&&o.flipHorizontal()},label:i.__("Flip image horizontally"),isEnabled:r}),a.addCommand("imageviewer:flip-vertical",{execute:function(){var e;const o=null===(e=t.currentWidget)||void 0===e?void 0:e.content;o&&o.flipVertical()},label:i.__("Flip image vertically"),isEnabled:r}),a.addCommand("imageviewer:invert-colors",{execute:function(){var e;const o=null===(e=t.currentWidget)||void 0===e?void 0:e.content;o&&(o.colorinversion+=1,o.colorinversion%=2)},label:i.__("Invert Colors"),isEnabled:r})}}}]);
//# sourceMappingURL=1290.bffc3ac.js.map