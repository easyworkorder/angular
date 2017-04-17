import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
// import { NotificationService } from '../../services/notification.service';

import { Address } from '../../interfaces/address.interface';

import {
    AppHttp,
    DataService,
    EventService,
    NotificationService
} from '../../services';

@Injectable()
export class AddressService extends DataService {

    constructor(
        protected http: AppHttp,
        protected events: EventService,
        private notifications: NotificationService
    ) {
        super(events);
    }

    create (data?: any): Observable<Address> {
        data = Object.assign({}, data);

        // POST '/address'
        const observable = this.http.post('address/', data);
        // const observable = this.http.post_with_file('address/', data)

        observable.subscribe(data => {
        });

        return observable;
    }
    createWithFile (formData: FormData): Observable<any> {
        const observable = this.http.postWithFile('address/', formData);
        observable.subscribe(data => {
        });
        return observable;
    }

    getAll () {
        const observable = this.http.get('address/?address_type=b');
        observable.subscribe(data => {
        });
        return observable;
    }
}
