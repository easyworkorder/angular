import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { DataService, AppHttp } from "app/services";
import { TenantService } from "app/modules/admin/tenant/tenant.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Observable } from "rxjs/Observable";
import { ToasterService } from "angular2-toaster/angular2-toaster";
import config from '../../../config';

declare var $:any;

@Component({
    selector: 'ewo-tenant-file',
    templateUrl: './tenant-file.component.html',
    styleUrls: ['./tenant-file.component.css']
})
export class TenantFileComponent implements OnInit {

    constructor(
        private dataService: DataService,
        private tenantService: TenantService,
        private toasterService: ToasterService,
        private http: AppHttp
    ) { }

    @Input() tenantDocument: any = null;
    @Input() tenant: any = null;
    @Output('update') change: EventEmitter<any> = new EventEmitter<any>();

    isSubmit: boolean = false;

    docFile:File = null;
    selectedFileName: string = '';

    tenantDocumentForm = new FormGroup({
        id: new FormControl('0'),
        url: new FormControl(''),
        title: new FormControl('', [Validators.required]),
        description: new FormControl('', [Validators.required]),
        filename: new FormControl(''),
        mimetype: new FormControl(''),
        postdate: new FormControl(''),
        tenant: new FormControl(null),
        docsize: new FormControl(''),
        doc_url: new FormControl('')
    });

    ngOnInit() {
        this.closeModal();
        $('#add-tenant-file').on('hidden.bs.modal', () => {
            this.closeModal();
        });
        
        if(this.tenantDocument == null)
            this.tenantDocument = {
                "id":"",
                "url": "",
                "title": "",
                "filename": "",
                "mimetype": "",
                "docsize": null,
                "description": "",
                "postdate": null,
                "updatedate": null,
                "updatedbyid": null,
                "doc_url": ""
            };
        this.tenantDocumentForm.reset(this.tenantDocument);
        
    }

    onSubmit() {
        this.isSubmit = true;
        this.tenantDocumentForm.get('tenant').setValue(config.api.base + 'tenant/' + this.tenant.id + '/');
        let data = this.tenantDocumentForm.value;
        if(this.docFile) {
            this.uploadAndSaveDocument(data);
        } else {
            if(data.id) {
                if(data.doc_url)
                    delete data.doc_url;
                this.http.put(data.url, data, null, null).subscribe(tenantDoc => {
                    this.documentSaveCallback('Document without file Updated.', tenantDoc);
                    this.closeModal();
                });
            } else {
                delete data.id;
                delete data.url;
                this.http.post('tenantdocument/', data, null, null).subscribe(tenantDoc => {
                    this.documentSaveCallback('Document without file Created.', tenantDoc);
                });
            }
        }
    }

    docSelectionChange(event) {
        let fileList: FileList = event.target.files;
        if(fileList.length > 0) {
            this.docFile = fileList[0];
            this.selectedFileName = this.docFile.name;
            this.tenantDocumentForm.get('filename').setValue(this.docFile.name);
            this.tenantDocumentForm.get('mimetype').setValue(this.docFile.type);
            this.tenantDocumentForm.get('docsize').setValue(this.docFile.size);
            
        }
    }

    documentSaveCallback(msg:string,  document: any) {
        console.log(msg, document);
        this.isSubmit = false;
        this.change.emit(true);
        this.closeModal();
    }


    uploadAndSaveDocument (document:any) {
        let observable: Observable<any>;
        let creatORUpdateObservable: Observable<any>;
        if (document.id) {
            // creatORUpdateObservable = this.employeeService.update(boundEmployee);
            console.log('Not Updating');
        } else {
            delete document.id;
            delete document.url;            
            if (document.doc_url)
                delete document.doc_url;

            creatORUpdateObservable = this.http.post('tenantdocument/', document, null, null);
        }

        if (this.docFile) {
            let url = 's3filesignature/?name=' + this.docFile.name + '&type=' + this.docFile.type + '&etype=tc&rid=' + this.tenant.id + '&isdoc=True';
            observable = Observable.forkJoin(
                creatORUpdateObservable
                    .switchMap(newDocument => this.http.get(url), (employeeInfo, s3Info) => ({ employeeInfo, s3Info }))
                    // .do(data11 => { console.log('data11>> ', data11); })
                    .switchMap(employeeAndS3Info => this.uploadToAws(this.docFile, employeeAndS3Info.s3Info.data, employeeAndS3Info.s3Info.url, employeeAndS3Info.employeeInfo),
                    (employeeAndAs3, aws) => ({ employeeAndAs3, aws }))
                    // .do(data12 => { console.log('data12>> ', data12); })
                    .switchMap(empS3Aws => {
                        empS3Aws.employeeAndAs3.employeeInfo.doc_url = empS3Aws.employeeAndAs3.s3Info.url;
                        let docToUpdate = empS3Aws.employeeAndAs3.employeeInfo;
                        return this.http.put(docToUpdate.url, docToUpdate);
                    },
                    (empS3AwsInfo, updatedEmployee) => ({ empS3AwsInfo, updatedEmployee }))
                    // .do(data13 => { console.log('data13>> ', data13); })
                    .share()
            )

        } else {
            // this.refreshEditor(logMsg, employee);
            observable = creatORUpdateObservable;
        }

        observable.subscribe(
            (data) => {
                this.isSubmit = false;
                if (document.id) {
                    this.documentSaveCallback('Document Updated', data)
                    this.toasterService.pop('success', 'UPDATE', 'Document has been updated successfully');
                } else {
                    this.documentSaveCallback('Document created', data)
                    this.toasterService.pop('success', 'SAVED', 'Document has been saved successfully');

                }
            },
            error => {
                this.isSubmit = false;
                if (document.id) {
                    this.toasterService.pop('error', 'UPDATE', 'Document was not updated due to API error!!!');
                } else {
                    this.toasterService.pop('error', 'SAVED', 'Document was not Saved due to API error!!!');
                }
            });
        return observable;
    }

    uploadToAws (file: File, s3Data: any, url: string, document): Observable<any> {
        let observable: Observable<any>;

        var postData = new FormData();
        for (let key in s3Data.fields) {
            postData.append(key, s3Data.fields[key]);
        }
        postData.append('file', file);
        observable = this.http.postToS3(s3Data.url, postData);
        observable.subscribe(data => {
        })

        return observable;
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
