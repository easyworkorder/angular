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
    @Input() updateInsuranceInfo: any;
    @Output('update') change: EventEmitter<any> = new EventEmitter<any>();

    exp_date_not_valid = false;

    constructor(
        private vendorService: VendorService,
        private formBuilder: FormBuilder,
        private authService: AuthenticationService,
        private route: ActivatedRoute,
        private dataService: DataService,
        private updateVendorInsuranceService: UpdateVendorInsuranceService) {
        this.updateVendorInsuranceService.updateInsuranceInfo$.subscribe(data => {
            this.updateInsuranceInfo = data;
            // console.log('people>>>', this.updatePeopleInfo);
            this.vendorInsuranceForm.setValue(this.updateInsuranceInfo);
        });
    }

    ngOnInit() {
        // console.log('Edited Data', this.updatePeopleInfo);
        $('#add-vendor-insurance').on('hidden.bs.modal', () => {
            this.closeModal();
        });
    }

    vendorInsuranceForm = new FormGroup({
        id: new FormControl(),
        url: new FormControl(''),
        type: new FormControl('', Validators.required),
        exp_date: new FormControl(null),
        per_occur: new FormControl('', [Validators.required, ValidationService.numericValidator]),
        aggregate: new FormControl('', [Validators.required, ValidationService.numericValidator]),
        vendor: new FormControl('')
    });


    onSubmit() {

        if (!this.vendorInsuranceForm.valid) { return; }

        if (this.vendorInsuranceForm.get('exp_date').value) {
            let date: Date = this.vendorInsuranceForm.get('exp_date').value;
            let dateAndTime = date.toISOString().split('T');
            this.vendorInsuranceForm.get('exp_date').setValue(dateAndTime[0]);
        }
        else{
            this.exp_date_not_valid = true;
        }

        //Update People
        if (this.vendorInsuranceForm.value.id) {
            this.vendorService.updateVendorInsurance(this.vendorInsuranceForm.value).subscribe((insurance: any) => {
                this.change.emit(true);
                this.closeModal();
            });
            return;
        }

        //Add people
        this.vendorInsuranceForm.get('vendor').setValue(`${config.api.base}vendor/${this.vendor.id}/`);
        let val = this.vendorInsuranceForm.value;
        this.vendorInsuranceForm.removeControl('id');
        this.vendorService.createVendorInsurance(this.vendorInsuranceForm.value).subscribe((insurance: any) => {
            this.change.emit(true);
            this.closeModal();
        });
        this.vendorInsuranceForm.addControl('id', new FormControl());
    }

    closeModal() {
        this.resetForm();
        $('#add-vendor-insurance').modal('hide');
    }

    resetForm() {
        this.vendorInsuranceForm.reset();
    }
}
