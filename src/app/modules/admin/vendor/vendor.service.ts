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


  /**
   * Add vendor contact
   * @param data
   * @returns {Observable<any>}
   */

  createVendorContact(data?: any): Observable<any> {
    data = Object.assign({}, data);

    // POST '/tenant'
    const observable = this.http.post('vendorcontact/', data);

    observable.subscribe(data => {
          // console.log(data);
          this.toasterService.pop('success', 'ADD', 'Vendor people has been added successfully');
        },
        error => {
          this.toasterService.pop('error', 'ADD', 'Vendor people not Saved due to API error!!!');
        });

    return observable;
  }


  /**
   * Update vendor contact
   * @param data
   * @returns {Observable<any>}
   */
  updateVendorContact(data?: any): Observable<any> {
    data = Object.assign({}, data);

    const observable = this.http.patch(data.url, data);

    observable.subscribe(data => {
          this.toasterService.pop('success', 'UPDATE', 'Vendor people has been updated successfully');
          //console.log(data);
        },
        error => {
          this.toasterService.pop('error', 'UPDATE', 'Vendor people not updated due to API error!!!');
          console.log(error);
        });

    return observable;
  }

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
    const observable = this.http.get('vendorlist/'+ company_id+ '/?active=true');
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
    const observable = this.http.get('vendorinsurance/?vendor_id=' + vendor_id+'&ordering=id');
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
}

