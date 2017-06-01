import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { DataService } from "app/services";
import { TenantService } from "app/modules/admin/tenant/tenant.service";
import { ToasterService } from "angular2-toaster/angular2-toaster";
import { ActivatedRoute } from "@angular/router";
import config from '../../../config';
declare var $: any;

import { Subject } from "rxjs/Subject";

@Component({
    selector: 'ewo-tenant-edit',
    templateUrl: './tenant-edit.component.html'
})
export class TenantEditComponent implements OnInit {

    @Input('edit') editClicked: Subject<any>;
    @Output('update') change: EventEmitter<any> = new EventEmitter<any>();

    isSubmit: boolean = false;
    isInscertdateValid: boolean = true;
    editedTenantInfo: any;

    tenantForm = this.formBuilder.group({
        building: new FormControl(),
        tenant_company_name: new FormControl('', Validators.required),
        // inscertdate: new FormControl(''),
        mgtfeepercent: new FormControl('', [Validators.required]),
        unitno: new FormControl('', Validators.required),
        id: new FormControl(),
        url: new FormControl(),
    })
    constructor(
        private formBuilder: FormBuilder,
        private dataService: DataService,
        private tenantService: TenantService,
        private toasterService: ToasterService,
        private route: ActivatedRoute

    ) { }

    ngOnInit () {
        this.editClicked.subscribe((tenant) => {
            this.setEditedTenantInfo(tenant);
        });
    }

    setEditedTenantInfo (tenant) {
        this.editedTenantInfo = tenant;
        // this.editedTenantInfo.inscertdate = this.editedTenantInfo && this.editedTenantInfo.inscertdate.toDate();
        this.tenantForm.patchValue(this.editedTenantInfo);
    }

    onSubmit () {
        this.isInscertdateValid = false;

        // if (this.dataService.dateValidation(this.tenantForm.get('inscertdate'))) {
        //     this.isInscertdateValid = true;
        // } else {
        //     this.isInscertdateValid = false;
        //     return;
        // }

        if (!this.tenantForm.valid) { return; }

        let tenantData = this.tenantForm.value;
        // if (tenantData.inscertdate)
        //     tenantData.inscertdate = tenantData.inscertdate.toDate();
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
