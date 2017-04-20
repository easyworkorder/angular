import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { DataService, AppHttp } from "app/services";
import { TicketService } from './ticket.service';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Observable } from "rxjs/Observable";
import { ToasterService } from "angular2-toaster/angular2-toaster";
import config from '../../config';

declare var $:any;

@Component({
    selector: 'ewo-ticket-file',
    templateUrl: './ticket-file.component.html'
})
export class TicketFileComponent implements OnInit {

    constructor(
        private dataService: DataService,
        private ticketService: TicketService,
        private toasterService: ToasterService,
        private http: AppHttp
    ) { }

    @Input() ticket: any = null;
    @Output('update') change: EventEmitter<any> = new EventEmitter<any>();

    isSubmit: boolean = false;
    _submitted: boolean = false;

    docFile: File = null;
    selectedFileName: string = '';
    ticketDocument: any;

    ticketDocumentForm = new FormGroup({
        id: new FormControl(),
        url: new FormControl(''),
        title: new FormControl('', [Validators.required]),
        description: new FormControl('', [Validators.required]),
        filename: new FormControl(''),
        mimetype: new FormControl(''),
        postdate: new FormControl(''),
        workorder: new FormControl(null),
        docsize: new FormControl(''),
        doc_url: new FormControl(''),
        tenant_view: new FormControl(true)
    });

    ngOnInit() {
        this.closeModal();
        $('#add-ticket-file').on('hidden.bs.modal', () => {
            this.closeModal();
        });

        if (this.ticketDocument == null) {
            this.ticketDocument = {
                'id': '',
                'url': '',
                'title': '',
                'filename': '',
                'mimetype': '',
                'docsize': null,
                'description': '',
                'doc_url': '',
                'tenant_view': true
            };
        }
        this.ticketDocumentForm.reset(this.ticketDocument);
    }

    onSubmit() {
        this._submitted = true;
        if (!this.ticketDocumentForm.valid || this.selectedFileName === '') {
            return;
        }
        this.isSubmit = true;
        this.ticketDocumentForm.get('workorder').setValue(config.api.base + 'ticket/' + this.ticket.id + '/');
        const data = this.ticketDocumentForm.value;
        if (this.docFile) {
            this.uploadAndSaveDocument(data);
        } else {
            if (data.id) {
                if (data.doc_url) {
                    delete data.doc_url;
                }
                this.http.put(data.url, data, null, null).subscribe(tenantDoc => {
                    this.documentSaveCallback('Document without file Updated.', tenantDoc);
                    this.closeModal();
                });
            } else {
                delete data.id;
                delete data.url;
                this.http.post('ticketdocument/', data, null, null).subscribe(tenantDoc => {
                    this.documentSaveCallback('Document without file Created.', tenantDoc);
                });
            }
        }
    }

    docSelectionChange(event) {
        const fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            this.docFile = fileList[0];
            this.selectedFileName = this.docFile.name;
            this.ticketDocumentForm.get('filename').setValue(this.docFile.name);
            this.ticketDocumentForm.get('mimetype').setValue(this.docFile.type);
            this.ticketDocumentForm.get('docsize').setValue(this.docFile.size);
        }
    }

    documentSaveCallback(msg: string,  document: any) {
        console.log(msg, document);
        this.isSubmit = false;
        this.change.emit(true);
        this.closeModal();
    }


    uploadAndSaveDocument (document: any) {
        let observable: Observable<any>;
        let creatORUpdateObservable: Observable<any>;
        if (document.id) {
            // creatORUpdateObservable = this.employeeService.update(boundEmployee);
            console.log('Not Updating');
        } else {
            delete document.id;
            delete document.url;

            if (document.doc_url) {
                delete document.doc_url;
            }

            creatORUpdateObservable = this.http.post('ticketdocument/', document, null, null);
        }

        if (this.docFile) {
            const url = 's3filesignature/?name=' + this.docFile.name + '&type=' + this.docFile.type + '&etype=tc&rid=' + this.ticket.id + '&isdoc=True';
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
        $('#add-ticket-file').modal('hide');
    }

    resetForm() {
        this._submitted = false;
        this.docFile = null;
        this.selectedFileName = '';
        this.ticketDocumentForm.reset({
            title: '',
            description: '',
            tenant_view: true
        });
    }

}
