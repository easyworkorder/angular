import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray, AbstractControl, ValidatorFn } from '@angular/forms';
import { BuildingService } from './../building/building.service';
import { AuthenticationService } from 'app/modules/authentication';
import { EmployeeService } from './../employee/employee.service';
import { ActivatedRoute } from '@angular/router';
import config from '../../../config';
import { DataService } from 'app/services';
import { VerifyEmailService } from 'app/modules/shared/verify-email.service';
import { Observable } from "rxjs/Observable";
declare var $: any;

@Component({
    selector: 'ewo-building-notification',
    templateUrl: './building-notification.component.html',
})
export class BuildingNotificationComponent implements OnInit {

    currentCompanyId = 1;
    employees: any;
    isShowingLoadingSpinner: boolean = false;
    searchControl = new FormControl('');
    buildingNotify = {
        is_notify: false,
        employee: '',
        building: ''
    }

    buildingId: any;

    constructor(
        private buildingService: BuildingService,
        private employeeService: EmployeeService,
        private authService: AuthenticationService,
        private dataService: DataService,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,

        private verifyEmailService: VerifyEmailService) {
        this.authService.verifyToken().take(1).subscribe(data => {
            // this.getAllEmployees(this.currentCompanyId);
        });
    }



    ngOnInit () {
        this.getAllEmployess();
    }

    getAllEmployess () {
        this.buildingId = this.route.snapshot.params['id'];
        this.isShowingLoadingSpinner = true;
        let observable = Observable.forkJoin(
            this.employeeService.getAllEmployees(this.currentCompanyId),
            this.buildingService.getEmployeeBuilding(this.buildingId)
        );
        observable.subscribe(datas => {
            this.isShowingLoadingSpinner = false;
            // this.employees = datas[0].results;
            // this.notifyEmployees = datas[1].results;
            let _tempEmp: any[] = [];
            let _emp = datas[0].results;
            let _notify: any[] = datas[1].results;

            _emp.forEach(x => {
                let formGroup = new FormGroup({
                    accessControl: new FormControl(),
                    notifyControl: new FormControl()
                });

                let tmp = _notify.find(n => n.employee.extractIdFromURL() == x.id)
                if (tmp) {
                    formGroup.get('accessControl').setValue(true);
                    formGroup.get('notifyControl').setValue(tmp.is_notify);
                    _tempEmp.push(Object.assign({}, x, { employeebuilding: tmp, noAccess: false, access: true, notification: tmp.is_notify, notificationForm: formGroup }));
                } else {
                    formGroup.get('accessControl').setValue(false);
                    formGroup.get('notifyControl').setValue(false);
                    _tempEmp.push(Object.assign({}, x, { employeebuilding: tmp, noAccess: true, access: false, notification: false, notificationForm: formGroup }));
                }

            })
            this.employees = _tempEmp;
        },
            error => {
                this.isShowingLoadingSpinner = false;
            });
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

    updateNotification (employee) {
        let employeebuilding = employee.employeebuilding;
        employeebuilding.is_notify = employee.notificationForm.value.notifyControl;
        this.buildingService.updateEmployeeBuildingNotification(employeebuilding);
    }

    // saveNotification (employee) {
    //     let employeebuilding = employee.employeebuilding;
    //     employeebuilding.is_notify = employee.notificationForm.value.notifyControl;

    //     this.buildingService.createEmployeeBuildingNotification(employeebuilding);
    // }

    notificationClick (employee) {
        this.updateNotification(employee);
    }

    accessClick (employee) {
        employee.access = !employee.access;
        employee.notification = !employee.access;

        if (!employee.access) {
            employee.notificationForm.get('notifyControl').setValue(false);
            // this.updateNotification(employee);

            this.buildingService.deleteEmployeeBuildingNotification(employee.employeebuilding);
        } else {
            let empBuilding = this.buildingNotify;
            empBuilding.building = config.api.base + 'building/' + this.buildingId + '/';
            empBuilding.employee = config.api.base + 'employee/' + employee.id + '/';
            empBuilding.is_notify = false;

            this.buildingService.createEmployeeBuildingNotification(empBuilding).subscribe(data => {
                let emp = this.employees.find(x => x.id == employee.id);
                emp.employeebuilding = data;
            });
        }
    }
}

