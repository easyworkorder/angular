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

@Injectable()
export class TenantService extends DataService {

  constructor(
    protected http: AppHttp,
    protected events: EventService,
    private notifications: NotificationService
  ) {
    super(events);
  }

  create(data?: any): Observable<Tenant> {
    data = Object.assign({}, data);

    // POST '/tenant'
    const observable = this.http.post('tenant/', data);

    observable.subscribe(data => {
      console.log(data);
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
    const observable = this.http.get('tenant/', { building_id: building_id, active: true, ordering: 'name'});
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
}
