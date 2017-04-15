import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
// import { NotificationService } from '../../services/notification.service';
import { Observable } from 'rxjs/Observable';

import { IVendor } from '../../../interfaces/vendor.interface';

import {
    AppHttp,
    DataService,
    EventService,
    NotificationService
} from '../../../services';
import { ToasterService } from "angular2-toaster/angular2-toaster";
import { FormGroup, FormControl } from "@angular/forms";

@Injectable()
export class VendorService extends DataService {

    constructor(
        protected http: AppHttp,
        protected events: EventService,
        private notifications: NotificationService,
        private toasterService: ToasterService,
        private dataService: DataService
    ) {
        super(events);
    }

    saveVendor (data?: any): Observable<any> {
        data = Object.assign({}, data);
        let observable: any;
        let operation = data.id ? 'Edit' : 'Add';
        if (data.id)
            observable = this.http.patch(data.url, data);
        else
            observable = this.http.post('vendor/', data);

        observable.subscribe(data => {
            console.log(data);
            // this.toasterService.pop('success', 'ADD', 'Vendor has been saved successfully');
        },
            error => {
                this.toasterService.pop('error', operation, 'Sorry! Something went wrong and Vendor could not be saved!!');
                console.log(error);
            });

        return observable;
    }
    // create(data?: any): Observable<IVendor> {
    //     data = Object.assign({}, data);

    //     // POST '/vendor'
    //     const observable = this.http.post('vendor/', data);

    //     observable.subscribe(data => {
    //         // console.log(data);
    //         this.toasterService.pop('success', 'ADD', 'Vendor has been saved successfully');
    //     },
    //     error => {
    //         this.toasterService.pop('error', 'ADD', 'Vendor not Saved due to API error!!!');
    //     });

    //     return observable;
    // }

    /**
     * Saves vendor contact, without a photo in the request
     * @param data
     */
    saveVendorContact (data?: any): Observable<any> {
        data = Object.assign({}, data);
        let observable: any;
        let operation = data.id ? 'Edit' : 'Add';
        if (data.id)
            observable = this.http.patch(data.url, data);
        else
            observable = this.http.post('vendorcontact/', data);

        observable.subscribe(data => {
            console.log('saveVendorContact', data);

            // this.toasterService.pop('success', operation, 'Contact has been saved successfully.');
        },
            error => {
                // this.toasterService.pop('error', operation, 'Sorry! Something went wrong and contact could not be saved!!');
                console.log('saveVendorContact', error);

            });

        return observable;
    }

    /**
     * Add vendor contact
     * @param data
     * @returns {Observable<any>}
     */

    // createVendorContact(data?: any): Observable<any> {
    //     data = Object.assign({}, data);

    //     // POST '/vendor'
    //     const observable = this.http.post('vendorcontact/', data);

    //     observable.subscribe(data => {
    //         // console.log(data);
    //         this.toasterService.pop('success', 'ADD', 'Vendor people has been added successfully');
    //     },
    //     error => {
    //         this.toasterService.pop('error', 'ADD', 'Vendor people not Saved due to API error!!!');
    //     });

    //     return observable;
    // }


    // /**
    //  * Update vendor contact
    //  * @param data
    //  * @returns {Observable<any>}
    //  */
    // updateVendorContact(data?: any): Observable<any> {
    //     data = Object.assign({}, data);

    //     const observable = this.http.patch(data.url, data);

    //     observable.subscribe(data => {
    //         this.toasterService.pop('success', 'UPDATE', 'Vendor people has been updated successfully');
    //         //console.log(data);
    //     },
    //     error => {
    //         this.toasterService.pop('error', 'UPDATE', 'Vendor people not updated due to API error!!!');
    //         console.log(error);
    //     });

    //     return observable;
    // }

    getVendor (url) {
        const observable = this.http.getByFullUrl(url);
        observable.subscribe(data => {
            console.log(data);
        });
        return observable;
    }

    /**
     * Get All vendor by Company Id
     * @returns {Observable<any>}
     */
    getAllVendors (company_id) {
        const observable = this.http.get('vendorlist/' + company_id + '/'); // this
        observable.subscribe(data => {
            console.log(data);
        });
        return observable;
    }

