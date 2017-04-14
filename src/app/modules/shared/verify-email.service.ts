import { Subject } from "rxjs/Subject";
import { Injectable } from "@angular/core";
import {
    AppHttp,
    Storage,
    EventService,
    NotificationService,
} from './../../services/index';

@Injectable()
export class VerifyEmailService {
    emailVerifySource = new Subject<any>();
    emailVerifyInfo$ = this.emailVerifySource.asObservable();
    isEmailDuplicate: boolean = false;

    constructor(
        private http: AppHttp,
        private storage: Storage,
        private notifications: NotificationService,
        protected events: EventService,
    ) {
    }

    verifyEmail (email: string) {
        // http://localhost:8080/api/checkduplicate/?email=jidni100+t1@gmail.com
        // data = Object.assign({}, data);
        this.isEmailDuplicate = false;
        this.emailVerifySource.next({ isChecking: true, isDuplicate: false });
        const observable = this.http.get('checkduplicate/', { email: email });
        observable.subscribe(data => {
            this.isEmailDuplicate = data.is_duplicate;
            this.emailVerifySource.next({ isChecking: false, isDuplicate: data.is_duplicate });
        });
        return observable;
    }
}