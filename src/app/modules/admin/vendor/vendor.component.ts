import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { VendorService } from './vendor.service';
import { ProblemTypeService } from './../problem_type/problem_type.service';
import { ValidationService } from './../../../services/validation.service';
import { AuthenticationService } from "app/modules/authentication";
import { Router, ActivatedRoute } from "@angular/router";
import config from '../../../config';
import { DataService } from "app/services";
import { BreadcrumbHeaderService } from "app/modules/shared/breadcrumb-header/breadcrumb-header.service";
declare var $: any;

export class TabVisibility {
    isBasicTabVisible = true;
    isContactTabVisible = false;
    selectedTabNo = 1;
}

@Component({
    selector: 'ewo-vendor',
    templateUrl: './vendor.component.html',
})
export class VendorComponent implements OnInit {
    currentCompanyId = 1;
    isSuccess: boolean = false;
    problemTypes: any[] = [];
    vendors: any[] = [];
    selectedProblemTypes: any[] = [{ id: -1, text: 'All' }];
    searchControl: FormControl = new FormControl('');

    tabs = new TabVisibility();

    constructor(
        private vendorService: VendorService,
        private problemTypeService: ProblemTypeService,
        private formBuilder: FormBuilder,
        private authService: AuthenticationService,
        private route: ActivatedRoute,
        private router: Router,
        private dataService: DataService,
        private breadcrumbHeaderService: BreadcrumbHeaderService) {

    }

    ngOnInit() {

        this.authService.verifyToken().take(1).subscribe(data => {
            this.getAllVendors();
            this.getAllActiveProblemTypes();
        });

        $('#modal-add-vendor').on('hidden.bs.modal', () => {
            this.closeModal();
        });
        this.breadcrumbHeaderService.setBreadcrumbTitle('Vendors');
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
        active: new FormControl(true),
        vendor_contacts: this.formBuilder.array(
            [this.buildBlankContact('', '', '', '', '', '', '', '', '', true, null, '', true)],
            null
            // ItemsValidator.minQuantitySum(300)
        )
    })

    buildBlankContact(firstName: string, lastName: string, title: string,
        phone: string, extension: string, mobile: string, emergencyPhone: string, fax: string,
        email: string, isPrimaryContact: boolean, vendorID: number, notes: string, active: boolean) {
        return new FormGroup({
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
            active: new FormControl(true)
        });
    }

    getAllVendors(): void {
        this.vendorService.getAllVendors(this.currentCompanyId).subscribe(
            data => {
                this.vendors = data;
            }
        );
    }


    getAllActiveProblemTypes(): void {
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

    public itemsToString(value: Array<any> = []): string {
        return value
            .map((item: any) => {
                return item.id;
            }).join(',');
    }

    setProblemTypeLsit() {
        let problemTypeList = this.itemsToString(this.selectedProblemTypes);
        problemTypeList = problemTypeList.split(',').filter(item => item != '-1').join(',');
        this.vendorForm.get('problem_types').setValue(problemTypeList == "" ? "-1" : problemTypeList);
    }

    public selectedProblemType(value: any): void {
        // if (value.id == -1) return;

        // if (this.selectedProblemTypes.length >= 1 && value.id == -1) { return; }
        if (this.selectedProblemTypes.length >= 1 && value.id == -1) {
            this.removedProblemType(value);
            return;
        }
        if (this.selectedProblemTypes.some(val => val.id == -1)) {
            this.removedProblemType({ id: -1, text: 'All' });
        }

        console.log('Selected value is: ', value);
        this.selectedProblemTypes.push(value);
        console.log(this.selectedProblemTypes);
        this.setProblemTypeLsit();
    }

    public removedProblemType(value: any): void {
        // console.log('Removed value is: ', value);
        let sel = [];
        this.selectedProblemTypes.forEach(item => {
            if (item.id != value.id) {
                sel.push(item);
            }
        });
        this.selectedProblemTypes = sel;
        this.setProblemTypeLsit();
    }

    onSubmit() {

        if (!this.validateBasicInfo()) {
            this.switchTab(1);
        } else if (!this.validateContactInfo()) {
            this.switchTab(2);
        }

        if (!this.vendorForm.valid) { return; }

        let val = this.vendorForm.value;
        this.vendorService.create(this.vendorForm.value).subscribe((vendor: any) => {
            this.isSuccess = true;
            this.closeModal();
            this.getAllVendors();
        });
    }

    validateBasicInfo() {
        return this.vendorForm.get('company_name').valid;
            //&& this.vendorForm.get('mgtfeepercent').valid;
    }

    validateContactInfo() {
        return this.vendorForm.get('vendor_contacts').valid;
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
        return this.dataService.buildName(firstName, lastName);
    }

    buildAddressHtml(vendor: any) {
        return this.dataService.buildVendorAddressHtml(vendor, vendor.company_name);
    }

    getPhotoUrl(vendor) {
        if (vendor.photo != null && vendor.photo.length > 0)
            return vendor.photo;
        return 'assets/img/placeholders/avatars/avatar9.jpg';
    }

    stopPropagation(event) {
        event.stopPropagation()
    }

    closeModal() {
        this.resetForm();
        this.switchTab(1);
        $('#modal-add-vendor').modal('hide');
    }

    resetForm() {
        this.vendorForm.reset({
            company: new FormControl(config.api.base + 'company/' + this.currentCompanyId+ '/'),
            company_name: '',
            vendor_contacts: [{
                isprimary_contact: true,
                active: true
            }]
        });
    }

    vendorDetailsLink(vendor) {
        this.router.navigate(['/admin', 'vendor-profile', vendor.contact_id]);
    }

}

