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
import { HeaderService } from "app/modules/shared/header/header.service";
declare var $: any;

@Component({
    selector: 'ewo-tenant-contact-people',
    templateUrl: './tenant-contact-people.component.html'
})
export class TenantContactPeopleComponent implements OnInit {
    @Input() tenant: any;
    @Input() updatePeopleInfo: any;
    @Output('update') change: EventEmitter<any> = new EventEmitter<any>();
    // @Output('updatePeople') changePeople: EventEmitter<any> = new EventEmitter<any>();
    isSubmit: boolean = false;
    viewInvoicesList = [
        { value: true, display: 'Yes, they are authorized (default)' },
        { value: false, display: 'No, they are not authorized' }
    ];

    photoFile: File
    selectedPhotoFile: string = '';

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
            this.tenantContactPeopleForm.setValue(this.updatePeopleInfo);
        });
    }

    ngOnInit () {
        $('#add-tenant-cotact-people').on('hidden.bs.modal', () => {
            this.closeModal();
        });
    }

    tenantContactPeopleForm = new FormGroup({
        id: new FormControl(),
        url: new FormControl(''),
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

        if (!this.tenantContactPeopleForm.valid) { return; }
        this.isSubmit = true;
        // this.tenantService.saveContact(this.photoFile, this.tenantContactPeopleForm, this.tenant, this.contactSaveCallback);
        this.tenantService.saveContact(this.photoFile, this.tenantContactPeopleForm, this.tenant, this.contactSaveCallback).subscribe((contact: any) => {
            this.isSubmit = false;
            this.contactSaveCallback('Tenant Contact Saved successfully.', contact);
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
        $('#add-tenant-cotact-people').modal('hide');
    }

    resetForm () {
        this.photoFile = null;
        this.selectedPhotoFile = '';
        this.tenantContactPeopleForm.reset({
            title: '',
            isprimary_contact: false,
            active: true,
            viewinvoices: true
        });
    }
}
