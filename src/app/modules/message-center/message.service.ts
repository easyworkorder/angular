import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { DataService, AppHttp, EventService, NotificationService } from "app/services";
import { ToasterService } from "angular2-toaster/angular2-toaster";

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

}
