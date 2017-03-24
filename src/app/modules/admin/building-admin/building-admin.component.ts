import { Component, OnInit, ViewChild } from '@angular/core';
import { BuildingInformationComponent } from "app/modules/admin/building-admin/building-information.component";
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ActivatedRoute, Params } from "@angular/router";
import { BuildingService } from "app/modules/admin/building/building.service";
import { EmployeeService } from "app/modules/admin/employee/employee.service";
import { Observable } from 'rxjs/Rx';
declare var $: any;

@Component({
    selector: 'ewo-building-admin',
    templateUrl: './building-admin.component.html',
    styleUrls: ['./building-admin.component.css']
})

export class BuildingAdminComponent implements OnInit {
    // currentCompanyId = 1;
    // employees: any[] = [];
    // primarycontact_id: any = [];

    // editedBuilding: any;
    // private _buildingId: any;

    // buildingForm = new FormGroup({
    //   id: new FormControl(),
    //   primarycontact_id: new FormControl(),
    //   url: new FormControl()
    // })


    constructor(private route: ActivatedRoute, private buildingService: BuildingService, private employeeService: EmployeeService) { }

    ngOnInit() {
        // this._buildingId = this.route.snapshot.params['id'];
        // this.getBuilding(this._buildingId);
    }

    // getBuilding(id) {
    //   this.buildingService.getBuilding(id).subscribe(data => {
    //     this.employeeService.getEmployeeById(data.primarycontact_id).subscribe(emp => {
    //       // this.editedBuilding = Object.assign({}, data, { contactPerson: emp.last_name + ' ' + emp.first_name });
    //       this.editedBuilding = Object.assign({}, data, { contactPerson: emp.last_name + ' ' + emp.first_name });
    //     })
    //   });
    // }

    // getBuilding(id) {
    //   this.buildingService.getBuilding(id).subscribe(data => {
    //     this.employeeService.getEmployeeById(data.primarycontact_id).subscribe(emp => {
    //       this.employeeService.getCompanyById(emp.company).subscribe(company => {
    //         this.editedBuilding = Object.assign({}, data,
    //           {
    //             contactPerson: emp.last_name + ' ' + emp.first_name,
    //             ContactPersonPhoto: emp.photo,
    //             ContactPersonWorkPhone: emp.work_phone
    //           },
    //           {
    //             primaryCompany: company.name, primaryCompanyAddress: company.address,
    //             primaryCompanyUnitNo: company.unit_no, primaryCompanyCity: company.city,
    //             primaryCompanyState: company.state, primaryCompanyPostalCode: company.postal_code
    //           });
    //       })
    //     })
    //   });
    // }


    // getAllEmployees(company_id): void {
    //   this.employeeService.getAllEmployees(company_id).subscribe(
    //     data => {
    //       let _employee: any[] = data.results.map(item => {
    //         return { id: item.id, text: (item.last_name + ' ' + item.first_name) };
    //       });
    //       this.employees = _employee;
    //     }
    //   );
    // }

    // onSubmit() {
    //   this.buildingForm.get('primarycontact_id').setValue(this.primarycontact_id[0].id);
    //   if (!this.buildingForm.valid) return;

    //   if (this.buildingForm.value.id) {
    //     this.buildingService.update(this.buildingForm.value).subscribe((building: any) => {
    //       this.updateInfo(true);
    //       this.closeModal();
    //     });
    //   }
    // }

    // closeModal() {
    //   $('#modalEditContactInfo').modal('hide');
    // }

    // public selectedPrimaryContact(value: any): void {
    //   this.primarycontact_id = [value];
    // }

    // updateInfo(event) {
    //   this._buildingId && this.getBuilding(this._buildingId);
    // }

    // editBuildingContactInfo() {
    //   this.getAllEmployees(this.currentCompanyId);
    //   this.primarycontact_id = this.editedBuilding && [{ id: this.editedBuilding.primarycontact_id, text: this.editedBuilding.contactPerson }];
    //   this.editedBuilding && this.buildingForm.setValue({
    //     id: this.editedBuilding.id,
    //     primarycontact_id: this.editedBuilding.primarycontact_id,
    //     url: this.editedBuilding.url
    //   });
    // }

    // getPhotoUrl(employee) {
    //   if (employee.photo != null && employee.photo.length > 0)
    //     return employee.photo;
    //   return 'assets/img/placeholders/avatars/avatar9.jpg';
    // }

}
