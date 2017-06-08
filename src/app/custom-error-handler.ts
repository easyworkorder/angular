import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { AuthenticationService } from "app/modules/authentication";
declare var $: any;

@Injectable()
export class CustomErrorHandler implements ErrorHandler {
    constructor(private injector: Injector) { }

    handleError (response: any): void {
        const auth = this.injector.get(AuthenticationService);

        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();

        console.log("API ERROR:: ", response);

        if (response.status == 403 || (response.status >= 500 && response.status < 600)) {
            auth.signout();
        }

        // auth.signout();
    }
}