    /**
     * Get All active vendor by Company Id
     * @returns {Observable<any>}
     */
    getAllActiveVendors (company_id) {
        const observable = this.http.get('vendorlist/' + company_id + '/?active=true');
        observable.subscribe(data => {
            console.log(data);
        });
        return observable;
    }

    /**
     * Get All active vendor by problem type id
     * @returns {Observable<any>}
     */
    getActiveVendorsByProblemType (problemtype_id) {
        const observable = this.http.get('vendorlistbyproblemtype/' + problemtype_id + '/?active=true');
        observable.subscribe(data => {
            console.log(data);
        });
        return observable;
    }

    getContactDetails (contactId) {
        const observable = this.http.get('vendorcontact/' + contactId + '/');
        observable.subscribe(data => {
            console.log(data);
        });
        return observable;
    }

    /**
     * Get All insurances by vendor id
     * @param vendor_id
     * @returns {Observable<any>}
     */
    getInsurances (vendor_id) {
        const observable = this.http.get('vendorinsurance/?vendor_id=' + vendor_id + '&ordering=id');
        observable.subscribe(data => {
            console.log(data);
        });
        return observable;
    }


    /**
     * Add vendor Insurance
     * @param data
     * @returns {Observable<any>}
     */

    createVendorInsurance (data?: any): Observable<any> {
        data = Object.assign({}, data);

        const observable = this.http.post('vendorinsurance/', data);

        observable.subscribe(data => {
            // console.log(data);
            this.toasterService.pop('success', 'ADD', 'Vendor insurance has been added successfully');
        },
            error => {
                this.toasterService.pop('error', 'ADD', 'Vendor insurance not Saved due to API error!!!');
            });

        return observable;
    }


    /**
     * Update vendor insurance
     * @param data
     * @returns {Observable<any>}
     */
    updateVendorInsurance (data?: any): Observable<any> {
        data = Object.assign({}, data);

        const observable = this.http.patch(data.url, data);

        observable.subscribe(data => {
            this.toasterService.pop('success', 'UPDATE', 'Vendor insurance has been updated successfully');
            //console.log(data);
        },
            error => {
                this.toasterService.pop('error', 'UPDATE', 'Vendor insurance not updated due to API error!!!');
                console.log(error);
            });

        return observable;
    }

    /**
     * Creates/Updates a vendor contact with a file in the request
     * @param url To update the entity
     * @param id Id of the contact object
     * @param A flat object of FormData which will be embeded in header as multipart/form
     */
    saveContactWithFile (url, id, formData: FormData): Observable<any> {
        let observable: any;
        if (id)
            observable = this.http.putWithFile(url, formData);
        else
            observable = this.http.postWithFile('vendorcontact/', formData);

        // observable.subscribe(data => {
        //     console.log(data);
        // });
        return observable;
    }

