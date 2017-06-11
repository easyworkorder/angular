import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { DataService, AppHttp, EventService, NotificationService } from "app/services";
import { ToasterService } from "angular2-toaster/angular2-toaster";
import { Observable } from "rxjs/Observable";

@Injectable()
export class MessageService extends DataService {

    constructor(protected http: AppHttp,
        protected events: EventService,
        private notifications: NotificationService,
        private toasterService: ToasterService) {
        super(events);
    }

    getMessages (status) {
        const observable = this.http.get('message/', { status: status });

        observable.subscribe(data => {
        });
        return observable;
    }

    getMessage (id) {
        const observable = this.http.get(`message/${id}/`);

        observable.subscribe(data => {
        });
        return observable;
    }
    create (data?: any): Observable<any> {

        data = Object.assign({}, data);
        const observable = this.http.post('message/', data);

        observable.subscribe(data => {
            // this.toasterService.pop('success', 'ADD', 'Building has been saved successfully');
        },
            error => {
                // this.toasterService.pop('error', 'ADD', 'Building not Saved due to API error!!!');
            });

        return observable;
    }

    update (data?: any): Observable<any> {
        data = Object.assign({}, data);

        // PUT '/employee'
        // const observable = this.http.put(data.url, data);
        const observable = this.http.patch(data.url, data);

        observable.subscribe(data => {
            // this.toasterService.pop('success', 'DELETE', 'Message has been updated successfully');
        },
            error => {
                // this.toasterService.pop('error', 'DELETE', 'Message not updated due to API error!!!');
            });

        return observable;
    }

}
