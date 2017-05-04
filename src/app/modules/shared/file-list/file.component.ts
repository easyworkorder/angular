import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { AppHttp } from 'app/services';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import config from '../../../config';

declare var $: any;

@Component({
    selector: 'ewo-file',
    templateUrl: './file.component.html'
})
export class FileComponent implements OnInit {

    constructor(
        private toasterService: ToasterService,
        private http: AppHttp
    ) { }

    @Input() isClosedTicket: boolean = false;
    @Input() parent_object_id: number;
    @Input() parent_object_type: string;
    @Input() files: any;
    @Output('update') change: EventEmitter<any> = new EventEmitter<any>();

    isSubmit = false;
    _submitted = false;

    docFile: File = null;
    selectedFileName = '';
    toDeletedFile: any;

    apiURLName = '';

    fileForm = new FormGroup({
        id: new FormControl(),
        url: new FormControl(''),
        title: new FormControl('', [Validators.required]),
        description: new FormControl('', [Validators.required]),
        filename: new FormControl(''),
        mimetype: new FormControl(''),
        postdate: new FormControl(''),
        docsize: new FormControl(''),
        doc_url: new FormControl(''),
        tenant_view: new FormControl(true)
    });

    ngOnInit () {

        if (this.parent_object_type === 'ticket') {
            this.apiURLName = 'ticketdocument';
            this.fileForm.addControl('workorder', new FormControl(''));
        } else if (this.parent_object_type === 'tenant') {
            this.apiURLName = 'tenantdocument';
            this.fileForm.addControl('tenant', new FormControl(''));
        } else if (this.parent_object_type === 'vendor') {
            this.apiURLName = 'vendordocument';
            this.fileForm.addControl('vendor', new FormControl(''));
        } else if (this.parent_object_type === 'building') {
            this.apiURLName = 'buildingdocument';
            this.fileForm.addControl('building', new FormControl(''));
        }


        this.closeModal();
        $('#add-file').on('hidden.bs.modal', () => {
            this.closeModal();
        });
    }

    ngAfterViewChecked () {
        $(function () {
            $('[data-toggle="tooltip"]').tooltip()
        })
    }

    onSubmit () {

        this._submitted = true;

        if (!this.fileForm.valid || this.selectedFileName === '') {
            return;
        }

        this.isSubmit = true;

        if (this.parent_object_type === 'ticket') {
            this.fileForm.get('workorder').setValue(config.api.base + 'ticket/' + this.parent_object_id + '/');
        } else if (this.parent_object_type === 'tenant') {
            this.fileForm.get('tenant').setValue(config.api.base + 'tenant/' + this.parent_object_id + '/');
        } else if (this.parent_object_type === 'vendor') {
            this.fileForm.get('vendor').setValue(config.api.base + 'vendor/' + this.parent_object_id + '/');
        } else if (this.parent_object_type === 'building') {
            this.fileForm.get('building').setValue(config.api.base + 'building/' + this.parent_object_id + '/');
        }



        const data = this.fileForm.value;
        if (this.docFile) {
            this.uploadAndSaveFile(data);
        } else {
            if (data.id) {
                if (data.doc_url) {
                    delete data.doc_url;
                }
                this.http.put(data.url, data, null, null).subscribe(doc => {
                    this.fileSaveCallback('File without file Updated.', doc);
                    this.closeModal();
                });
            } else {
                delete data.id;
                delete data.url;
                this.http.post(this.apiURLName + '/', data, null, null).subscribe(doc => {
                    this.fileSaveCallback('File without file Created.', doc);
                });
            }
        }
    }

    docSelectionChange (event) {
        const fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            this.docFile = fileList[0];
            this.selectedFileName = this.docFile.name;
            this.fileForm.get('filename').setValue(this.docFile.name);
            this.fileForm.get('mimetype').setValue(this.docFile.type);
            this.fileForm.get('docsize').setValue(this.docFile.size);
        }
    }

    fileSaveCallback (msg: string, file: any) {
        this.isSubmit = false;
        this.change.emit(true);
        this.closeModal();
    }


    uploadAndSaveFile (file: any) {
        let observable: Observable<any>;
        let creatORUpdateObservable: Observable<any>;
        if (file.id) {
            // creatORUpdateObservable = this.employeeService.update(boundEmployee);
            creatORUpdateObservable = this.http.patch(file.url, file);
            console.log('Not Updating');
        } else {
            delete file.id;
            delete file.url;

            if (file.doc_url) {
                delete file.doc_url;
            }

            creatORUpdateObservable = this.http.post(this.apiURLName + '/', file, null, null);
        }

        if (this.docFile) {
            const url = 's3filesignature/?name=' + this.docFile.name + '&type=' + this.docFile.type + '&etype=tc&rid=' + this.parent_object_id + '&isdoc=True';
            observable = Observable.forkJoin(
                creatORUpdateObservable
                    .switchMap(newFile => this.http.get(url), (employeeInfo, s3Info) => ({ employeeInfo, s3Info }))
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
                if (file.id) {
                    this.fileSaveCallback('File Updated', data)
                    this.toasterService.pop('success', 'UPDATE', 'File has been updated successfully');
                } else {
                    this.fileSaveCallback('File created', data)
                    this.toasterService.pop('success', 'SAVED', 'File has been saved successfully');

                }
            },
            error => {
                this.isSubmit = false;
                if (file.id) {
                    this.toasterService.pop('error', 'UPDATE', 'File was not updated due to API error!!!');
                } else {
                    this.toasterService.pop('error', 'SAVED', 'File was not Saved due to API error!!!');
                }
            });
        return observable;
    }

    uploadToAws (file: File, s3Data: any, url: string, employeeInfo): Observable<any> {
        let observable: Observable<any>;

        const postData = new FormData();
        for (const key in s3Data.fields) {
            postData.append(key, s3Data.fields[key]);
        }
        postData.append('file', file);
        observable = this.http.postToS3(s3Data.url, postData);
        observable.subscribe(data => {
        })

        return observable;
    }

    editFile (file) {
        this.selectedFileName = file.filename;
        this.fileForm.patchValue(file);
    }

    deleteFile (file) {
        this.toDeletedFile = file;
    }

    closeModal () {
        this.resetForm();
        $('#add-file').modal('hide');
    }

    resetForm () {
        this._submitted = false;
        this.docFile = null;
        this.selectedFileName = '';
        this.fileForm.reset({
            title: '',
            description: ''
        });
        if (this.parent_object_type === 'ticket') {
            this.fileForm.get('tenant_view').setValue(true);
        }
    }

    onModalOkButtonClick (event) {

        if (this.toDeletedFile) {

            const observable = this.http.delete(this.toDeletedFile.url, this.toDeletedFile);
            observable.subscribe(data => {
                this.toasterService.pop('success', 'DELETE', 'File has been deleted successfully');
                this.change.emit(true);
            },
                error => {
                    this.toasterService.pop('error', 'DELETE', 'File not deleted due to API error!!!');
                });
            $('#modal-delete-confirm').modal('hide');


            return observable;
        }
    }

}
