import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray, AbstractControl } from '@angular/forms';
import { VendorService } from './vendor.service';
import { ProblemTypeService } from './../problem_type/problem_type.service';
import { ValidationService } from './../../../services/validation.service';
import { AuthenticationService } from "app/modules/authentication";
import config from '../../../config';
import { BreadcrumbHeaderService } from "app/modules/shared/breadcrumb-header/breadcrumb-header.service";
import { VerifyEmailService } from "app/modules/shared/verify-email.service";
import { AppHttp } from "app/services";
declare var $: any;

export class TabVisibility {
    isBasicTabVisible = true;
    isContactTabVisible = false;
    isInsuranceTabVisible = false;
    selectedTabNo = 1;
}

@Component({
    selector: 'ewo-vendor',
    templateUrl: './vendor.component.html',
})
export class VendorComponent implements OnInit {
    isShowingLoadingSpinner: boolean = true;
    isSubmit: boolean = false;
    config = config;
    currentCompanyId = 1;
    isSuccess: boolean = false;
    problemTypes: any[] = [];
    vendors: any[] = [];
    selectedProblemTypes: any[] = []; //[{ id: -1, text: 'All' }];
    searchControl: FormControl = new FormControl('');
    _submitted: boolean = false;
    exp_date_not_valid: boolean = false;
    photoFile: File
    selectedPhotoFile: string = '';

    isExpireDateValid: boolean = true;

    toDeletedVendor: any;

    tabs = new TabVisibility();
    defaultInsuranceTypes: any[] = [];

    constructor(
        private vendorService: VendorService,
        private problemTypeService: ProblemTypeService,
        private formBuilder: FormBuilder,
        private authService: AuthenticationService,
        private breadcrumbHeaderService: BreadcrumbHeaderService,
        private verifyEmailService: VerifyEmailService,
        private http: AppHttp
    ) {

    }

    ngOnInit () {

        this.authService.verifyToken().take(1).subscribe(data => {
            this.getAllVendors();
            this.getAllActiveProblemTypes();
        });

        $('#modal-add-vendor').on('hidden.bs.modal', () => {
            this.closeModal();
        });
        this.breadcrumbHeaderService.setBreadcrumbTitle('Vendors');
        // Initialize the Vendor Insurance Form
        this.http.get('insurancetype/').subscribe(data => {
            let insuranceTypes = <FormArray>this.vendorForm.get('insurance_types');
            for (let insuranceType of data.results) {
                this.defaultInsuranceTypes.push(insuranceType);
            }
            this.bindDefaultInsurances();
        })
    }
    private bindDefaultInsurances () {
        let insuranceTypes = <FormArray>this.vendorForm.get('insurance_types');
        for (let i = insuranceTypes.length - 1; i >= 0; i--) {
            insuranceTypes.removeAt(i);
        }
        for (let insuranceType of this.defaultInsuranceTypes) {
            insuranceTypes.push(this.buildInsuranceForm(insuranceType.id, insuranceType.type));
        }

    }
    ngAfterViewChecked () {
        $(function () {
            $('[data-toggle="tooltip"]').tooltip({ container: 'body' })
        })
    }

    vendorForm = this.formBuilder.group({
        // building: new FormControl('http://localhost:8080/api/building/6/'),
        id: new FormControl(),
        company: new FormControl(config.api.base + 'company/' + this.currentCompanyId + '/'),
        company_name: new FormControl('', Validators.required),
        problem_types: new FormControl(''),
        address: new FormControl('', Validators.required),
        city: new FormControl('', Validators.required),
        state: new FormControl('', Validators.required),
        postal_code: new FormControl('', Validators.required),
        gl_expire_date: new FormControl(null),
        active: new FormControl(true),
        vendor_contacts: this.formBuilder.array(
            [this.buildBlankContact('', '', '', '', '', '', '', '', '', true, null, '', true)],
            null
            // ItemsValidator.minQuantitySum(300)
        ),
        insurance_types: this.formBuilder.array([], null)
    })

    buildBlankContact (firstName: string, lastName: string, title: string,
        phone: string, extension: string, mobile: string, emergencyPhone: string, fax: string,
        email: string, isPrimaryContact: boolean, vendorID: number, notes: string, active: boolean) {
        return new FormGroup({
            id: new FormControl(),
            url: new FormControl(''),
            first_name: new FormControl(firstName, Validators.required),
            last_name: new FormControl(lastName, Validators.required),
            title: new FormControl(title),
            phone: new FormControl(phone),
            phone_extension: new FormControl(extension),
            mobile: new FormControl(mobile),
            emergency_phone: new FormControl(emergencyPhone),
            fax: new FormControl(fax),
            email: new FormControl(email, [Validators.required, ValidationService.emailValidator]),
            isprimary_contact: new FormControl(isPrimaryContact),
            vendor: new FormControl(vendorID),
            notes: new FormControl(notes),
            photo: new FormControl(),
            active: new FormControl(true)
        });
    }

