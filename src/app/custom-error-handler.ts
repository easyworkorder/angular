import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { AuthenticationService } from "app/modules/authentication";
declare var $: any;

@Injectable()
export class CustomErrorHandler implements ErrorHandler {
    constructor(private injector: Injector) { }

    handleError (error: any): void {
        const auth = this.injector.get(AuthenticationService);

        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
        auth.signout();
    }
}