import { Component, OnInit, EventEmitter, Output, Input, Renderer } from '@angular/core';
import { FormControl } from "@angular/forms";
import config from '../../../config';


@Component({
    selector: 'ewo-alphabetical-sort',
    templateUrl: './alphabetical-sort.component.html',
    styleUrls: ['./alphabetical-sort.component.css']
})
export class AlphabeticalSortComponent implements OnInit {
    @Input() searchControl: FormControl;
    @Output() change: EventEmitter<any> = new EventEmitter<any>();
    @Input() isWhiteBackground: boolean = false;
    @Input() isNumericSearch: boolean = false;

    constructor(private renderer: Renderer) { }

    ngOnInit() {
        this.searchControl.valueChanges.subscribe(data => {
            this.change.emit(data);
        });
    }
}
