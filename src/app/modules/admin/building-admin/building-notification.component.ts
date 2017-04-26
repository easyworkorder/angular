import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray, AbstractControl, ValidatorFn } from '@angular/forms';
import { BuildingService } from './../building/building.service';
import { AuthenticationService } from 'app/modules/authentication';
import { EmployeeService } from './../employee/employee.service';
import { ActivatedRoute } from '@angular/router';
import config from '../../../config';
import { DataService } from 'app/services';
import { VerifyEmailService } from 'app/modules/shared/verify-email.service';
declare var $: any;

@Component({
    selector: 'ewo-building-notification',
    templateUrl: './building-notification.component.html',
})
export class BuildingNotificationComponent implements OnInit {

    currentCompanyId = 1;
    employees: any;
    isShowingLoadingSpinner: boolean = true;

    searchControl = new FormControl('');

    constructor(
        private buildingService: BuildingService,
        private employeeService: EmployeeService,
        private authService: AuthenticationService,
        private dataService: DataService,
        private verifyEmailService: VerifyEmailService) {
            this.authService.verifyToken().take(1).subscribe(data => {
                this.getAllEmployees(this.currentCompanyId);
            });
    }

    ngOnInit () {}

    getAllEmployees (company_id): void {
        this.isShowingLoadingSpinner = true;
        this.employeeService.getAllEmployees(company_id).subscribe(
            data => {
                this.employees = data.results;
                this.isShowingLoadingSpinner = false;
            }
        );
    }

    getPhotoUrl (employee) {
        if (employee.photo != null && employee.photo.length > 0) {
            return employee.photo;
        }
        return 'assets/img/placeholders/avatars/avatar9.jpg';
    }

    buildAddressHtml (employee: any) {
        return this.dataService.buildEmployeedAddressHtml(employee);
    }

}

