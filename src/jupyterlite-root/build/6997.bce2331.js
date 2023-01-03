"use strict";(self.webpackChunk_JUPYTERLAB_CORE_OUTPUT=self.webpackChunk_JUPYTERLAB_CORE_OUTPUT||[]).push([[6997,5292],{96997:(t,e,s)=>{s.r(e),s.d(e,{AddWidget:()=>d,TagTool:()=>c,TagWidget:()=>r});var i=s(49718),a=s(58618),n=s(86098);class d extends n.Widget{constructor(t){super(),this.parent=null,this.input=document.createElement("input"),this.translator=t||i.nullTranslator,this._trans=this.translator.load("jupyterlab"),this.addClass("tag"),this.editing=!1,this.buildTag()}buildTag(){const t=this.input||document.createElement("input");t.value=this._trans.__("Add Tag"),t.contentEditable="true",t.className="add-tag",t.style.width="49px",this.input=t;const e=document.createElement("div");e.className="tag-holder",e.appendChild(t);const s=a.addIcon.element({tag:"span",elementPosition:"center",height:"18px",width:"18px",marginLeft:"3px",marginRight:"-5px"});this.addClass("unapplied-tag"),e.appendChild(s),this.node.appendChild(e)}onAfterAttach(){this.node.addEventListener("mousedown",this),this.input.addEventListener("keydown",this),this.input.addEventListener("focus",this),this.input.addEventListener("blur",this)}onBeforeDetach(){this.node.removeEventListener("mousedown",this),this.input.removeEventListener("keydown",this),this.input.removeEventListener("focus",this),this.input.removeEventListener("blur",this)}handleEvent(t){switch(t.type){case"mousedown":this._evtMouseDown(t);break;case"keydown":this._evtKeyDown(t);break;case"blur":this._evtBlur();break;case"focus":this._evtFocus()}}_evtMouseDown(t){if(this.editing){if(t.target!==this.input&&""!==this.input.value){const t=this.input.value;this.parent.addTag(t),this.input.blur(),this._evtBlur()}}else this.editing=!0,this.input.value="",this.input.focus();t.preventDefault()}_evtFocus(){this.editing||this.input.blur()}_evtKeyDown(t){const e=document.createElement("span");if(e.className="add-tag",e.innerHTML=this.input.value,document.body.appendChild(e),this.input.style.width=e.getBoundingClientRect().width+8+"px",document.body.removeChild(e),13===t.keyCode){const t=this.input.value;this.parent.addTag(t),this.input.blur(),this._evtBlur()}}_evtBlur(){this.editing&&(this.editing=!1,this.input.value=this._trans.__("Add Tag"),this.input.style.width="49px")}}var l=s(5997),o=s(43892),h=s(32798);class r extends n.Widget{constructor(t){super(),this.parent=null,this.applied=!0,this.name=t,this.addClass("tag"),this.buildTag()}buildTag(){const t=document.createElement("span");t.textContent=this.name,t.style.textOverflow="ellipsis";const e=document.createElement("div");e.className="tag-holder",e.appendChild(t);const s=a.checkIcon.element({tag:"span",elementPosition:"center",height:"18px",width:"18px",marginLeft:"5px",marginRight:"-3px"});this.applied?this.addClass("applied-tag"):(this.addClass("unapplied-tag"),s.style.display="none"),e.appendChild(s),this.node.appendChild(e)}onAfterAttach(){this.node.addEventListener("mousedown",this),this.node.addEventListener("mouseover",this),this.node.addEventListener("mouseout",this)}onBeforeDetach(){this.node.removeEventListener("mousedown",this),this.node.removeEventListener("mouseover",this),this.node.removeEventListener("mouseout",this)}handleEvent(t){switch(t.type){case"mousedown":this._evtClick();break;case"mouseover":this._evtMouseOver();break;case"mouseout":this._evtMouseOut()}}onUpdateRequest(){var t;(null===(t=this.parent)||void 0===t?void 0:t.checkApplied(this.name))!==this.applied&&this.toggleApplied()}toggleApplied(){var t,e;this.applied?(this.removeClass("applied-tag"),(null===(t=this.node.firstChild)||void 0===t?void 0:t.lastChild).style.display="none",this.addClass("unapplied-tag")):(this.removeClass("unapplied-tag"),(null===(e=this.node.firstChild)||void 0===e?void 0:e.lastChild).style.display="inline-block",this.addClass("applied-tag")),this.applied=!this.applied}_evtClick(){var t,e;this.applied?null===(t=this.parent)||void 0===t||t.removeTag(this.name):null===(e=this.parent)||void 0===e||e.addTag(this.name),this.toggleApplied()}_evtMouseOver(){this.node.classList.add("tag-hover")}_evtMouseOut(){this.node.classList.remove("tag-hover")}}class c extends l.NotebookTools.Tool{constructor(t,e,s){super(),this.tagList=[],this.label=!1,this.translator=s||i.nullTranslator,this._trans=this.translator.load("jupyterlab"),this.tracker=t,this.layout=new n.PanelLayout,this.createTagInput(),this.addClass("jp-TagTool")}createTagInput(){const t=this.layout,e=new d(this.translator);e.id="add-tag",t.insertWidget(0,e)}checkApplied(t){var e;const s=null===(e=this.tracker)||void 0===e?void 0:e.activeCell;if(s){const e=s.model.metadata.get("tags");if(e)return e.includes(t)}return!1}addTag(t){var e,s;const i=null===(e=this.tracker)||void 0===e?void 0:e.activeCell;if(i){const e=[...null!==(s=i.model.metadata.get("tags"))&&void 0!==s?s:[]];let a=t.split(/[,\s]+/);a=a.filter((t=>""!==t&&!e.includes(t))),i.model.metadata.set("tags",e.concat(a)),this.refreshTags(),this.loadActiveTags()}}removeTag(t){var e,s;const i=null===(e=this.tracker)||void 0===e?void 0:e.activeCell;if(i){let e=[...null!==(s=i.model.metadata.get("tags"))&&void 0!==s?s:[]].filter((e=>e!==t));i.model.metadata.set("tags",e),0===e.length&&i.model.metadata.delete("tags"),this.refreshTags(),this.loadActiveTags()}}loadActiveTags(){const t=this.layout;for(const e of t.widgets)e.update()}pullTags(){var t,e,s;const i=null===(t=this.tracker)||void 0===t?void 0:t.currentWidget,a=null!==(s=null===(e=null==i?void 0:i.model)||void 0===e?void 0:e.cells)&&void 0!==s?s:[],n=(0,o.reduce)(a,((t,e)=>{var s;return[...t,...null!==(s=e.metadata.get("tags"))&&void 0!==s?s:[]]}),[]);this.tagList=[...new Set(n)].filter((t=>""!==t))}refreshTags(){this.pullTags();const t=this.layout,e=t.widgets.filter((t=>"add-tag"!==t.id));e.forEach((t=>{this.tagList.includes(t.name)||t.dispose()}));const s=e.map((t=>t.name));this.tagList.forEach((e=>{if(!s.includes(e)){const s=t.widgets.length-1;t.insertWidget(s,new r(e))}}))}validateTags(t,e){e=e.filter((t=>"string"==typeof t)),e=(0,o.reduce)(e,((t,e)=>[...t,...e.split(/[,\s]+/)]),[]);const s=[...new Set(e)].filter((t=>""!==t));t.model.metadata.set("tags",s),this.refreshTags(),this.loadActiveTags()}onActiveCellChanged(){this.loadActiveTags()}onAfterShow(){this.refreshTags(),this.loadActiveTags()}onAfterAttach(t){if(!this.label){const t=document.createElement("label");t.textContent=this._trans.__("Cell Tags"),t.className="tag-label",this.parent.node.insertBefore(t,this.node),this.label=!0}this.onCurrentChanged(),super.onAfterAttach(t)}onBeforeDetach(t){super.onBeforeDetach(t),h.Signal.disconnectReceiver(this)}onActiveCellMetadataChanged(){const t=this.tracker.activeCell.model.metadata.get("tags");let e=[];t&&("string"==typeof t?e.push(t):e=t),this.validateTags(this.tracker.activeCell,e)}onCurrentChanged(){h.Signal.disconnectReceiver(this),this.tracker.currentChanged.connect(this.onCurrentChanged,this),this.tracker.currentWidget&&(this.tracker.currentWidget.context.ready.then((()=>{this.refresh()})),this.tracker.currentWidget.model.cells.changed.connect(this.refresh,this),this.tracker.currentWidget.content.activeCellChanged.connect(this.refresh,this)),this.refresh()}refresh(){this.refreshTags(),this.loadActiveTags()}}}}]);
//# sourceMappingURL=6997.bce2331.js.map