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
        private toasterService: ToasterService
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

    // createTenantContact(data?: any): Observable<any> {
    //     data = Object.assign({}, data);

    //     // POST '/tenant'
    //     const observable = this.http.post('tenantcontact/', data);

    //     observable.subscribe(data => {
    //         // console.log(data);
    //         this.toasterService.pop('success', 'ADD', 'Contact has been saved successfully');
    //     },
    //         error => {
    //             this.toasterService.pop('error', 'ADD', 'Contact not Saved due to API error!!!');
    //         });

    //     return observable;
    // }

    // updateTenantContact(data?: any): Observable<any> {
    //     data = Object.assign({}, data);

    //     // PUT '/employee'
    //     // const observable = this.http.put(data.url, data);
    //     const observable = this.http.patch(data.url, data);

    //     observable.subscribe(data => {
    //         this.toasterService.pop('success', 'UPDATE', 'Contact has been updated successfully');
    //         console.log(data);
    //     },
    //         error => {
    //             this.toasterService.pop('error', 'UPDATE', 'Contact not updated due to API error!!!');
    //             console.log(error);
    //         });

    //     return observable;
    // }

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

    // updateTenant(data?: any): Observable<any> {
    //     data = Object.assign({}, data);

    //     const observable = this.http.patch(data.url, data);

    //     observable.subscribe(data => {
    //         // this.toasterService.pop('success', 'UPDATE', 'Tenant insurance has been updated successfully');
    //         console.log('Updated Tenant');
    //     },
    //     error => {
    //         // this.toasterService.pop('error', 'UPDATE', 'Tenant insurance not updated due to API error!!!');
    //         console.log(error);
    //     });

    //     return observable;
    // }

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
    // updateContactWithFile(url, formData: FormData): Observable<any> {
    //     const observable = this.http.putWithFile(url, formData);
    //     observable.subscribe(data => {
    //         console.log('Updated Employee Info: ' + data);
    //     });
    //     return observable;
    // }
}
