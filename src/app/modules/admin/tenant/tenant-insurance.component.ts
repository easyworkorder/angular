import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { TenantService } from "./tenant.service";
import { DataService } from "app/services";
import { ActivatedRoute } from "@angular/router";
import { AuthenticationService } from "app/modules/authentication";
import { FormBuilder, FormControl, Validators, FormGroup } from "@angular/forms";
import { ValidationService } from "app/services/validation.service";
import config from '../../../config';
import { UpdateTenantInsuranceService } from "./tenant-insurance.service";
declare var $: any;

@Component({
    selector: 'ewo-tenant-insurance',
    templateUrl: './tenant-insurance.component.html'
})
export class TenantInsuranceComponent implements OnInit {
    @Input() tenant: any;
    @Input() updateInsuranceDataInfo: any;
    @Output('update') change: EventEmitter<any> = new EventEmitter<any>();

    exp_date_not_valid = true;
    isSubmit: boolean = false;

    constructor(
        private tenantService: TenantService,
        private formBuilder: FormBuilder,
        private authService: AuthenticationService,
        private route: ActivatedRoute,
        private dataService: DataService,
        private updateTenantInsuranceService: UpdateTenantInsuranceService) {
        this.updateTenantInsuranceService.updateInsuranceInfo$.subscribe((data: any) => {
            this.updateInsuranceDataInfo = data;
            data.exp_date = data.exp_date ? data.exp_date.toDate() : data.exp_date;
            this.tenantInsuranceForm.patchValue(this.updateInsuranceDataInfo);
        });
    }

    ngOnInit () {
        $('#add-tenant-insurance').on('hidden.bs.modal', () => {
            this.closeModal();
        });
    }

    tenantInsuranceForm = new FormGroup({
        id: new FormControl(),
        url: new FormControl(''),
        type: new FormControl(''),
        exp_date: new FormControl(null),
        per_occur: new FormControl('', [Validators.required]),
        aggregate: new FormControl('', [Validators.required]),
        tenant: new FormControl('')
    });


    onSubmit () {

        // if (this.tenantInsuranceForm.get('exp_date').value) {
        //     let date: Date = this.tenantInsuranceForm.get('exp_date').value;
        //     if(date.toString().indexOf('T') > -1) {
        //         let dateAndTime = date.toISOString().split('T');
        //         this.tenantInsuranceForm.get('exp_date').setValue(dateAndTime[0]);
        //     }
        //     else {
        //         this.tenantInsuranceForm.get('exp_date').setValue(date);
        //     }

        // }
        // else{
        //     this.exp_date_not_valid = true;
        //     return;
        // }

        this.exp_date_not_valid = false;

        if (this.dataService.dateValidation(this.tenantInsuranceForm.get('exp_date'))) {
            this.exp_date_not_valid = true;
        } else {
            this.exp_date_not_valid = false;
            return;
        }

        if (!this.tenantInsuranceForm.valid) { return; }

        //Update People
        if (this.tenantInsuranceForm.value.id) {
            this.tenantService.updateTenantInsurance(this.tenantInsuranceForm.value).subscribe((insurance: any) => {
                this.isSubmit = false;
                this.change.emit(true);
                this.closeModal();
            },
                error => {
                    this.isSubmit = false;
                });
            return;
        }

        //Add people
        this.tenantInsuranceForm.get('tenant').setValue(`${config.api.base}tenant/${this.tenant.id}/`);
        let val = this.tenantInsuranceForm.value;
        this.tenantInsuranceForm.removeControl('id');
        this.tenantInsuranceForm.removeControl('url');
        this.tenantService.createTenantInsurance(this.tenantInsuranceForm.value).subscribe((insurance: any) => {
            this.isSubmit = false;
            this.change.emit(true);
            this.closeModal();
        },
            error => {
                this.isSubmit = false;
            });
        this.tenantInsuranceForm.addControl('id', new FormControl());
        this.tenantInsuranceForm.addControl('url', new FormControl());
    }

    closeModal () {
        this.isSubmit = false;
        this.resetForm();
        $('#add-tenant-insurance').modal('hide');
    }

    resetForm () {
        this.tenantInsuranceForm.reset({
            type: { type: '' },
            exp_date: '',
            per_occur: '',
            aggregate: ''
        });
        this.exp_date_not_valid = true;
    }

    onSelectDate (value) {
        this.exp_date_not_valid = true;
    }
}
