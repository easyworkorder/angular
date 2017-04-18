import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { VendorService } from "./vendor.service";
import { DataService } from "app/services";
import { ActivatedRoute } from "@angular/router";
import { AuthenticationService } from "app/modules/authentication";
import { FormBuilder, FormControl, Validators, FormGroup } from "@angular/forms";
import { ValidationService } from "app/services/validation.service";
import config from '../../../config';
import { UpdateVendorPeopleService } from "./vendor-people.service";
import { HeaderService } from "app/modules/shared/header/header.service";
declare var $: any;

@Component({
    selector: 'ewo-vendor-contact-people',
    templateUrl: './vendor-contact-people.component.html'
})
export class VendorContactPeopleComponent implements OnInit {
    @Input() vendor: any;
    @Input() updateVendorPeopleInfo: any;
    @Output('update') change: EventEmitter<any> = new EventEmitter<any>();
    // @Output('updatePeople') changePeople: EventEmitter<any> = new EventEmitter<any>();

    photoFile: File
    selectedPhotoFile: string = '';
    isSubmit: boolean = false;

    constructor(
        private vendorService: VendorService,
        private formBuilder: FormBuilder,
        private authService: AuthenticationService,
        private route: ActivatedRoute,
        private dataService: DataService,
        private updateVendorPeopleService: UpdateVendorPeopleService) {
        this.updateVendorPeopleService.updatePeopleInfo$.subscribe(data => {
            this.updateVendorPeopleInfo = data;
            // console.log('people>>>', this.updatePeopleInfo);
            this.vendorContactPeopleForm.setValue(this.updateVendorPeopleInfo);
        });
    }

    ngOnInit () {
        // console.log('Edited Data', this.updatePeopleInfo);
        $('#add-vendor-cotact-people').on('hidden.bs.modal', () => {
            this.closeModal();
        });
    }

    vendorContactPeopleForm = new FormGroup({
        id: new FormControl(),
        url: new FormControl(''),
        first_name: new FormControl('', Validators.required),
        last_name: new FormControl('', Validators.required),
        title: new FormControl(''),
        email: new FormControl('', [Validators.required, ValidationService.emailValidator]),
        phone: new FormControl(''),
        phone_extension: new FormControl(''),
        fax: new FormControl(''),
        mobile: new FormControl(''),
        emergency_phone: new FormControl(''),
        notes: new FormControl(''),
        isprimary_contact: new FormControl(false),
        vendor: new FormControl(''),
        active: new FormControl(true),
        photo: new FormControl(),
        user_id: new FormControl()
    });

    photoSelectionChange (event) {
        let fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            this.photoFile = fileList[0];
            this.selectedPhotoFile = this.photoFile.name;
        }
    }

    onSubmit () {

        if (!this.vendorContactPeopleForm.valid) { return; }

        // //Update People
        // if (this.vendorContactPeopleForm.value.id) {
        //     this.vendorService.updateVendorContact(this.vendorContactPeopleForm.value).subscribe((people: any) => {
        //         this.change.emit(true);
        //         this.closeModal();
        //     });
        //     return;
        // }

        // //Add people
        // this.vendorContactPeopleForm.get('vendor').setValue(`${config.api.base}vendor/${this.vendor.id}/`);
        // let val = this.vendorContactPeopleForm.value;
        // this.vendorContactPeopleForm.removeControl('id');
        // this.vendorService.createVendorContact(this.vendorContactPeopleForm.value).subscribe((people: any) => {
        //     // console.log('Tenant created', tenant);
        //     // this.getAllTenantsByBuilding(this.buildingId);
        //     // this.isSuccess = true;

        //     this.change.emit(true);
        //     this.closeModal();
        // });
        // this.vendorContactPeopleForm.addControl('id', new FormControl());
        this.isSubmit = true;
        this.vendorService.saveContact(this.photoFile, this.vendorContactPeopleForm, this.vendor, this.contactSaveCallback).subscribe((contact: any) => {
            this.isSubmit = false;
            this.contactSaveCallback('Vendor Contact Saved successfully.', contact);
        },
            error => {
                this.isSubmit = false;
            });
    }

    public contactSaveCallback (logMsg: string, obj: any) {
        this.change.emit(true);
        this.closeModal();
    }

    closeModal () {
        this.isSubmit = false;
        this.resetForm();
        $('#add-vendor-cotact-people').modal('hide');
    }

    resetForm () {
        this.photoFile = null;
        this.selectedPhotoFile = '';
        this.vendorContactPeopleForm.reset({
            title: '',
            isprimary_contact: false,
            active: true
        });
    }
}
