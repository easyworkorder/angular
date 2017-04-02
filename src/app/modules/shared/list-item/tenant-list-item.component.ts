import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { DataService, AppHttp } from "app/services";

@Component({
    selector: 'ewo-employee-list-item',
    templateUrl: './employee-list-item.component.html'
})
export class EmployeeListItemComponent implements OnInit {

    constructor(
        // private http: ApdpHttp,
        private dataService: DataService
    ) { }
    /// A List of Contact objects to display
    @Input() employee: any[];
    @Input() isEditable: boolean = true;
    @Output('update') change: EventEmitter<any> = new EventEmitter<any>();

    ngOnInit() {

    }


    stopPropagation(event) {
        event.stopPropagation()
    }

    updateEmployee(data) {
        this.change.emit(data);
    }
}
