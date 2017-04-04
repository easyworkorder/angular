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

    saveVendor(data?: any): Observable<any> {
        data = Object.assign({}, data);
        let observable:any;
        let operation = data.id ? 'Edit' : 'Add';
        if(data.id)
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
    saveVendorContact(data?: any): Observable<any> {
        data = Object.assign({}, data);
        let observable:any;
        let operation = data.id ? 'Edit' : 'Add';
        if(data.id)
            observable = this.http.patch(data.url, data);
        else
            observable = this.http.post('vendorcontact/', data);

        observable.subscribe(data => {
            // console.log(data);
            this.toasterService.pop('success', operation, 'Contact has been saved successfully.');
        },
        error => {
            this.toasterService.pop('error', operation, 'Sorry! Something went wrong and contact could not be saved!!');
            console.log(error);
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

    getVendor(url) {
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
    getAllVendors(company_id) {
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
    getAllActiveVendors(company_id) {
        const observable = this.http.get('vendorlist/' + company_id + '/?active=true');
        observable.subscribe(data => {
            console.log(data);
        });
        return observable;
    }

    getContactDetails(contactId) {
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
    getInsurances(vendor_id) {
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

    createVendorInsurance(data?: any): Observable<any> {
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
    updateVendorInsurance(data?: any): Observable<any> {
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
    saveContactWithFile(url, id, formData: FormData): Observable<any> {
        let observable:any;
        if(id)
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
    public saveContact(photoFile: File, contactForm: FormGroup, vendor:any, refreshCallback:(logMsg:string, obj:any) => any):Observable<any> {
        let [url, id, operation] = contactForm.value.id ? [contactForm.value.url, contactForm.value.id, 'Updated'] : ['vendorcontact/', null, 'Created'];
        let observable:Observable<any>;
        if(photoFile) {
            console.log('Inside Photo File Submit');
            this.relateWithVendor(contactForm, vendor);
            let excludeKeys = contactForm.value.id ?  ['photo'] : ['photo', 'id', 'user_id'];
            let formData:FormData = this.dataService.mapToFormData(contactForm, excludeKeys);
            formData.append('photo', photoFile, photoFile.name);
            observable = this.saveContactWithFile(url, id, formData);
        } else {
            this.relateWithVendor(contactForm, vendor);
            let contactData = contactForm.value;
            if(! contactData.id) { 
                if(contactForm.contains('user_id'))
                    delete contactData.user_id;
                delete contactData.id;
            }
            if(contactForm.contains('photo'))
                delete contactData.photo;

            observable = this.saveVendorContact(contactData);
        }
        return observable;
    }

    private relateWithVendor(contactForm: FormGroup, vendor:any){
        if(! contactForm.contains('vendor'))
            contactForm.addControl('vendor', new FormControl(vendor.url));
        else if (! contactForm.get('vendor').value)
            contactForm.get('vendor').setValue(vendor.url);
    }
}

