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

@Injectable()
export class VendorService extends DataService {

  constructor(
    protected http: AppHttp,
    protected events: EventService,
    private notifications: NotificationService,
    private toasterService: ToasterService
  ) {
    super(events);
  }

  create(data?: any): Observable<IVendor> {
    data = Object.assign({}, data);

    // POST '/tenant'
    const observable = this.http.post('vendor/', data);

    observable.subscribe(data => {
      // console.log(data);
      this.toasterService.pop('success', 'ADD', 'Vendor has been saved successfully');
    },
      error => {
        this.toasterService.pop('error', 'ADD', 'Vendor not Saved due to API error!!!');
      });

    return observable;
  }

  /*getTenant(url) {
    const observable = this.http.getByFullUrl(url);
    observable.subscribe(data => {
      console.log(data);
    });
    return observable;
  }*/

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
    const observable = this.http.get('vendoractivelist/', { company_id: company_id});
    observable.subscribe(data => {
      console.log(data);
    });
    return observable;
  }

  /*getContactDetails(contactId) {
    const observable = this.http.get('tenantcontact/' + contactId + '/');
    observable.subscribe(data => {
      console.log(data);
    });
    return observable;
  }*/
}
