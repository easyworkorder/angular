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
import { VerifyEmailService } from "app/modules/shared/verify-email.service";
import { Observable } from "rxjs/Observable";
import { ToasterService } from "angular2-toaster/angular2-toaster";
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
    isSubmit: boolean = false;
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
    isShowingLoadingSpinner: boolean = true;
    showSaveSpinner: boolean = false;

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
        url: new FormControl(),
        photo: new FormControl('')
    });

    searchControl = new FormControl('');

    constructor(private employeeService: EmployeeService,
        private buildingService: BuildingService,
        private problemTypeService: ProblemTypeService,
        private authService: AuthenticationService,
        private breadcrumbHeaderService: BreadcrumbHeaderService,
        private dataService: DataService,
        private verifyEmailService: VerifyEmailService,
        private toasterService: ToasterService
    ) {
        this.authService.verifyToken().take(1).subscribe(data => {
            this.getAllEmployees(this.currentCompanyId);
            this.getAllBuildings(this.currentCompanyId);
            this.getAllProblemTypes(this.currentCompanyId);
        });
    }

    ngOnInit () {
        this.breadcrumbHeaderService.setBreadcrumbTitle('Employees');

        $('#modal-add-employee').on('hidden.bs.modal', () => {
            this.closeModal();
        });

        this.setBuildingList();
        this.setProblemTypeLsit();
    }

    switchTab (tabId: number) {
        if (tabId < 1) // First tabs back button click
            tabId = 1;
        else if (tabId > 3) //This is the last tab's next button click
            tabId = 3;
        this.tabs.isEmployeeTabVisible = tabId == 1 ? true : false;
        this.tabs.isBuildingTabVisible = tabId == 2 ? true : false;
        this.tabs.isProblemTypeTabVisible = tabId == 3 ? true : false;
        this.tabs.selectedTabNo = tabId;
    }

    getAllEmployees (company_id): void {
        this.isShowingLoadingSpinner = true;
        this.employeeService.getAllEmployees(company_id).subscribe(
            data => {
                this.employees = data.results;
                this.isShowingLoadingSpinner = false;
            }
        );
    }
    getAllBuildings (company_id): void {
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
    getAllProblemTypes (company_id): void {
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

    getBuilding (id) {
        return this.buildings.find(item => item.id == id);
    }
    getProblemType (id) {
        return this.problemTypes.find(item => item.id == id);
    }

    editEmployee (employee) {
        let sb = [];
        let sp = [];
        employee.building_list.split(',').forEach(id => sb.push(this.getBuilding(id)));
        employee.problem_type_list.split(',').forEach(id => sp.push(this.getProblemType(id)));
        this.selectedBuildings = sb;
        this.selectedProblemTypes = sp;
        // this.employeeForm.setValue(employee);
        this.employeeForm.patchValue(employee);
    }

    onSubmit () {
        console.log('On submit 1')
        this.setBuildingList();
        this.setProblemTypeLsit();
        // let val = this.employeeForm.value;
        // let work_phone = this.employeeForm.get('work_phone').value;
        // let emergency_phone = this.employeeForm.get('emergency_phone').value;
        // this.employeeForm.get('work_phone').setValue(work_phone.toNormalText());
        // this.employeeForm.get('emergency_phone').setValue(emergency_phone.toNormalText());
        // FIXME: Should be enabled, but validation always fails.
        // if(!this.employeeForm.valid) return;
        // if (this.photoFile) {
        //     console.log('Inside On Submit');
        //     let user_id = this.employeeForm.get('user_id').value;
        //     let formData: FormData = this.dataService.mapToFormData(this.employeeForm, ['user_id']);
        //     formData.append('photo', this.photoFile, this.photoFile.name);
        //     if (this.employeeForm.value.id) {
        //         formData.append('user_id', user_id);
        //         this.employeeService.updateWithFile(this.employeeForm.value.url, formData).subscribe((employee: any) => {
        //             this.refreshEditor('Employee created with file', employee);
        //         });
        //     } else {
        //         console.log('Creating employee')
        //         this.employeeService.createWithFile(formData).subscribe((employee: any) => {
        //             this.refreshEditor('Employee created with file', employee);
        //         });
        //     }
        // } else {
        //     // Simple Object Posting should go here, and the photo field needs to be removed
        //     // It is obvious that the user hasn't selected any file
        //     if (this.employeeForm.contains('photo'))
        //         this.employeeForm.removeControl('photo');

        //     if (this.employeeForm.value.id) {
        //         this.employeeService.update(this.employeeForm.value).subscribe((employee: any) => {
        //             this.refreshEditor('Employee Updated.', employee);
        //         });
        //     } else {
        //         if (this.employeeForm.contains('user_id'))
        //             this.employeeForm.removeControl('user_id');
        //         this.employeeService.create(this.employeeForm.value).subscribe((employee: any) => {
        //             this.refreshEditor('Employee created', employee);
        //         });
        //     }
        // }
        // this.http.post('http://localhost:8080/api/tenant/', item);

        // New Implementation with S3
        let boundEmployee = this.employeeForm.value;
        if (this.verifyEmailService.isEmailDuplicate) return;

        // let observable: Observable<any>;

        if (!this.employeeForm.valid) return;

        this.showSaveSpinner = true;
        this.isSubmit = true;

        // if (boundEmployee.id) {
        //     this.employeeService.update(boundEmployee).subscribe((employee: any) => {
        //         this.uploadtFile('Employee Updated.', employee);
        //     });
        // } else {
        //     if (boundEmployee.user_id)
        //         delete boundEmployee.user_id
        //     this.employeeService.create(boundEmployee).subscribe((employee: any) => {
        //         this.uploadtFile('Employee created', employee);
        //     });
        // }

        //April 14-2017
        this.uploadImageAndFile(boundEmployee);
    }

    uploadImageAndFile (boundEmployee) {
        let observable: Observable<any>;
        let creatORUpdateObservable: Observable<any>;

        if (boundEmployee.id) {
            creatORUpdateObservable = this.employeeService.update(boundEmployee);
        } else {
            if (boundEmployee.user_id)
                delete boundEmployee.user_id;
            creatORUpdateObservable = this.employeeService.create(boundEmployee);
        }

        if (this.photoFile) {
            let url = 's3filesignature/?name=' + this.photoFile.name + '&type=' + this.photoFile.type + '&etype=emp&rid=' + this.currentCompanyId;
            observable = Observable.forkJoin(
                creatORUpdateObservable
                    .switchMap(employee => this.employeeService.get(url), (employeeInfo, s3Info) => ({ employeeInfo, s3Info }))
                    // .do(data11 => { console.log('data11>> ', data11); })
                    .switchMap(employeeAndS3Info => this.uploadToAws(this.photoFile, employeeAndS3Info.s3Info.data, employeeAndS3Info.s3Info.url, employeeAndS3Info.employeeInfo),
                    (employeeAndAs3, aws) => ({ employeeAndAs3, aws }))
                    // .do(data12 => { console.log('data12>> ', data12); })
                    .switchMap(empS3Aws => {
                        empS3Aws.employeeAndAs3.employeeInfo.photo = empS3Aws.employeeAndAs3.s3Info.url;
                        return this.employeeService.update(empS3Aws.employeeAndAs3.employeeInfo)
                    },
                    (empS3AwsInfo, updatedEmployee) => ({ empS3AwsInfo, updatedEmployee }))
                    // .do(data13 => { console.log('data13>> ', data13); })
                    .share()
            )

        } else {
            // this.refreshEditor(logMsg, employee);
            observable = creatORUpdateObservable;
        }

        observable.subscribe(
            (data) => {
                this.isSubmit = false;
                console.log('contact Data', data);
                if (boundEmployee.id) {
                    this.refreshEditor('Employee Updated', data)
                    this.toasterService.pop('success', 'UPDATE', 'Employee has been updated successfully');
                } else {
                    this.refreshEditor('Employee created', data)
                    this.toasterService.pop('success', 'SAVED', 'Employee has been saved successfully');

                }
            },
            error => {
                this.isSubmit = false;
                if (boundEmployee.id) {
                    this.toasterService.pop('error', 'UPDATE', 'Employee not updated due to API error!!!');
                } else {
                    this.toasterService.pop('error', 'SAVED', 'Employee not Saved due to API error!!!');
                }
            });
        return observable;
    }

    private refreshEditor (logMsg, employee) {
        console.log(logMsg, employee);
        this.getAllEmployees(this.currentCompanyId);
        this.closeModal();
        this.showSaveSpinner = false;
    }
    // private uploadtFile (logMsg: string, employee: any) {
    //     if (this.photoFile) {
    //         let url = 's3filesignature/?name=' + this.photoFile.name + '&type=' + this.photoFile.type + '&etype=emp&rid=' + this.currentCompanyId;
    //         this.employeeService.get(url).subscribe(s3Data => {
    //             this.uploadToAws(this.photoFile, s3Data.data, s3Data.url, employee);
    //         });
    //     } else {
    //         this.refreshEditor(logMsg, employee);
    //     }
    // }

    uploadToAws (file: File, s3Data: any, url: string, employee): Observable<any> {
        let observable: Observable<any>;

        var postData = new FormData();
        for (let key in s3Data.fields) {
            postData.append(key, s3Data.fields[key]);
        }
        postData.append('file', file);
        observable = this.employeeService.postToS3(s3Data.url, postData);
        observable.subscribe(data => {
            console.log('postToS3', data);
            console.log('Should be accessible through: ' + url);
            // employee.photo = url;
            // this.employeeService.update(employee).subscribe(data => {
            //     this.refreshEditor('Saved emp to db', data);
            // });
        })

        return observable;
    }

    photoSelectionChange (event) {
        let fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            this.photoFile = fileList[0];
            this.selectedPhoto = this.photoFile.name;
            console.log('Selected file type is: ' + fileList[0].type);
        }
    }

    setBuildingList () {
        let buildingList = this.itemsToString(this.selectedBuildings);
        buildingList = buildingList.split(',').filter(item => item != '-1').join(',');
        this.employeeForm.get('building_list').setValue(buildingList == "" ? "-1" : buildingList);
    }
    setProblemTypeLsit () {
        let problemTypeList = this.itemsToString(this.selectedProblemTypes);
        problemTypeList = problemTypeList.split(',').filter(item => item != '-1').join(',');
        this.employeeForm.get('problem_type_list').setValue(problemTypeList == "" ? "-1" : problemTypeList);
    }
    public selectedBuilding (value: any): void {
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

    public removedBuilding (value: any): void {

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

    public selectedProblemType (value: any): void {
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

    public removedProblemType (value: any): void {
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

    public itemsToString (value: Array<any> = []): string {
        return value
            .map((item: any) => {
                return item.id;
            }).join(',');
    }

    buildAddressHtml (employee: any) {
        return this.dataService.buildEmployeedAddressHtml(employee);
    }

    getPhotoUrl (employee) {
        if (employee.photo != null && employee.photo.length > 0)
            return employee.photo;
        return 'assets/img/placeholders/avatars/avatar9.jpg';
    }

    closeModal () {
        this.resetForm();
        this.selectedBuildings = [{ id: -1, text: 'All' }];
        this.selectedProblemTypes = [{ id: -1, text: 'All' }];
        this.setBuildingList();
        this.setProblemTypeLsit();
        this.switchTab(1);
        $('#modal-add-employee').modal('hide');
    }

    resetForm () {
        this.photoFile = null;
        this.selectedPhoto = '';
        this.employeeForm.reset({
            company: config.api.base + 'company/' + this.currentCompanyId + '/',
            receive_email: true,
            active: true,
            wireless_email: ''
        });
    }

    onVerifyEmail (event) {
        this.verifyEmailService.verifyEmail(event.target.value, this.employeeForm.get('user_id').value);
    }
}

