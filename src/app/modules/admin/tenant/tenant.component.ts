import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TenantService } from './tenant.service';
import { BuildingService } from './../building/building.service';
import { ValidationService } from './../../../services/validation.service';
import { AuthenticationService } from "app/modules/authentication";
import { ActivatedRoute } from "@angular/router";
import config from '../../../config';
import { DataService } from "app/services";
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
    currentCompanyId = 1;
    isSuccess: boolean = false;
    viewInvoicesList = [{ value: true, display: 'Yes, they are authorized (default)' }, { value: false, display: 'No, they are not authorized' }];
    buildings: any[] = [];
    tenants: any[] = [];
    selectedBuilding: any;
    buildingId: any;
    searchControl: FormControl = new FormControl('');

    tabs = new TabVisibility();

    constructor(
        private tenantService: TenantService,
        private buildingService: BuildingService,
        private formBuilder: FormBuilder,
        private authService: AuthenticationService,
        private route: ActivatedRoute,
        private dataService: DataService) {

    }

    ngOnInit() {
        this.buildingId = this.route.snapshot.params['id'];

        this.authService.verifyToken().take(1).subscribe(data => {
            // this.getAllBuildings();
            this.getAllTenantsByBuilding(this.buildingId);
        });

        $('#modal-add-tenant').on('hidden.bs.modal', () => {
            this.closeModal();
        });
    }

    tenantForm = this.formBuilder.group({
        // building: new FormControl('http://localhost:8080/api/building/6/'),
        building: new FormControl(),
        tenant_company_name: new FormControl('', Validators.required),
        inscertdate: new FormControl(null),
        mgtfeepercent: new FormControl('', [Validators.required]),
        gl_notify: new FormControl(true),
        unitno: new FormControl(''),
        isactive: new FormControl(true),
        tenant_contacts: this.formBuilder.array(
            [this.buildBlankContact('', '', '', true, '', '', '', '', '', '', true, null, '')],
            null
            // ItemsValidator.minQuantitySum(300)
        )
    })

    buildBlankContact(firstName: string, lastName: string, title: string, viewinvoices: boolean,
        phone: string, extension: string, mobile: string, emergencyPhone: string, fax: string,
        email: string, isPrimaryContact: boolean, tenantID: number, notes: string) {
        return new FormGroup({
            title: new FormControl(title),
            notes: new FormControl(notes),
            viewinvoices: new FormControl(viewinvoices),
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
            active: new FormControl(true)
        });
    }


    getAllBuildings(): void {
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

    getAllTenantsByBuilding(building_id): void {
        this.tenantService.getAllTenantsByBuilding(building_id).subscribe(
            data => {
                this.tenants = data.length > 0 && data.filter(d => d.contact_id !== null) || [];
            }
        );
    }

    onSubmit() {

        if (!this.validateBasicInfo()) {
            this.switchTab(1);
        } else if (!this.validateContactInfo()) {
            this.switchTab(2);
        }

        if (!this.tenantForm.valid) { return; }

        this.tenantForm.get('building').setValue(`${config.api.base}building/${this.buildingId}/`);
        let val = this.tenantForm.value;
        this.tenantService.create(this.tenantForm.value).subscribe((tenant: any) => {
            console.log('Tenant created', tenant);
            this.getAllTenantsByBuilding(this.buildingId);
            this.isSuccess = true;
            this.closeModal();
        });
    }

    validateBasicInfo() {
        return this.tenantForm.get('tenant_company_name').valid &&
            this.tenantForm.get('mgtfeepercent').valid;
    }

    validateContactInfo() {
        return this.tenantForm.get('tenant_contacts').valid;
    }

    switchTab(tabId: number) {
        if (tabId < 1) // First tabs back button click
            tabId = 1;
        else if (tabId > 3) //This is the last tab's next button click
            tabId = 3;
        this.tabs.isBasicTabVisible = tabId == 1 ? true : false;
        this.tabs.isContactTabVisible = tabId == 2 ? true : false;
        this.tabs.selectedTabNo = tabId;
    }

    buildName(firstName: string, lastName: string) {
        if (firstName != null && firstName.length > 0 && lastName != null && lastName.length > 0) {
            return lastName + ' ' + firstName;
        }
        if (firstName != null && firstName.length > 0)
            return firstName;
        if (lastName != null && lastName.length > 0)
            return lastName;
        return '';
    }

    buildAddressHtml(tenant: any) {
        return this.dataService.buildAddressHtml(tenant, tenant.tenant_company_name);
    }

    getPhotoUrl(tenant) {
        if (tenant.photo != null && tenant.photo.length > 0)
            return tenant.photo;
        return 'assets/img/placeholders/avatars/avatar9.jpg';
    }

    stopPropagation(event) {
        event.stopPropagation()
    }

    closeModal() {
        this.resetForm();
        this.switchTab(1);
        $('#modal-add-tenant').modal('hide');
    }

    resetForm() {
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

}