    buildInsuranceForm (id: string, type: string) {
        return new FormGroup({
            type_id: new FormControl(id),
            type_name: new FormControl(type),
            expire_date: new FormControl(null),
            per_occur: new FormControl(''),
            aggregate: new FormControl('')
        })
    }

    getAllVendors (): void {
        this.isShowingLoadingSpinner = true;
        this.vendorService.getAllVendors(this.currentCompanyId).subscribe(
            data => {
                this.vendors = data;
                this.isShowingLoadingSpinner = false;
            }
        );
    }


    getAllActiveProblemTypes (): void {
        this.problemTypeService.getAllActiveProblemTypes(this.currentCompanyId).subscribe(
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

    public itemsToString (value: Array<any> = []): string {
        return value
            .map((item: any) => {
                return item.id;
            }).join(',');
    }

    setProblemTypeLsit () {
        let problemTypeList = this.itemsToString(this.selectedProblemTypes);
        problemTypeList = problemTypeList.split(',').filter(item => item != '-1').join(',');
        this.vendorForm.get('problem_types').setValue(problemTypeList == "" ? "-1" : problemTypeList);
    }

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

        this.selectedProblemTypes.push(value);
        this.setProblemTypeLsit();
    }

    public removedProblemType (value: any): void {
        let sel = [];
        this.selectedProblemTypes.forEach(item => {
            if (item.id != value.id) {
                sel.push(item);
            }
        });
        this.selectedProblemTypes = sel;
        this.setProblemTypeLsit();
    }

    photoSelectionChange (event) {
        let fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            this.photoFile = fileList[0];
            this.selectedPhotoFile = this.photoFile.name;
        }
    }

    onSubmit () {
        this._submitted = true;
        if (!this.validateBasicInfo()) {
            this.switchTab(1);
        } else if (!this.validateContactInfo()) {
            this.switchTab(2);
        }

        if (this.verifyEmailService.isEmailDuplicate) return;

        this.isExpireDateValid = false;

        // Commenting by shahin May31-2017
        // if (this.dateValidation(this.vendorForm.get('gl_expire_date'))) {
        //     this.isExpireDateValid = true;
        // } else {
        //     this.isExpireDateValid = false;
        //     return;
        // }

        /**
        * Problem type validation
        */
        if (this.selectedProblemTypes.length == 0) {
            this.switchTab(1);
            return;
        }

        if (!this.vendorForm.valid) { return; }

        // let phone = this.vendorForm.get('phone').value;
        // let emergency_phone = this.vendorForm.get('emergency_phone').value;
        // this.vendorForm.get('phone').setValue(phone.toNormalText());
        // this.vendorForm.get('emergency_phone').setValue(emergency_phone.toNormalText());


        /**
         * Expire Date validation
         */
        // if (this.vendorForm.get('gl_expire_date').value) {
        //     let date: Date = this.vendorForm.get('gl_expire_date').value;
        //     if (date.toString().indexOf('T') > -1) {
        //         let dateAndTime = date.toISOString().split('T');
        //         this.vendorForm.get('gl_expire_date').setValue(dateAndTime[0]);
        //     }
        //     else {
        //         this.vendorForm.get('gl_expire_date').setValue(date);
        //     }

        // }
        // else {
        //     this.exp_date_not_valid = true;
        //     this.switchTab(1);
        //     return;
        // }

        // Commenting by shahin May31-2017
        // let expireDate = this.vendorForm.get('gl_expire_date').value;
        // let expireDateString = null;
        // if (expireDate) {
        //     expireDate = new Date(expireDate);
        //     expireDateString = expireDate.toISOString();
        //     // this.tenantForm.get('inscertdate').setValue(inscertDateString);
        // }

        // let val = this.vendorForm.value;
        // this.vendorService.create(this.vendorForm.value).subscribe((vendor: any) => {
        //     this.isSuccess = true;
        //     this.closeModal();
        //     this.getAllVendors();
        // });
        this.vendorForm.get('company').setValue(`${config.api.base}company/${this.currentCompanyId}/`);
        // Save operation with/without photo begins from here
        let contactFormArray = this.vendorForm.get('vendor_contacts') as FormArray;
        let contactForm = contactFormArray.at(0) as FormGroup;

        // this.vendorForm.removeControl('vendor_contacts');
        let vendorData = this.vendorForm.value;
        // Commenting by shahin May31-2017
        // if (expireDateString)
        //     vendorData.gl_expire_date = expireDateString;

        if (vendorData.vendor_contacts) { delete vendorData.vendor_contacts; }
        if (vendorData.insurance_types) { delete vendorData.insurance_types; }

        this.isSubmit = true;

        this.vendorService.saveVendor(vendorData).subscribe((vendor: any) => {
            // Vendor Saved lets go for saving contact with/without file
            this.vendorService.saveContact(this.photoFile, contactForm, vendor, this.refreshEditor).subscribe((contact: any) => {
                this.isSubmit = false;
                this.refreshEditor('Vendor & Vendor Contact Saved successfully.', contact);
            },
                error => {
                    this.isSubmit = false;
                });
            let vendorInsurances: any[] = [];
            for (let data of this.vendorForm.value.insurance_types) {
                vendorInsurances.push({
                    'vendor': vendor.id,
                    'type': data.type_id,
                    'aggregate': data.aggregate,
                    'exp_date': data.expire_date,
                    'per_occur': data.per_occur
                });
            }
            this.http.post('insurancedata/?isvendor=true', vendorInsurances).subscribe(data => {
                console.log('Vendor Insurance Saved Successfully.');
            })

        },
            error => {
                this.isSubmit = false;
            });
    }

