import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { DataService } from "app/services";
import { TenantService } from "app/modules/admin/tenant/tenant.service";
import { ToasterService } from "angular2-toaster/angular2-toaster";
declare var $: any;

@Component({
    selector: 'ewo-tenant-edit',
    templateUrl: './tenant-edit.component.html'
})
export class TenantEditComponent implements OnInit {

    @Input() tenant: any;
    @Output('update') change: EventEmitter<any> = new EventEmitter<any>();

    isSubmit: boolean = false;
    isInscertdateValid: boolean = true;

    editedTenantInfo: any;
    tenantForm = this.formBuilder.group({
        // building: new FormControl('http://localhost:8080/api/building/6/'),
        building: new FormControl(),
        tenant_company_name: new FormControl('', Validators.required),
        inscertdate: new FormControl(''),
        mgtfeepercent: new FormControl('', [Validators.required]),
        // gl_notify: new FormControl(true),
        unitno: new FormControl('', Validators.required),
        // isactive: new FormControl(true)
        id: new FormControl(),
        url: new FormControl(),
    })
    constructor(
        private formBuilder: FormBuilder,
        private dataService: DataService,
        private tenantService: TenantService,
        private toasterService: ToasterService

    ) { }

    ngOnInit () {
    }
    ngOnChanges (changes) {
        if (changes['tenant']) {
            if (changes['tenant'].currentValue) {
                this.editedTenantInfo = changes['tenant'].currentValue;
                this.editedTenantInfo.inscertdate = this.editedTenantInfo.inscertdate.toDate();
                this.tenantForm.patchValue(this.editedTenantInfo);
            }
        }
    }
    onSubmit () {
        this.isInscertdateValid = false;

        if (this.dataService.dateValidation(this.tenantForm.get('inscertdate'))) {
            this.isInscertdateValid = true;
        } else {
            this.isInscertdateValid = false;
            return;
        }
        //isInscertdateInValid

        // this.verifyEmailService.isEmailDuplicate
        if (!this.tenantForm.valid) { return; }

        // material.date.toDate()

        let tenantData = this.tenantForm.value;
        if (tenantData.inscertdate)
            tenantData.inscertdate = tenantData.inscertdate.toDate();
        this.isSubmit = true;
        this.tenantService.saveTenant(tenantData).subscribe((tenant: any) => {
            this.change.emit(tenant);
            this.toasterService.pop('success', 'EDIT', 'Tenant has been saved successfully');
            this.isSubmit = false;
            $('#edit-tenant-modal').modal('hide');
        },
            error => {
                this.isSubmit = false;
            });
    }

    onSelectDate (value) {
        this.isInscertdateValid = true;
    }
}
