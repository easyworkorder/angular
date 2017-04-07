import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import config from '../../../config';
import { EmployeeService } from './employee.service';
import { BuildingService } from '../building/building.service';
import { ProblemTypeService } from '../problem_type/problem_type.service';
import { ValidationService } from "../../../services/validation.service";
import { AuthenticationService } from "app/modules/authentication";
import { BreadcrumbHeaderService } from "app/modules/shared/breadcrumb-header/breadcrumb-header.service";
import { DataService } from "app/services";
declare var $: any;

export class TabVisibility {
    isEmployeeTabVisible = true;
    isBuildingTabVisible = false;
    isProblemTypeTabVisible = false;
    selectedTabNo = 1;
}

@Component({
    selector: 'ewo-employee-list',
    templateUrl: 'employee.component.html',
})

export class EmployeeComponent implements OnInit {
    public mask: Array<string | RegExp>;

    employees: any[] = [];
    buildings: any[] = [];
    problemTypes: any[] = [];
    tabs = new TabVisibility();
    currentCompanyId = 1;
    selectedBuildings: any[] = [{ id: -1, text: 'All' }];
    selectedProblemTypes: any[] = [{ id: -1, text: 'All' }];
    photoFile: File;
    selectedPhoto: string = '';

    employeeForm = new FormGroup({
        id: new FormControl(),
        company: new FormControl(config.api.base + 'company/' + this.currentCompanyId + '/'),
        first_name: new FormControl('', Validators.required),
        last_name: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.required, ValidationService.emailValidator]),
        title: new FormControl('', Validators.required),
        work_phone: new FormControl('', Validators.required),
        work_phone_ext: new FormControl(''),
        fax: new FormControl(''),
        mobile_phone: new FormControl(''),
        pager: new FormControl(''),
        emergency_phone: new FormControl(''),
        receive_email: new FormControl('true'),
        notes: new FormControl(''),
        wireless_email: new FormControl('', ValidationService.emailValidator),
        building_list: new FormControl('', Validators.required),
        problem_type_list: new FormControl('', Validators.required),
        // photo: new FormControl(''),
        active: new FormControl('true'),
        user_id: new FormControl(null),
        url: new FormControl()
    });

    searchControl = new FormControl('');

    constructor(private employeeService: EmployeeService,
        private buildingService: BuildingService,
        private problemTypeService: ProblemTypeService,
        private authService: AuthenticationService,
        private breadcrumbHeaderService: BreadcrumbHeaderService,
        private dataService: DataService
    ) {
        this.authService.verifyToken().take(1).subscribe(data => {
            this.getAllEmployees(this.currentCompanyId);
            this.getAllBuildings(this.currentCompanyId);
            this.getAllProblemTypes(this.currentCompanyId);
        });
        this.mask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
    }

    ngOnInit() {
        this.breadcrumbHeaderService.setBreadcrumbTitle('Employees');

        $('#modal-add-employee').on('hidden.bs.modal', () => {
            this.closeModal();
        });

        this.setBuildingList();
        this.setProblemTypeLsit();
    }

    switchTab(tabId: number) {
        if (tabId < 1) // First tabs back button click
            tabId = 1;
        else if (tabId > 3) //This is the last tab's next button click
            tabId = 3;
        this.tabs.isEmployeeTabVisible = tabId == 1 ? true : false;
        this.tabs.isBuildingTabVisible = tabId == 2 ? true : false;
        this.tabs.isProblemTypeTabVisible = tabId == 3 ? true : false;
        this.tabs.selectedTabNo = tabId;
    }

    getAllEmployees(company_id): void {
        this.employeeService.getAllEmployees(company_id).subscribe(
            data => {
                this.employees = data.results;
            }
        );
    }
    getAllBuildings(company_id): void {
        this.buildingService.getAllBuildings(company_id).subscribe(
            data => {
                // this.buildings = data.results;
                let _building: any[] = data.map(item => {
                    return { id: item.id, text: item.name };
                })
                // _building.push({ id: -1, text: 'All' });
                _building.splice(0, 0, { id: -1, text: 'All' });
                this.buildings = _building;
            }
        );
    }
    getAllProblemTypes(company_id): void {
        this.problemTypeService.getAllActiveProblemTypes(company_id).subscribe(
            data => {
                // this.buildings = data.results;
                let _probTypes: any[] = data.results.map(item => {
                    return { id: item.id, text: item.problem_name };
                })
                // _probTypes.push({ id: -1, text: 'All' });
                _probTypes.splice(0, 0, { id: -1, text: 'All' });

                this.problemTypes = _probTypes;
            }
        );
    }

    getBuilding(id) {
        return this.buildings.find(item => item.id == id);
    }
    getProblemType(id) {
        return this.problemTypes.find(item => item.id == id);
    }

    editEmployee(employee) {
        let sb = [];
        let sp = [];
        employee.building_list.split(',').forEach(id => sb.push(this.getBuilding(id)));
        employee.problem_type_list.split(',').forEach(id => sp.push(this.getProblemType(id)));
        this.selectedBuildings = sb;
        this.selectedProblemTypes = sp;
        // this.employeeForm.setValue(employee);
        this.employeeForm.patchValue(employee);
    }

    onSubmit() {
        this.setBuildingList();
        this.setProblemTypeLsit();

        // let val = this.employeeForm.value;
        // let work_phone = this.employeeForm.get('work_phone').value;
        // let emergency_phone = this.employeeForm.get('emergency_phone').value;
        // this.employeeForm.get('work_phone').setValue(work_phone.toNormalText());
        // this.employeeForm.get('emergency_phone').setValue(emergency_phone.toNormalText());

        if(!this.employeeForm.valid) return;

        if (this.photoFile) {
            console.log('Inside On Submit');
            let user_id = this.employeeForm.get('user_id').value;
            let formData: FormData = this.dataService.mapToFormData(this.employeeForm, ['user_id']);
            formData.append('photo', this.photoFile, this.photoFile.name);
            if (this.employeeForm.value.id) {
                formData.append('user_id', user_id);
                this.employeeService.updateWithFile(this.employeeForm.value.url, formData).subscribe((employee: any) => {
                    this.refreshEditor('Employee created with file', employee);
                });
            } else {
                console.log('Creating employee')
                this.employeeService.createWithFile(formData).subscribe((employee: any) => {
                    this.refreshEditor('Employee created with file', employee);
                });
            }
        } else {
            // Simple Object Posting should go here, and the photo field needs to be removed
            // It is obvious that the user hasn't selected any file
            if (this.employeeForm.contains('photo'))
                this.employeeForm.removeControl('photo');

            if (this.employeeForm.value.id) {
                this.employeeService.update(this.employeeForm.value).subscribe((employee: any) => {
                    this.refreshEditor('Employee Updated.', employee);
                });
            } else {
                if (this.employeeForm.contains('user_id'))
                    this.employeeForm.removeControl('user_id');
                this.employeeService.create(this.employeeForm.value).subscribe((employee: any) => {
                    this.refreshEditor('Employee created', employee);
                });
            }
        }
        // this.http.post('http://localhost:8080/api/tenant/', item);
    }
    private refreshEditor(logMsg: string, obj: any) {
        console.log(logMsg, obj);
        this.getAllEmployees(this.currentCompanyId);
        this.closeModal();
    }

    photoSelectionChange(event) {
        let fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            this.photoFile = fileList[0];
            this.selectedPhoto = this.photoFile.name;
        }
    }

    setBuildingList() {
        let buildingList = this.itemsToString(this.selectedBuildings);
        buildingList = buildingList.split(',').filter(item => item != '-1').join(',');
        this.employeeForm.get('building_list').setValue(buildingList == "" ? "-1" : buildingList);
    }
    setProblemTypeLsit() {
        let problemTypeList = this.itemsToString(this.selectedProblemTypes);
        problemTypeList = problemTypeList.split(',').filter(item => item != '-1').join(',');
        this.employeeForm.get('problem_type_list').setValue(problemTypeList == "" ? "-1" : problemTypeList);
    }
    public selectedBuilding(value: any): void {
        // if (value.id == -1) {
        //   return;
        // }

        if (this.selectedBuildings.length >= 1 && value.id == -1) {
            this.removedBuilding(value);
            return;
        }
        if (this.selectedBuildings.some(val => val.id == -1)) {
            this.removedBuilding({ id: -1, text: 'All' });
        }

        console.log('Selected value is: ', value);
        this.selectedBuildings.push(value);
        console.log(this.selectedBuildings);
        this.setBuildingList();
    }

    public removedBuilding(value: any): void {

        console.log('Removed value is: ', value);
        let sel = [];
        this.selectedBuildings.forEach(item => {
            if (item.id != value.id) {
                sel.push(item);
            }
        });
        this.selectedBuildings = sel;
        this.setBuildingList();
    }

    // public refreshBuildingValue(value: any): void {
    //   this.selectedBuildings = value;
    // }

    public selectedProblemType(value: any): void {
        // if (value.id == -1) return;

        // if (this.selectedProblemTypes.length >= 1 && value.id == -1) { return; }
        if (this.selectedProblemTypes.length >= 1 && value.id == -1) {
            this.removedProblemType(value);
            return;
        }
        if (this.selectedProblemTypes.some(val => val.id == -1)) {
            this.removedProblemType({ id: -1, text: 'All' });
        }

        console.log('Selected value is: ', value);
        this.selectedProblemTypes.push(value);
        console.log(this.selectedProblemTypes);
        this.setProblemTypeLsit();
    }

    public removedProblemType(value: any): void {
        // console.log('Removed value is: ', value);
        let sel = [];
        this.selectedProblemTypes.forEach(item => {
            if (item.id != value.id) {
                sel.push(item);
            }
        });
        this.selectedProblemTypes = sel;
        this.setProblemTypeLsit();
    }

    public itemsToString(value: Array<any> = []): string {
        return value
            .map((item: any) => {
                return item.id;
            }).join(',');
    }

    buildAddressHtml(employee: any) {
        return this.dataService.buildEmployeedAddressHtml(employee);
    }

    getPhotoUrl(employee) {
        if (employee.photo != null && employee.photo.length > 0)
            return employee.photo;
        return 'assets/img/placeholders/avatars/avatar9.jpg';
    }

    closeModal() {
        this.resetForm();
        this.selectedBuildings = [{ id: -1, text: 'All' }];
        this.selectedProblemTypes = [{ id: -1, text: 'All' }];
        this.setBuildingList();
        this.setProblemTypeLsit();
        this.switchTab(1);
        $('#modal-add-employee').modal('hide');
    }

    resetForm() {
        this.photoFile = null;
        this.selectedPhoto = '';
        this.employeeForm.reset({
            company: config.api.base + 'company/' + this.currentCompanyId + '/',
            receive_email: true,
            active: true,
            wireless_email: ''
        });
    }
}

