import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { DataService, AppHttp } from "app/services";
import { EmployeeComponent } from '../../admin/employee/employee.component';

@Component({
    selector: 'ewo-employee-list-item',
    templateUrl: './employee-list-item.component.html'
})
export class EmployeeListItemComponent implements OnInit {

    constructor(
        // private http: ApdpHttp,
        private dataService: DataService,
        private employeeComponent: EmployeeComponent
    ) { }
    /// A List of Contact objects to display
    @Input() employee: any[];
    @Input() isEditable: boolean = false;
    @Output('update') change: EventEmitter<any> = new EventEmitter<any>();

    ngOnInit() {

    }

    getPhotoUrl(employee) {
        if (employee.photo != null && employee.photo.length > 0)
            return employee.photo;
        return 'assets/img/placeholders/avatars/avatar9.jpg';
    }

    stopPropagation(event) {
        event.stopPropagation()
    }

    updateEmployee(data) {
        this.change.emit(data);
    }
}
