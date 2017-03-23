import { Injectable } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { Observable } from 'rxjs/Observable';

import { ITicket } from '../../interfaces/ticket.interface';

import {
  AppHttp,
  DataService,
  EventService,
  NotificationService,

} from '../../services';

@Injectable()
export class TicketService extends DataService {

  constructor(
    protected http: AppHttp,
    protected events: EventService,
    private notifications: NotificationService,
    private toasterService: ToasterService
  ) {
    super(events);
  }

  create(data?: any): Observable<ITicket> {
    data = Object.assign({}, data);

    // POST '/employee'
    const observable = this.http.post('ticket/', data);

    observable.subscribe(data => {
      this.toasterService.pop('success', 'ADD', 'Employee has been saved successfully');
      console.log(data);
    },
      error => {
        this.toasterService.pop('error', 'ADD', 'Employee not Saved!!!');
        console.log(error);
      });

    return observable;
  }

  update(data?: any): Observable<ITicket> {
    data = Object.assign({}, data);

    // PUT '/employee'
    const observable = this.http.put(data.url, data);

    observable.subscribe(data => {
      this.toasterService.pop('success', 'UPDATE', 'Employee has been updated successfully');
      console.log(data);
    },
      error => {
        this.toasterService.pop('error', 'UPDATE', 'Employee not updated!!!');
        console.log(error);
      });

    return observable;
  }

}
