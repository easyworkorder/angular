import { Directive, ElementRef, HostListener, Input } from '@angular/core';
declare var $: any;

@Directive({
    selector: '[modal-dialog-open]'
})
export class ModalDialogDirective {
    @Input('modal-dialog-open') dialogId;
    constructor(private elementRef: ElementRef) { }

    @HostListener('click', ['$event', '$event.target'])
    public onClick(event, targetElement) {
        let modalOpenId = '.modal';
        if (!!this.dialogId) {
            modalOpenId = '#' + this.dialogId;
        }
        $(modalOpenId).modal({
            backdrop: 'static',
            keyboard: true
        });
    }
}