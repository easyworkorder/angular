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
import { Subject } from "rxjs/Subject";
import { ReplaySubject } from "rxjs/ReplaySubject";

@Injectable()
export class TicketService extends DataService {
  private ticketListUpdateSource = new ReplaySubject<boolean>();
  tickettListRefresh$ = this.ticketListUpdateSource.asObservable();

  private ticketUpdateSource = new ReplaySubject<boolean>();
  ticketRefresh$ = this.ticketUpdateSource.asObservable();

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
  getAllTickets (company_id, type, id = '') {
    let _query_param = '';

    if (id) {
      _query_param = '?type=' + type + '&id=' + id;
    } else {
      _query_param = '?type=' + type;
    }
    const observable = this.http.get('workordersbycompany/' + company_id + '/' + _query_param);
    observable.subscribe(data => {
      // console.log(data);
    });
    return observable;
  }

  /**
   * Get All tickets by Tenant Id
   * @returns {Observable<any>}
   */
  getAllTenantTickets (tenant_id) {
    const observable = this.http.get('workordersbytenant/' + tenant_id + '/?status=Open,Unassigned');
    observable.subscribe(data => {
      // console.log(data);
    });
    return observable;
  }

  /**
   * Get All tickets by Vendor Id
   * @returns {Observable<any>}
   */
  getAllVendorTickets (vendor_id) {
    const observable = this.http.get('workordersbyvendor/' + vendor_id + '/?status=Open');
    observable.subscribe(data => {
      // console.log(data);
    });
    return observable;
  }

  getTicketDetails (ticket_id) {
    const observable = this.http.get('ticket/' + ticket_id + '/');
    observable.subscribe(data => {
      // console.log(data);
    });
    return observable;
  }

  getAllNotes (ticket_id) {
    const observable = this.http.get('ticketnotedetails/' + ticket_id + '/');
    observable.subscribe(data => {
      // console.log(data);
    });
    return observable;
  }

  getTicketSubmitterInfo (ticket_id) {
    const observable = this.http.get('ticketsubmitterinfo/' + ticket_id + '/');
    observable.subscribe(data => {
      // console.log(data);
    });
    return observable;
  }

  create (data?: any): Observable<ITicket> {
    data = Object.assign({}, data);

    const observable = this.http.post('ticket/', data);

    observable.subscribe(data => {
      this.toasterService.pop('success', 'ADD', 'Ticket has been posted successfully');
      // console.log(data);
    },
      error => {
        this.toasterService.pop('error', 'ADD', 'Ticket not posted due to API error!!!');
      });

    return observable;
  }

  update (data?: any, showMessage?: any): Observable<ITicket> {
    data = Object.assign({}, data);

    // PUT '/employee'
    const observable = this.http.patch(data.url, data);

    observable.subscribe(data => {
      if (showMessage) {
        this.toasterService.pop('success', 'UPDATE', 'Ticket has been updated successfully');
      }
      // console.log(data);
    },
      error => {
        if (showMessage) {
          this.toasterService.pop('error', 'UPDATE', 'Ticket not updated!!!');
        }
      });

    return observable;
  }

  createNote (data?: any, showMessage?: any) {

    data = Object.assign({}, data);
    const observable = this.http.post('ticketnote/', data);

    observable.subscribe(data => {
      if (showMessage) {
        this.toasterService.pop('success', 'ADD', 'Ticket Note has been posted successfully');
      }
      // console.log(data);
    },
      error => {
        if (showMessage) {
          this.toasterService.pop('error', 'ADD', 'Ticket Note not posted due to API error!!!');
        }
      });

    return observable;
  }

  createWorkorderVendor (data?: any) {

    data = Object.assign({}, data);
    const observable = this.http.post('ticketvendor/', data);

    observable.subscribe(data => {
      this.toasterService.pop('success', 'Send Vendor', 'Ticket has been send to vendor successfully');
      // console.log(data);
    },
      error => {
        // this.toasterService.pop('error', 'ADD', 'Ticket Note not posted due to API error!!!');
      });

    return observable;
  }

  createLabor (data?: any) {
    data = Object.assign({}, data);
    const observable = this.http.post('ticketlabor/', data);

    observable.subscribe(data => {
      this.toasterService.pop('success', 'ADD', 'Labor has been posted successfully');
      // console.log(data);
    },
      error => {
        this.toasterService.pop('error', 'ADD', 'Labor not posted due to API error!!!');
      });

    return observable;
  }

  updateLabor (data?: any) {
    data = Object.assign({}, data);

    // PUT '/employee'
    const observable = this.http.patch(data.url, data);

    observable.subscribe(data => {
      this.toasterService.pop('success', 'UPDATE', 'Labor has been updated successfully');
      // console.log(data);
    },
      error => {
        this.toasterService.pop('error', 'UPDATE', 'Labor not updated due to API error!!!');
      });

    return observable;
  }

  deleteLabor (data?: any) {
    data = Object.assign({}, data);

    // PUT '/employee'
    const observable = this.http.delete(data.url, data);

    observable.subscribe(data => {
      this.toasterService.pop('success', 'DELETE', 'Labor has been deleted successfully');
      // console.log(data);
    },
      error => {
        this.toasterService.pop('error', 'DELETE', 'Labor not deleted due to API error!!!');
      });

    return observable;
  }

  createMaterial (data?: any) {
    data = Object.assign({}, data);
    const observable = this.http.post('ticketmaterial/', data);

    observable.subscribe(data => {
      this.toasterService.pop('success', 'ADD', 'Material has been posted successfully');
      // console.log(data);
    },
      error => {
        this.toasterService.pop('error', 'ADD', 'Material not posted due to API error!!!');
      });

    return observable;
  }

  updateMaterial (data?: any) {
    data = Object.assign({}, data);

    // PUT '/employee'
    const observable = this.http.patch(data.url, data);

    observable.subscribe(data => {
      this.toasterService.pop('success', 'UPDATE', 'Material has been updated successfully');
      // console.log(data);
    },
      error => {
        this.toasterService.pop('error', 'UPDATE', 'Material not updated due to API error!!!');
      });

    return observable;
  }

  deleteMaterial (data?: any) {
    data = Object.assign({}, data);

    // PUT '/employee'
    const observable = this.http.delete(data.url, data);

    observable.subscribe(data => {
      this.toasterService.pop('success', 'DELETE', 'Material has been deleted successfully');
      // console.log(data);
    },
      error => {
        this.toasterService.pop('error', 'DELETE', 'Material not deleted due to API error!!!');
        // console.log(error);
      });

    return observable;
  }

  /**
   * After close the ticket refresh the ticket list
   */

  updateTicketList (status) {
    this.ticketListUpdateSource.next(status);
  }

  updateTicket (status) {
    this.ticketUpdateSource.next(status);
  }
}
