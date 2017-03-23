import {Directive, ElementRef, Output, EventEmitter, HostListener} from '@angular/core';

@Directive({
    selector: '[clickInside]'
})
export class ClickInsideDirective {
    constructor(private elementRef : ElementRef) { }

    @HostListener('click', ['$event', '$event.target'])
    public onClick(event, targetElement) {
        const clickedInside = this.elementRef.nativeElement.contains(targetElement);
        if (clickedInside) {
            event.stopPropagation();
        }
    }
}