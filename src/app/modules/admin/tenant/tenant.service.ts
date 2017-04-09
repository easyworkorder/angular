
import { FormGroup, FormControl } from '@angular/forms';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
// import { NotificationService } from '../../services/notification.service';
import { Observable } from 'rxjs/Observable';

import { Tenant } from '../../../interfaces/tenant.interface';

import {
    AppHttp,
    DataService,
    EventService,
    NotificationService
} from '../../../services';
import { ToasterService } from "angular2-toaster/angular2-toaster";

@Injectable()
export class TenantService extends DataService {

    constructor(
        protected http: AppHttp,
        protected events: EventService,
        private notifications: NotificationService,
        private toasterService: ToasterService,
        private dataService: DataService
    ) {
        super(events);
    }

    saveTenant(data?: any): Observable<Tenant> {
        data = Object.assign({}, data);
        let observable:any;
        let operation = data.id ? 'Edit' : 'Add';
        if(data.id)
            observable = this.http.patch(data.url, data);
        else
            observable = this.http.post('tenant/', data);

        observable.subscribe(data => {
            console.log(data);
            // this.toasterService.pop('success', 'ADD', 'Tenant has been saved successfully');
        },
        error => {
            this.toasterService.pop('error', operation, 'Sorry! Something went wrong and Tenant could not be saved!!');
            console.log(error);
        });

        return observable;
    }

