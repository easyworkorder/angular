import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { DataService, AppHttp } from "app/services";

@Component({
    selector: 'ewo-insurance-list',
    templateUrl: './insurance-list.component.html'
})
export class InsuranceListComponent implements OnInit {

    constructor(
        // private http: ApdpHttp,
        private dataService: DataService
    ) { }
    /// A List of Contact objects to display
    @Input() insuranceList: any[];
    @Input() isEditable: boolean = true;
    @Output('update') change: EventEmitter<any> = new EventEmitter<any>();

    ngOnInit() {

    }


    stopPropagation(event) {
        event.stopPropagation()
    }

    updateInsurance(data) {
        this.change.emit(data);
    }
}
