import { Component, OnInit, ViewChild } from '@angular/core';
import { BuildingInformationComponent } from "app/modules/admin/building-admin/building-information.component";
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ActivatedRoute, Params } from "@angular/router";
import { BuildingService } from "app/modules/admin/building/building.service";
import { EmployeeService } from "app/modules/admin/employee/employee.service";
import { Observable } from 'rxjs/Rx';
import { DataService } from "app/services";
import { SLAPolicyService } from "app/modules/admin/sla-policy/sla-policy.service";
import { BreadcrumbHeaderService } from "app/modules/shared/breadcrumb-header/breadcrumb-header.service";
import { HeaderService } from "app/modules/shared/header/header.service";
declare var $: any;

@Component({
    selector: 'ewo-building-admin-details',
    templateUrl: './building-admin-details.component.html'
})
export class BuildingAdminDetailsComponent implements OnInit {

    currentCompanyId = 1;
    employees: any[] = [];
    files: any[] = [];
    primarycontact_id: any = [];

    editedBuilding: any;
    private _buildingId: any;
    photoUrl: any;

    buildingSlaPolicyTargets: any;
    buildingForm = new FormGroup({
        id: new FormControl(),
        primarycontact_id: new FormControl(),
        url: new FormControl()
    })


    constructor(
        private route: ActivatedRoute,
        private buildingService: BuildingService,
        private employeeService: EmployeeService,
        private dataService: DataService,
        private slaPolicyService: SLAPolicyService,
        private breadcrumbHeaderService: BreadcrumbHeaderService,
        private headerService: HeaderService,

    )
    { }

    ngOnInit () {
        this.breadcrumbHeaderService.setBreadcrumbTitle('Building Admin');
        this._buildingId = this.route.snapshot.params['id'];
        this.getBuilding(this._buildingId);
        this.getFiles(this._buildingId);
        this.getBuildingSLAPolicy(this._buildingId);
        this.headerService.setDashBoardTitle({ title: 'BUILDINGS', link: [`/admin/building`] });

    }

    // getBuilding(id) {
    //   this.buildingService.getBuilding(id).subscribe(data => {
    //     this.employeeService.getEmployeeById(data.primarycontact_id).subscribe(emp => {
    //       // this.editedBuilding = Object.assign({}, data, { contactPerson: emp.last_name + ' ' + emp.first_name });
    //       this.editedBuilding = Object.assign({}, data, { contactPerson: emp.last_name + ' ' + emp.first_name });
    //     })
    //   });
    // }

    getBuilding (id) {
        this.buildingService.getBuilding(id).subscribe(data => {
            this.employeeService.getEmployeeById(data.primarycontact_id).subscribe(emp => {
                // this.editedBuilding = Object.assign({}, data, { contactPerson: emp.last_name + ' ' + emp.first_name });
                // this.editedBuilding = Object.assign({}, data, { contactPerson: emp.last_name + ' ' + emp.first_name });
                this.employeeService.getCompanyById(emp.company).subscribe(company => {
                    this.editedBuilding = Object.assign({}, data,
                        {
                            contactPerson: emp.first_name + ' ' + emp.last_name,
                            ContactPersonPhoto: emp.photo,
                            ContactPersonWorkPhone: emp.work_phone,
                            ContactPersonEmail: emp.email
                        },
                        {
                            primaryCompany: company.name, primaryCompanyAddress: company.address,
                            primaryCompanyUnitNo: company.unit_no, primaryCompanyCity: company.city,
                            primaryCompanyState: company.state, primaryCompanyPostalCode: company.postal_code
                        });
                    this.getPhotoUrl(this.editedBuilding.ContactPersonPhoto);
                })
            })
        });
    }


    getAllEmployees (company_id): void {
        this.employeeService.getAllEmployees(company_id).subscribe(
            data => {
                let _employee: any[] = data.results.map(item => {
                    return { id: item.id, text: (item.first_name + ' ' + item.last_name) };
                });
                this.employees = _employee;
            }
        );
    }

    getBuildingSLAPolicy (buildingId) {
        this.slaPolicyService.getBuildingSLAPolicy(buildingId).map(data => data.results).subscribe(data => {
            this.buildingSlaPolicyTargets = data;
        });
    }

    onSubmit () {
        this.buildingForm.get('primarycontact_id').setValue(this.primarycontact_id[0].id);
        if (!this.buildingForm.valid) return;

        if (this.buildingForm.value.id) {
            this.buildingService.update(this.buildingForm.value).subscribe((building: any) => {
                this.updateInfo(true);
                this.closeModal();
            });
        }
    }

    closeModal () {
        $('#modalEditContactInfo').modal('hide');
    }

    public selectedPrimaryContact (value: any): void {
        this.primarycontact_id = [value];
    }

    updateInfo (event) {
        this._buildingId && this.getBuilding(this._buildingId);
    }

    editBuildingContactInfo () {
        this.getAllEmployees(this.currentCompanyId);
        this.primarycontact_id = this.editedBuilding && [{ id: this.editedBuilding.primarycontact_id, text: this.editedBuilding.contactPerson }];
        this.editedBuilding && this.buildingForm.setValue({
            id: this.editedBuilding.id,
            primarycontact_id: this.editedBuilding.primarycontact_id,
            url: this.editedBuilding.url
        });
    }

    getPhotoUrl (employee) {
        // if (employee.photo != null && employee.photo.length > 0)
        //     return employee.photo;
        // return 'assets/img/placeholders/avatars/avatar9.jpg';
        this.photoUrl = this.dataService.getPhotoUrl(employee);
    }

    onUpdateSLAPolicy (val) {
        this.getBuildingSLAPolicy(this._buildingId);
    }

    updateFileList(event) {
        this.getFiles(this._buildingId);
    }

    /**
     * Get Files list by tenant
     */
    getFiles (building_id) {
        this.buildingService.getDocuments(building_id).subscribe(
            data => {
                this.files = data.results;
            }
        );
    }
}
