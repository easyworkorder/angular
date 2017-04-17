import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray, AbstractControl, ValidatorFn } from '@angular/forms';
import { TenantService } from './tenant.service';
import { BuildingService } from './../building/building.service';
import { ValidationService } from './../../../services/validation.service';
import { AuthenticationService } from "app/modules/authentication";
import { ActivatedRoute } from "@angular/router";
import config from '../../../config';
import { DataService } from "app/services";
import { VerifyEmailService } from "app/modules/shared/verify-email.service";
declare var $: any;

export class TabVisibility {
    isBasicTabVisible = true;
    isContactTabVisible = false;
    selectedTabNo = 1;
}

@Component({
    selector: 'ewo-tenant',
    templateUrl: './tenant.component.html',
})
export class TenantComponent implements OnInit {
    isShowingLoadingSpinner: boolean = true;
    isSubmit: boolean = false;
    currentCompanyId = 1;
    isSuccess: boolean = false;
    exp_date_not_valid: boolean = false;
    viewInvoicesList = [
        { value: true, display: 'Yes, they are authorized (default)' },
        { value: false, display: 'No, they are not authorized' }
    ];
    buildings: any[] = [];
    tenants: any[] = [];
    selectedBuilding: any;
    buildingId: any;
    searchControl: FormControl = new FormControl('');
    photoFile: File
    selectedPhotoFile: string = '';
    // isEmailDuplicate: boolean = false;
    // emailDuplicateMsg: string = 'Email already used!!!';
    isInscertdateValid: boolean = true;

    tabs = new TabVisibility();

    constructor(
        private tenantService: TenantService,
        private buildingService: BuildingService,
        private formBuilder: FormBuilder,
        private authService: AuthenticationService,
        private route: ActivatedRoute,
        private dataService: DataService,
        private verifyEmailService: VerifyEmailService) {

    }

    ngOnInit () {
        this.buildingId = this.route.snapshot.params['id'];

        this.authService.verifyToken().take(1).subscribe(data => {
            // this.getAllBuildings();
            this.getAllTenantsByBuilding(this.buildingId);
        });

        $('#modal-add-tenant').on('hidden.bs.modal', () => {
            this.closeModal();
        });
        // this.authService.emailVerifyInfo$.subscribe((data: any) => {
        //     this.isEmailDuplicate = data ? data : false;
        // });
    }

    tenantForm = this.formBuilder.group({
        // building: new FormControl('http://localhost:8080/api/building/6/'),
        building: new FormControl(),
        tenant_company_name: new FormControl('', Validators.required),
        // inscertdate: new FormControl('', this.dateValided()),
        inscertdate: new FormControl(''),
        mgtfeepercent: new FormControl('', [Validators.required]),
        gl_notify: new FormControl(true),
        unitno: new FormControl('', Validators.required),
        isactive: new FormControl(true),
        tenant_contacts: this.formBuilder.array(
            [this.buildBlankContact('', '', '', true, '', '', '', '', '', '', true, null, '')],
            null
            // ItemsValidator.minQuantitySum(300)
        )
    })

    buildBlankContact (firstName: string, lastName: string, title: string, viewinvoices: boolean,
        phone: string, extension: string, mobile: string, emergencyPhone: string, fax: string,
        email: string, isPrimaryContact: boolean, tenantID: number, notes: string) {
        return new FormGroup({
            id: new FormControl(),
            url: new FormControl(''),
            title: new FormControl(title),
            notes: new FormControl(notes),
            viewinvoices: new FormControl(true),
            first_name: new FormControl(firstName, Validators.required),
            last_name: new FormControl(lastName, Validators.required),
            phone: new FormControl(phone),
            extension: new FormControl(extension),
            mobile: new FormControl(mobile),
            emergency_phone: new FormControl(emergencyPhone),
            fax: new FormControl(fax),
            email: new FormControl(email, [Validators.required, ValidationService.emailValidator]),
            isprimary_contact: new FormControl(isPrimaryContact),
            tenant: new FormControl(tenantID),
            active: new FormControl(true),
            photo: new FormControl(),
            user_id: new FormControl()
        });
    }


    getAllBuildings (): void {
        this.buildingService.getAllBuildings(this.currentCompanyId).subscribe(
            data => {
                this.buildings = data;
                if (this.buildings.length > 0) {
                    this.selectedBuilding = this.buildings[0];
                    this.getAllTenantsByBuilding(this.buildings[0].id);
                }
            }
        );
    }

    getAllTenantsByBuilding (building_id): void {
        this.isShowingLoadingSpinner = true;
        this.tenantService.getAllTenantsByBuilding(building_id).subscribe(
            data => {
                this.tenants = data.length > 0 && data.filter(d => d.contact_id !== null) || [];
                this.isShowingLoadingSpinner = false;
            }
        );
    }