    saveTenantContact(data?: any): Observable<any> {
        data = Object.assign({}, data);
        let observable:any;
        let operation = data.id ? 'Edit' : 'Add';
        if(data.id)
            observable = this.http.patch(data.url, data);
        else
            observable = this.http.post('tenantcontact/', data);

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

    getTenant(url) {
        const observable = this.http.getByFullUrl(url);
        observable.subscribe(data => {
            console.log(data);
        });
        return observable;
    }

    getAllTenantsByBuilding(building_id) {
        // const observable = this.http.get('tenant/?building=' + building_id); //can call this or
        const observable = this.http.get('tenantsbybuilding/' + building_id + '/'); // this
        observable.subscribe(data => {
            console.log(data);
        });
        return observable;
    }

    /**
     * This service is written for ticket component
     * @param building_id
     */
    getActiveTenantsByBuilding(building_id) {
        const observable = this.http.get('tenant/', { building_id: building_id, active: true, ordering: 'name' });
        observable.subscribe(data => {
            console.log(data);
        });
        return observable;
    }

    getContactDetails(contactId) {
        const observable = this.http.get('tenantcontact/' + contactId + '/');
        observable.subscribe(data => {
            console.log(data);
        });
        return observable;
    }

    /**
     * Get All insurances by tenant id
     * @param tenant_id
     * @returns {Observable<any>}
     */
    getInsurances(tenant_id) {
        const observable = this.http.get('tenantinsurance/?tenant_id=' + tenant_id + '&ordering=id');
        observable.subscribe(data => {
            console.log(data);
        });
        return observable;
    }


    /**
     * Add tenant Insurance
     * @param data
     * @returns {Observable<any>}
     */

    createTenantInsurance(data?: any): Observable<any> {
        data = Object.assign({}, data);

        const observable = this.http.post('tenantinsurance/', data);

        observable.subscribe(data => {
            // console.log(data);
            this.toasterService.pop('success', 'ADD', 'Tenant insurance has been added successfully');
        },
        error => {
            this.toasterService.pop('error', 'ADD', 'Tenant insurance not Saved due to API error!!!');
        });

        return observable;
    }


    /**
     * Update tenant insurance
     * @param data
     * @returns {Observable<any>}
     */
    updateTenantInsurance(data?: any): Observable<any> {
        data = Object.assign({}, data);

        const observable = this.http.patch(data.url, data);

        observable.subscribe(data => {
            this.toasterService.pop('success', 'UPDATE', 'Tenant insurance has been updated successfully');
            //console.log(data);
        },
        error => {
            this.toasterService.pop('error', 'UPDATE', 'Tenant insurance not updated due to API error!!!');
            console.log(error);
        });

        return observable;
    }
    /**
     * Creates/Updates a tenant contact with a file in the request
     * @param url To update the entity
     * @param id Id of the contact object
     * @param formData flat object of FormData which will be embeded in header as multipart/form
     */
    saveContactWithFile(url, id, formData: FormData): Observable<any> {
        let observable:any;
        if(id)
            observable = this.http.putWithFile(url, formData);
        else
            observable = this.http.postWithFile('tenantcontact/', formData);

        observable.subscribe(data => {
            console.log(data);
        });
        return observable;
    }

    /**
     * Processes a contact form to save with/without file.
     * Removes unnecessary attributes which API backend does not like
     * @param photoFile Object of the user selected photo file
     * @param contactForm 
     * @param tenant Tenant object to be related with
     * @param refreshCallback This callback is depricated for the time being
     */
    public saveContact(photoFile: File, contactForm: FormGroup, tenant:any, refreshCallback:(logMsg:string, obj:any) => any):Observable<any> {
        // let [url, id, operation] = contactForm.value.id ? [contactForm.value.url, contactForm.value.id, 'Updated'] : ['tenantcontact/', null, 'Created'];
        // let observable:Observable<any>;
        // if(photoFile) {
        //     console.log('Inside Photo File Submit');
        //     this.relateWithTenant(contactForm, tenant);
        //     let excludeKeys = contactForm.value.id ?  ['photo'] : ['photo', 'id', 'user_id'];
        //     let formData:FormData = this.dataService.mapToFormData(contactForm, excludeKeys);
        //     formData.append('photo', photoFile, photoFile.name);
        //     observable = this.saveContactWithFile(url, id, formData);
        // } else {
        //     this.relateWithTenant(contactForm, tenant);
        //     let contactData = contactForm.value;
        //     if(! contactData.id) { 
        //         if(contactForm.contains('user_id'))
        //             delete contactData.user_id;
        //         delete contactData.id;
        //     }
        //     if(contactForm.contains('photo'))
        //         delete contactData.photo;

        //     observable = this.saveTenantContact(contactData);
        // }
        // return observable;

        this.relateWithTenant(contactForm, tenant);
        let contactData = contactForm.value;
        if(! contactData.id) { 
            if(contactData.user_id)
                delete contactData.user_id;
            delete contactData.id;
        }
        // if(contactForm.contains('photo'))
        //     delete contactData.photo;
        let observable:Observable<any>;
        observable = this.saveTenantContact(contactData);
        if(photoFile){
            observable.subscribe(contact => {
                observable = this.uploadFile(photoFile, contact, tenant.id);
            });
        }
        return observable;
    }


    private uploadFile(photoFile: File, tenantContact: any, tenant_id:number): Observable<any> {
        let observable:Observable<any>;
        if(photoFile) {
            let url = 's3filesignature/?name=' + photoFile.name + '&type=' + photoFile.type + '&etype=tc&rid=' + tenant_id;
            this.http.get(url).subscribe(s3Data => {
                observable = this.uploadToAws(photoFile, s3Data.data, s3Data.url, tenantContact);
            });
        }
        return observable;
    }

    private uploadToAws(file: File, s3Data:any, url:string, tenantContact:any): Observable<any> {
        let observable:Observable<any>;
        var postData = new FormData();
        for(let key in s3Data.fields){
            postData.append(key, s3Data.fields[key]);
        }
        postData.append('file', file);
        observable = this.http.postToS3(s3Data.url, postData);
        observable.subscribe(data => {
            console.log(data);
            console.log('Should be accessible through: ' + url);
            tenantContact.photo = url;
            observable = this.saveTenantContact(tenantContact);
        })
        return observable;
    }

    private relateWithTenant(contactForm: FormGroup, tenant:any){
        if(! contactForm.contains('tenant'))
            contactForm.addControl('tenant', new FormControl(tenant.url));
        else if (! contactForm.get('tenant').value)
            contactForm.get('tenant').setValue(tenant.url);
    }
}
