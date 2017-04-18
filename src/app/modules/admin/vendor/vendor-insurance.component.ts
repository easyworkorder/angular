import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { VendorService } from "./vendor.service";
import { DataService } from "app/services";
import { ActivatedRoute } from "@angular/router";
import { AuthenticationService } from "app/modules/authentication";
import { FormBuilder, FormControl, Validators, FormGroup } from "@angular/forms";
import { ValidationService } from "app/services/validation.service";
import config from '../../../config';
import { UpdateVendorInsuranceService } from "./vendor-insurance.service";
declare var $: any;

@Component({
    selector: 'ewo-vendor-insurance',
    templateUrl: './vendor-insurance.component.html'
})
export class VendorInsuranceComponent implements OnInit {
    @Input() vendor: any;
    @Input() updateInsuranceDataInfo: any;
    @Output('update') change: EventEmitter<any> = new EventEmitter<any>();

    exp_date_not_valid = true;
    isSubmit: boolean = false;

    constructor(
        private vendorService: VendorService,
        private formBuilder: FormBuilder,
        private authService: AuthenticationService,
        private route: ActivatedRoute,
        private dataService: DataService,
        private updateVendorInsuranceService: UpdateVendorInsuranceService) {
        this.updateVendorInsuranceService.updateInsuranceInfo$.subscribe((data: any) => {
            this.updateInsuranceDataInfo = data;
            // console.log('people>>>', this.updatePeopleInfo);
            data.exp_date = data.exp_date ? data.exp_date.toDate() : data.exp_date;

            this.vendorInsuranceForm.patchValue(this.updateInsuranceDataInfo);
        });
    }

    ngOnInit () {
        // console.log('Edited Data', this.updatePeopleInfo);
        $('#add-vendor-insurance').on('hidden.bs.modal', () => {
            this.closeModal();
        });
    }

    vendorInsuranceForm = new FormGroup({
        id: new FormControl(),
        url: new FormControl(''),
        type: new FormControl(''),
        exp_date: new FormControl(null),
        per_occur: new FormControl('', [Validators.required]),
        aggregate: new FormControl('', [Validators.required]),
        vendor: new FormControl('')
    });


    onSubmit () {


        // if (this.vendorInsuranceForm.get('exp_date').value) {
        //     let date: Date = this.vendorInsuranceForm.get('exp_date').value;
        //     if(date.toString().indexOf('T') > -1) {
        //         let dateAndTime = date.toISOString().split('T');
        //         this.vendorInsuranceForm.get('exp_date').setValue(dateAndTime[0]);
        //     }
        //     else {
        //         this.vendorInsuranceForm.get('exp_date').setValue(date);
        //     }

        // }
        // else{
        //     this.exp_date_not_valid = true;
        //     return;
        // }

        this.exp_date_not_valid = false;

        if (this.dataService.dateValidation(this.vendorInsuranceForm.get('exp_date'))) {
            this.exp_date_not_valid = true;
        } else {
            this.exp_date_not_valid = false;
            return;
        }

        if (!this.vendorInsuranceForm.valid) { return; }

        //Update People
        if (this.vendorInsuranceForm.value.id) {
            this.vendorService.updateVendorInsurance(this.vendorInsuranceForm.value).subscribe((insurance: any) => {
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
        this.vendorInsuranceForm.get('vendor').setValue(`${config.api.base}vendor/${this.vendor.id}/`);
        let val = this.vendorInsuranceForm.value;
        this.vendorInsuranceForm.removeControl('id');
        this.vendorInsuranceForm.removeControl('url');

        this.vendorService.createVendorInsurance(this.vendorInsuranceForm.value).subscribe((insurance: any) => {
            this.isSubmit = false;
            this.change.emit(true);
            this.closeModal();
        },
            error => {
                this.isSubmit = false;
            });
        this.vendorInsuranceForm.addControl('id', new FormControl());
        this.vendorInsuranceForm.addControl('url', new FormControl());

    }

    closeModal () {
        this.isSubmit = false;
        this.resetForm();
        $('#add-vendor-insurance').modal('hide');
    }

    resetForm () {
        this.vendorInsuranceForm.reset({
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
