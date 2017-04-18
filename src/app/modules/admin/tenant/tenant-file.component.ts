import { Component, OnInit } from '@angular/core';
import { DataService } from "app/services";
import { TenantService } from "app/modules/admin/tenant/tenant.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";

declare var $:any;

@Component({
    selector: 'ewo-tenant-file',
    templateUrl: './tenant-file.component.html',
    styleUrls: ['./tenant-file.component.css']
})
export class TenantFileComponent implements OnInit {

    constructor(
        private dataService: DataService,
        private tenantService: TenantService
    ) { }

    docFile:File = null;
    selectedFileName: string = '';

    tenantDocumentForm = new FormGroup({
        id: new FormControl('0'),
        url: new FormControl(''),
        title: new FormControl(''),
        tenant: new FormControl(null),
        description: new FormControl('', [Validators.required]),
    });

    ngOnInit() {
        this.closeModal();
        $('#add-tenant-file').on('hidden.bs.modal', () => {
            this.closeModal();
        });
    }

    onSubmit() {

    }

    docSelectionChange(event) {
        let fileList: FileList = event.target.files;
        if(fileList.length > 0) {
            this.docFile = fileList[0];
            this.selectedFileName = this.docFile.name;
        }
    }

    closeModal() {
        this.resetForm();
        $('#add-tenant-file').modal('hide');
    }

    resetForm() {
        this.docFile = null;
        this.selectedFileName = '';
        this.tenantDocumentForm.reset({
            title: '',
            description: ''
        });
    }

}
