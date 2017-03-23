import { Directive, Input, ElementRef, Renderer, OnChanges, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[active]'
})
export class ActiveDirective implements AfterViewInit, OnChanges {
  @Input('active') active: boolean = false;

  constructor(private el: ElementRef, private renderer: Renderer) {

  }

  ngAfterViewInit() {
    this.addRemoveActiveClass();
  }

  ngOnChanges() {
    this.addRemoveActiveClass();
  }

  private addRemoveActiveClass() {
    this.renderer.setElementClass(this.el.nativeElement, 'is-active', this.active);
  }
}
