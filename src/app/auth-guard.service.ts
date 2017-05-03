import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import config from './config';
import { AuthenticationService } from './modules/authentication/authentication.service';

@Injectable()
export class AuthGuardService implements CanActivate {
    isAuthenticate = false;
    constructor(
        private router: Router,
        private authentication: AuthenticationService
    ) {
    }

    canActivate (): Observable<boolean> | Promise<boolean> | boolean {
        let isAuthenticate = false;
        return this.authentication.verifyTokenPromise();
    }
}

export const AUTH_PROVIDERS = [AuthGuardService, AuthenticationService];
