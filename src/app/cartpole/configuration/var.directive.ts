import { Directive, Input, ViewContainerRef, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appVar]'
})
export class VarDirective {

  ctx: any = {};

  refresh(): void {
    this.viewContainerRef.clear();
    this.viewContainerRef.createEmbeddedView(this.templateRef, this.ctx);
  }

  // save a var inside ctx
  @Input()
  set appVar(ctx: any) {
    this.ctx.$implicit = this.ctx.appVar = ctx;
    this.refresh();
  }

  constructor(private viewContainerRef: ViewContainerRef, private templateRef: TemplateRef<any>) { }

}