    /**
     * Processes a contact form to save with/without file.
     * Removes unnecessary attributes which API backend does not like
     * @param photoFile Object of the user selected photo file
     * @param contactForm
     * @param vendor Vendor object to be related with
     * @param refreshCallback This callback is depricated for the time being
     */
    public saveContact (photoFile: File, contactForm: FormGroup, vendor: any, refreshCallback: (logMsg: string, obj: any) => any): Observable<any> {
        // let [url, id, operation] = contactForm.value.id ? [contactForm.value.url, contactForm.value.id, 'Updated'] : ['vendorcontact/', null, 'Created'];
        // let observable:Observable<any>;
        // if(photoFile) {
        //     console.log('Inside Photo File Submit');
        //     this.relateWithVendor(contactForm, vendor);
        //     let excludeKeys = contactForm.value.id ?  ['photo'] : ['photo', 'id', 'user_id'];
        //     let formData:FormData = this.dataService.mapToFormData(contactForm, excludeKeys);
        //     formData.append('photo', photoFile, photoFile.name);
        //     observable = this.saveContactWithFile(url, id, formData);
        // } else {
        //     this.relateWithVendor(contactForm, vendor);
        //     let contactData = contactForm.value;
        //     if(! contactData.id) {
        //         if(contactForm.contains('user_id'))
        //             delete contactData.user_id;
        //         delete contactData.id;
        //     }
        //     if(contactForm.contains('photo'))
        //         delete contactData.photo;

        //     observable = this.saveVendorContact(contactData);
        // }
        // return observable;
        let observable: Observable<any>;

        this.relateWithVendor(contactForm, vendor);
        let contactData = contactForm.value;
        if (!contactData.id) {
            if (contactData.user_id)
                delete contactData.user_id;
            delete contactData.id;
        }
        // if(contactForm.contains('photo'))
        //     delete contactData.photo;
        // let observable:Observable<any>;
        // observable = this.saveVendorContact(contactData);
        // if(photoFile){
        //     observable.subscribe(contact => {
        //         // let s3observable:Observable<any>;
        //         return this.uploadFile(photoFile, contact, vendor.id);
        //     });
        // }

        //new 14april
        if (photoFile) {
            // observable = Observable.forkJoin(
            observable = this.saveVendorContact(contactData)
                .switchMap(savedContact => this.uploadFile(photoFile, savedContact, vendor.id), (savedContactInfo, uploadFileInfo) => ({ savedContactInfo, uploadFileInfo }))
                // .do(data11 => { console.log('data11>> ', data11); })
                .switchMap(contactAndUploadFile => this.uploadToAws(photoFile, contactAndUploadFile.uploadFileInfo.data, contactAndUploadFile.uploadFileInfo.url, contactAndUploadFile.savedContactInfo),
                (contactAndUploadFileInfo, aws) => ({ contactAndUploadFileInfo, aws }))
                // .do(data12 => { console.log('data12>> ', data12); })
                .switchMap(contactAndAws => {
                    contactAndAws.contactAndUploadFileInfo.savedContactInfo.photo = contactAndAws.contactAndUploadFileInfo.uploadFileInfo.url;
                    return this.saveVendorContact(contactAndAws.contactAndUploadFileInfo.savedContactInfo)
                },
                (contactAndAwsInfo, vendorContactInfo) => ({ contactAndAwsInfo, vendorContactInfo }))
                // .do(data13 => { console.log('data13>> ', data13); })
                .share()

            // )
        } else {
            observable = this.saveVendorContact(contactData);
        }

        observable.subscribe(
            (data) => {
                console.log('Vendor Data', data);

                this.toasterService.pop('success', 'SAVED', 'Vendor & Vendor Contact Saved successfully');
            },
            error => {
                this.toasterService.pop('error', 'SAVED', 'Vendor & Vendor Contact not saved');
            });

        return observable;
    }

    private uploadFile (photoFile: File, vendorContact: any, vendor_id: number): Observable<any> {
        let observable: Observable<any>;
        if (photoFile) {
            let url = 's3filesignature/?name=' + photoFile.name + '&type=' + photoFile.type + '&etype=vc&rid=' + vendor_id;
            observable = this.http.get(url);
            observable.subscribe(s3Data => {
                console.log('s3Data', s3Data);
                // return this.uploadToAws(photoFile, s3Data.data, s3Data.url, vendorContact);
            },
                error => {
                    console.log('s3Data', error);
                });
        }
        return observable;
    }

    private uploadToAws (file: File, s3Data: any, url: string, vendorContact: any): Observable<any> {
        let observable: Observable<any>;
        var postData = new FormData();
        for (let key in s3Data.fields) {
            postData.append(key, s3Data.fields[key]);
        }
        postData.append('file', file);
        observable = this.http.postToS3(s3Data.url, postData);
        observable.subscribe(data => {
            console.log(data);
            console.log('Should be accessible through: ' + url);
            // vendorContact.photo = url;
            // observable = this.saveVendorContact(vendorContact);
            // return this.saveVendorContact(vendorContact);
        })
        return observable;
    }

    private relateWithVendor (contactForm: FormGroup, vendor: any) {
        if (!contactForm.contains('vendor'))
            contactForm.addControl('vendor', new FormControl(vendor.url));
        else if (!contactForm.get('vendor').value)
            contactForm.get('vendor').setValue(vendor.url);
    }
}

