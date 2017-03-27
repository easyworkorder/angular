import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormControl } from "@angular/forms";
import config from '../../../config';


@Component({
    selector: 'ewo-numeric-sort',
    template: `
    <a href="javascript:void(0)" class="btn btn-sm" [ngClass]="{'btn-muted': !isWhiteBackground, 'btn-default': isWhiteBackground}"
    (click)="searchControl.setValue('[0-9]')">0-9</a>
    `,
})
export class NumericSortComponent implements OnInit {
    @Input() searchControl: FormControl;
    @Output() change: EventEmitter<any> = new EventEmitter<any>();
    @Input() isWhiteBackground: boolean = false;

    constructor() { }

    ngOnInit() {
        this.searchControl.valueChanges.subscribe(data => {
            this.change.emit(data);
        });
    }
}
