import { Injectable } from '@angular/core';
import {
    AppHttp,
    DataService,
    EventService,
    NotificationService
} from '../../../services';
import { ToasterService } from "angular2-toaster/angular2-toaster";
import { Observable } from "rxjs/Observable";

@Injectable()
export class SLAPolicyService extends DataService {

    constructor(
        protected http: AppHttp,
        protected events: EventService,
        private notifications: NotificationService,
        private toasterService: ToasterService
    ) {
        super(events);
    }

    getCompanySLAPolicy(company) {
        const observable = this.http.get('companyslapolicy/', { company_id: company }); // this
        // const observable = this.http.get(`companyslapolicy/?company=${company}`); // this
        observable.map(data => data.results).subscribe(data => {
            console.log(data);
        });
        return observable;
    }

    updateSLAPolicy(data?: any): Observable<any> {
        data = Object.assign({}, data);

        const observable = this.http.patch(data.url, data);

        observable.subscribe(data => {
            this.toasterService.pop('success', 'UPDATE', 'SLA Policy has been updated successfully');
            console.log(data);
        },
            error => {
                this.toasterService.pop('error', 'UPDATE', 'SLA Policy not updated due to API error!!!');
                console.log(error);
            });

        return observable;
    }

    updateSLATarget(data?: any): Observable<any> {
        data = Object.assign({}, data);

        const observable = this.http.patch(data.url, data);

        observable.subscribe(data => {
            this.toasterService.pop('success', 'UPDATE', 'SLA Target has been updated successfully');
            console.log(data);
        },
            error => {
                this.toasterService.pop('error', 'UPDATE', 'SLA Target not updated due to API error!!!');
                console.log(error);
            });

        return observable;
    }
}
