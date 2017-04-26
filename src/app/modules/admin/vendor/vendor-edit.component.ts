import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormControl, Validators, FormBuilder } from "@angular/forms";
import { ActivatedRoute } from '@angular/router';
import { DataService } from "app/services";
import { ToasterService } from "angular2-toaster/angular2-toaster";
import { VendorService } from "app/modules/admin/vendor/vendor.service";
import { ProblemTypeService } from "app/modules/admin/problem_type/problem_type.service";
import config from '../../../config';
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
declare var $: any;

@Component({
    selector: 'ewo-vendor-edit',
    templateUrl: './vendor-edit.component.html'
})
export class VendorEditComponent implements OnInit {
    currentCompanyId = 1;
    _submitted: boolean = false;
    @Input('edit') editClicked: Subject<any>;
    @Output('update') change: EventEmitter<any> = new EventEmitter<any>();

    isSubmit: boolean = false;
    isExpireDateValid: boolean = true;
    problemTypes: any[] = [];
    selectedProblemTypes: any[] = []; //[{ id: -1, text: 'All' }];

    editedVendorInfo: any;

    vendorId: any;
    observable: Observable<any>;

    vendorForm = this.formBuilder.group({
        id: new FormControl(),
        // company: new FormControl(config.api.base + 'company/' + this.currentCompanyId + '/'),
        company_name: new FormControl('', Validators.required),
        problem_types: new FormControl(''),
        address: new FormControl('', Validators.required),
        city: new FormControl('', Validators.required),
        state: new FormControl('', Validators.required),
        postal_code: new FormControl('', Validators.required),
        gl_expire_date: new FormControl(null),
        active: new FormControl(true),
        url: new FormControl(),
    })

    constructor(
        private formBuilder: FormBuilder,
        private dataService: DataService,
        private vendorService: VendorService,
        private problemTypeService: ProblemTypeService,
        private toasterService: ToasterService,
        private route: ActivatedRoute

    ) {

    }

    ngOnInit () {
        this.editClicked.subscribe(() => {
            console.log('EDITED');
            this.getEditedVendorInfo();
        });
    }

    getEditedVendorInfo () {
        this.vendorId = this.route.snapshot.params['id'];
        let url = config.api.base + 'vendor/' + this.vendorId + '/';

        this.observable = Observable.forkJoin(
            this.vendorService.getVendor(url),
            this.problemTypeService.getAllActiveProblemTypes(this.currentCompanyId)
        );
        this.observable.subscribe(datas => {
            console.log(datas);
            this.editedVendorInfo = datas[0];
            this.populateProblemTypes(datas[1]);
            this.setEditedInfo();
        });
    }

    setEditedInfo () {
        this.editedVendorInfo.gl_expire_date = this.editedVendorInfo.gl_expire_date.toDate();
        this.setEditedProblemTypes(this.editedVendorInfo.problem_types);
        this.vendorForm.get('problem_types').setValue(this.editedVendorInfo.problem_types);
        this.vendorForm.patchValue(this.editedVendorInfo);
    }

    setEditedProblemTypes (value) {
        let sel = [];
        if (!this.problemTypes) return;
        value.split(',').forEach(item => {
            let pt = this.problemTypes.find(x => x.id == item);
            if (pt)
                sel.push(pt);
        });
        this.selectedProblemTypes = sel;
    }
    onSubmit () {
        this._submitted = true;
        this.isExpireDateValid = false;

        if (this.dataService.dateValidation(this.vendorForm.get('gl_expire_date'))) {
            this.isExpireDateValid = true;
        } else {
            this.isExpireDateValid = false;
            return;
        }

        if (!this.validateBasicInfo()) {
            return;
        }

        if (!this.vendorForm.valid) { return; }
        let vendorData = this.vendorForm.value;
        if (vendorData.gl_expire_date)
            vendorData.gl_expire_date = vendorData.gl_expire_date.toDate();
        if (vendorData.vendor_contacts) { delete vendorData.vendor_contacts; }

        this.isSubmit = true;

        this.vendorService.saveVendor(vendorData).subscribe((vendor: any) => {
            this.change.emit(vendor);
            this.toasterService.pop('success', 'EDIT', 'Vendor has been saved successfully');
            this.isSubmit = false;
            $('#edit-vendor-modal').modal('hide');
        },
            error => {
                this.isSubmit = false;
            });
    }

    onSelectDate (value) {
        this.isExpireDateValid = true;
    }

    public selectedProblemType (value: any): void {
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

    validateBasicInfo () {
        return this.vendorForm.get('company_name').valid &&
            this.vendorForm.get('address').valid &&
            this.vendorForm.get('city').valid &&
            this.vendorForm.get('state').valid &&
            this.vendorForm.get('postal_code').valid && this.dataService.dateValidation(this.vendorForm.get('gl_expire_date'));
    }

    populateProblemTypes (data) {
        let _probTypes: any[] = data.results.map(item => {
            return { id: item.id, text: item.problem_name };
        })
        _probTypes.splice(0, 0, { id: -1, text: 'All' });

        this.problemTypes = _probTypes;
    }
}