    photoSelectionChange (event) {
        let fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            this.photoFile = fileList[0];
            this.selectedPhotoFile = this.photoFile.name;
        }
    }

    onSubmit () {
        if (!this.validateBasicInfo()) {
            this.switchTab(1);
        } else if (!this.validateContactInfo()) {
            this.switchTab(2);
        }
        // console.log('is Email duplicate', this.verifyEmailService.isEmailDuplicate);
        if (this.verifyEmailService.isEmailDuplicate) return;

        // this.tenantForm.markAsUntouched();

        this.isInscertdateValid = false;

        if (this.dateValidation(this.tenantForm.get('inscertdate'))) {
            this.isInscertdateValid = true;
        } else {
            this.isInscertdateValid = false;
            return;
        }
        //isInscertdateInValid

        // this.verifyEmailService.isEmailDuplicate
        if (!this.tenantForm.valid) { return; }

        /**
         * Expire Date validation
         */
        // FIXME: Failing with error Unexpected literal at position 2 while calling this.tenantForm.get('inscertdate').setValue(dateAndTime[0]);
        // if (this.tenantForm.get('inscertdate').value) {
        //     let date: Date = this.tenantForm.get('inscertdate').value;
        //     if(date.toString().indexOf('T') > -1) {
        //         let dateAndTime = date.toISOString().split('T');
        //         this.tenantForm.get('inscertdate').setValue(dateAndTime[0]);
        //     }
        //     else {
        //         this.tenantForm.get('inscertdate').setValue(date);
        //     }
        // }
        // else {
        //     this.exp_date_not_valid = true;
        //     this.switchTab(1);
        //     return;
        // }
        let inscertDate = this.tenantForm.get('inscertdate').value;
        let inscertDateString = null;
        if (inscertDate) {
            console.log('The Given Date Is: ' + inscertDate);
            inscertDate = new Date(inscertDate);
            inscertDateString = inscertDate.toISOString();
            console.log('The UTC/ISO Representation: ' + inscertDateString);
            // this.tenantForm.get('inscertdate').setValue(inscertDateString);
        }
        this.tenantForm.get('building').setValue(`${config.api.base}building/${this.buildingId}/`);
        // Save operation with/without photo begins from here
        let contactFormArray = this.tenantForm.get('tenant_contacts') as FormArray;
        let contactForm = contactFormArray.at(0) as FormGroup;

        // this.tenantForm.removeControl('tenant_contacts');
        let tenantData = this.tenantForm.value;
        if (tenantData.tenant_contacts) { delete tenantData.tenant_contacts; }
        if (inscertDateString)
            tenantData.inscertdate = inscertDateString;
        this.isSubmit = true;
        this.tenantService.saveTenant(tenantData).subscribe((tenant: any) => {
            // Tenant Saved lets go for saving contact with/without file
            console.log('Tenant Saved');
            // this.tenantService.saveContact(this.photoFile, contactForm, tenant, this.refreshEditor);
            this.tenantService.saveContact(this.photoFile, contactForm, tenant, this.refreshEditor).subscribe(
                (contact: any) => {
                    this.isSubmit = false;
                    this.refreshEditor('Tenant & Tenant Contact Saved successfully.', contact);
                },
                error => {
                    this.isSubmit = false;
                });
        },
            error => {
                this.isSubmit = false;
            });
    }

    private refreshEditor (logMsg: string, obj: any) {
        console.log(logMsg, obj);
        this.getAllTenantsByBuilding(this.buildingId);
        this.closeModal();
    }

    validateBasicInfo () {
        return this.tenantForm.get('tenant_company_name').valid &&
            this.tenantForm.get('mgtfeepercent').valid && this.dateValidation(this.tenantForm.get('inscertdate'));
    }

    validateContactInfo () {
        return this.tenantForm.get('tenant_contacts').valid;
    }

    switchTab (tabId: number) {
        if (tabId < 1) // First tabs back button click
            tabId = 1;
        else if (tabId > 3) //This is the last tab's next button click
            tabId = 3;
        this.tabs.isBasicTabVisible = tabId == 1 ? true : false;
        this.tabs.isContactTabVisible = tabId == 2 ? true : false;
        this.tabs.selectedTabNo = tabId;
    }

    buildName (firstName: string, lastName: string) {
        if (firstName != null && firstName.length > 0 && lastName != null && lastName.length > 0) {
            return lastName + ' ' + firstName;
        }
        if (firstName != null && firstName.length > 0)
            return firstName;
        if (lastName != null && lastName.length > 0)
            return lastName;
        return '';
    }

    buildAddressHtml (tenant: any) {
        return this.dataService.buildAddressHtml(tenant, tenant.tenant_company_name);
    }

    getPhotoUrl (tenant) {
        // if (tenant.photo != null && tenant.photo.length > 0)
        //     return tenant.photo;
        // return 'assets/img/placeholders/avatars/avatar9.jpg';
        return this.dataService.getPhotoUrl(tenant.photo)
    }

    stopPropagation (event) {
        event.stopPropagation()
    }

    closeModal () {
        this.resetForm();
        this.switchTab(1);
        $('#modal-add-tenant').modal('hide');
    }

    resetForm () {
        this.photoFile = null;
        this.selectedPhotoFile = '';
        this.tenantForm.reset({
            building: new FormControl(config.api.base + 'building/' + this.buildingId + '/'),
            gl_notify: true,
            isactive: true,
            tenant_contacts: [{
                viewinvoices: true,
                isprimary_contact: true,
                active: true
            }]
        });
    }

    onVerifyEmail (event) {
        this.verifyEmailService.verifyEmail(event.target.value, '');
    }
    dateValidation (control: AbstractControl): boolean {
        return control.value !== null && control.value !== undefined && control.value !== '' ? true : false;
    }
    onSelectDate (value) {
        this.isInscertdateValid = true;
    }
}

