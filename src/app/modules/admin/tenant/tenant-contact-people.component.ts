import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { TenantService } from "app/modules/admin/tenant/tenant.service";
import { BuildingService } from "app/modules/admin/building/building.service";
import { DataService } from "app/services";
import { ActivatedRoute } from "@angular/router";
import { AuthenticationService } from "app/modules/authentication";
import { FormBuilder, FormControl, Validators, FormGroup } from "@angular/forms";
import { ValidationService } from "app/services/validation.service";
import config from '../../../config';
import { UpdatePeopleService } from "app/modules/admin/tenant/people.service";
declare var $: any;

@Component({
    selector: 'ewo-tenant-contact-people',
    templateUrl: './tenant-contact-people.component.html',
    styleUrls: ['./tenant-contact-people.component.css']
})
export class TenantContactPeopleComponent implements OnInit {
    @Input() tenant: any;
    @Input() updatePeopleInfo: any;
    @Output('update') change: EventEmitter<any> = new EventEmitter<any>();
    // @Output('updatePeople') changePeople: EventEmitter<any> = new EventEmitter<any>();

    viewInvoicesList = [
        { value: true, display: 'Yes, they are authorized (default)' },
        { value: false, display: 'No, they are not authorized' }
    ];

    constructor(
        private tenantService: TenantService,
        private buildingService: BuildingService,
        private formBuilder: FormBuilder,
        private authService: AuthenticationService,
        private route: ActivatedRoute,
        private dataService: DataService,
        private updatePeopleService: UpdatePeopleService) {
        this.updatePeopleService.updatePeopleInfo$.subscribe(data => {
            this.updatePeopleInfo = data;
            console.log('people>>>', this.updatePeopleInfo);
        });
    }

    ngOnInit() {
        console.log('Edited Data', this.updatePeopleInfo);
    }

    tenantContactPeopleForm = new FormGroup({
        title: new FormControl(''),
        notes: new FormControl(''),
        viewinvoices: new FormControl(true),
        first_name: new FormControl('', Validators.required),
        last_name: new FormControl('', Validators.required),
        phone: new FormControl(''),
        extension: new FormControl(''),
        mobile: new FormControl(''),
        emergency_phone: new FormControl(''),
        fax: new FormControl(''),
        email: new FormControl('', [Validators.required, ValidationService.emailValidator]),
        isprimary_contact: new FormControl(false),
        tenant: new FormControl(''),
        active: new FormControl(true)
    });


    onSubmit() {

        if (!this.tenantContactPeopleForm.valid) { return; }

        this.tenantContactPeopleForm.get('tenant').setValue(`${config.api.base}tenant/${this.tenant.id}/`);
        let val = this.tenantContactPeopleForm.value;
        this.tenantService.createTenantContact(this.tenantContactPeopleForm.value).subscribe((tenant: any) => {
            // console.log('Tenant created', tenant);
            // this.getAllTenantsByBuilding(this.buildingId);
            // this.isSuccess = true;
            this.change.emit(true);
            this.closeModal();
        });
    }

    closeModal() {
        this.resetForm();
        $('#add-tenant-cotact-people').modal('hide');
    }

    resetForm() {
        this.tenantContactPeopleForm.reset({
            isprimary_contact: false,
            active: true,
            viewinvoices: true
        });
    }

}