    private refreshEditor (logMsg: string, obj: any) {
        this.isSuccess = true;
        this.closeModal();
        this.getAllVendors();
    }

    validateBasicInfo () {
        return this.vendorForm.get('company_name').valid &&
            this.vendorForm.get('address').valid &&
            this.vendorForm.get('city').valid &&
            this.vendorForm.get('state').valid &&
            this.vendorForm.get('postal_code').valid;
        // Commenting by shahin May31-2017
        // && this.dateValidation(this.vendorForm.get('gl_expire_date'));
        //&& this.vendorForm.get('mgtfeepercent').valid;
    }

    validateContactInfo () {
        return this.vendorForm.get('vendor_contacts').valid;
    }

    switchTab (tabId: number) {
        if (tabId < 1) // First tabs back button click
            tabId = 1;
        else if (tabId > 3) //This is the last tab's next button click
            tabId = 3;
        this.tabs.isBasicTabVisible = tabId == 1 ? true : false;
        this.tabs.isContactTabVisible = tabId == 2 ? true : false;
        this.tabs.isInsuranceTabVisible = tabId == 3 ? true : false;
        this.tabs.selectedTabNo = tabId;
    }

    closeModal () {
        this.resetForm();
        this.switchTab(1);
        $('#modal-add-vendor').modal('hide');
    }

    resetForm () {
        this.photoFile = null;
        this.selectedPhotoFile = '';
        this.selectedProblemTypes = [];
        this.vendorForm.reset({
            company: new FormControl(config.api.base + 'company/' + this.currentCompanyId + '/'),
            company_name: '',
            active: true,
            vendor_contacts: [{
                title: '',
                isprimary_contact: true,
                active: true
            }]
        });
        this.bindDefaultInsurances();
    }

    onVerifyEmail (event) {
        this.verifyEmailService.verifyEmail(event.target.value, '');
    }
    dateValidation (control: AbstractControl): boolean {
        return control.value !== null && control.value !== undefined && control.value !== '' ? true : false;
    }
    onSelectDate (value) {
        this.isExpireDateValid = true;
    }

    deleteVendor (vendor) {
        $('#modal-vendor-delete-confirm').modal({
            modal: 'show',
            backdrop: 'static'
        });
        this.toDeletedVendor = vendor;
    }
    onModalOkButtonClick (event) {
        if (this.toDeletedVendor) {
            this.toDeletedVendor.url = config.api.base + 'vendor/' + this.toDeletedVendor.id + '/';
            this.vendorService.getVendor(this.toDeletedVendor.url).subscribe(data => {
                this.vendorService.deleteVendor(data).subscribe(() => {
                    $('#modal-vendor-delete-confirm').modal('hide');
                    this.getAllVendors();
                });
            });
        }
    }

    onInsuranceExpireDateSelect (value, index) {
        console.log('The Index Is: ' + index);
    }
}

