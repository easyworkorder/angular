import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ISLAPolicy } from '../../../interfaces/default_sla_policy.interface';
import { ToasterService } from 'angular2-toaster';
import config from '../../../config';

import {
  AppHttp,
  DataService,
  EventService,
  NotificationService
} from '../../../services';

@Injectable()
export class DefaultSLAPolicyService extends DataService {

  /*constructor(
    protected http: AppHttp,
    protected events: EventService,
    private notifications: NotificationService,
    private toaster: ToasterService
  ) {
    super(events);
  }

  create(data?: any): Observable<ISLAPolicy> {
    data = Object.assign({}, data);
    // POST '/problem type'
    const observable = this.http.post('problemType/', data);

    observable.subscribe(data => {
      this.toaster.pop(config.messageType.SUCCESS, 'Problem Type', 'Problem type has been Saved Successfully');
      console.log(data);
    },
      error => {
        this.toaster.pop(config.messageType.ERROR, 'Problem Type', 'Problem type not saved due to API error!!!');
        console.log(error);
      });

    return observable;
  }

   update(data?: any): Observable<ISLAPolicy> {
    data = Object.assign({}, data);
    // PUT '/problem type/id'
    // const observable = this.http.put('problemType/'+ data.id +'/', data);
    const observable = this.http.put(data.url, data);

    observable.subscribe(data => {
      this.toaster.pop(config.messageType.SUCCESS, 'Problem Type', 'Problem type has been updated successfully');
      console.log(data);
    },
      error => {
        this.toaster.pop(config.messageType.ERROR, 'Problem Type', 'Problem type not updated due to API error!!!');
        console.log(error);
      });

    return observable;
  }*/

}
