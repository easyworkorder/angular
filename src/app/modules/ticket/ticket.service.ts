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

  /**
   * Get All tickets by Company Id
   * @returns {Observable<any>}
   */
  getAllTickets(company_id) {
    const observable = this.http.get('workordersbycompany/' + company_id + '/?status=Open');
    observable.subscribe(data => {
      console.log(data);
    });
    return observable;
  }

  getTicketDetails(ticket_id) {
    const observable = this.http.get('ticket/' + ticket_id + '/');
    observable.subscribe(data => {
      console.log(data);
    });
    return observable;
  }

  create(data?: any): Observable<ITicket> {
    data = Object.assign({}, data);

    const observable = this.http.post('ticket/', data);

    observable.subscribe(data => {
      this.toasterService.pop('success', 'ADD', 'Ticket has been posted successfully');
      console.log(data);
    },
      error => {
        this.toasterService.pop('error', 'ADD', 'Ticket not posted due to API error!!!');
        console.log(error);
      });

    return observable;
  }

  /*update(data?: any): Observable<ITicket> {
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
  }*/

}
