import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import config from './config';
import { AuthenticationService } from './modules/authentication/authentication.service';

@Injectable()
export class IsAuthenticated implements CanActivate {

  constructor(
    private router: Router,
    private authentication: AuthenticationService
  ) {}

  canActivate(): Observable<boolean> | boolean {
    let isAuthorized = this.authentication.isAuthenticated();

    if (isAuthorized === null) {
       // authentication is not compeleted yet
      return Observable.create(observer => {

        this.authentication.data.observable.subscribe(
          user => {
            this.router.navigate([config.routes.signinRedirect]);
            observer.next(!!user);
            observer.complete();
          },
          () => {
            this.router.navigate([config.routes.signin]);
            observer.next(false);
            observer.complete();
          }
        );
      });

    } else {
      !isAuthorized && this.router.navigate([config.routes.signin]);
      return isAuthorized;
    }
  }
}

export const AUTH_PROVIDERS = [IsAuthenticated, AuthenticationService];
