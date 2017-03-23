import { Injectable, OnInit } from '@angular/core';
import {
    CanActivate,
    CanActivateChild,
    Router
} from '@angular/router';
import { AuthenticationService } from '../modules/authentication/authentication.service';

import config from '../config';
import { Observable } from "rxjs/Observable";

@Injectable()
export class AuthGuard implements OnInit, CanActivate {
    isTokenValid: boolean = false;
    constructor(
        private authService: AuthenticationService,
        private router: Router) {
        // this.authService.verifyToken();
        this.authService.tokenValid$.subscribe(data => {
            this.isTokenValid = data;
        });
    }

    ngOnInit() {
        // this.authService.verifyToken();
    }

    canActivate(): Observable<boolean> | Promise<boolean> | boolean {
        // if (this.authService.token()) {
        //     // console.log('isAuthenticated');
        //     return true;
        // }

        // this.router.navigate(['/signin']);
        // return false;

        //New Implementation mar 18
        if (this.authService.isValidToken) {
            return true;
        } else {
            this.router.navigate(['/signin']);
            return false;
        }

        //end of new


        // let url: string = state.url;
        // return this.checkLogin(url);
    }
    // TODO: later
    // canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    //     return this.canActivate(route, state);
    // }

    // checkLogin(url: string): boolean {
    //     if (this.authService.token()) { return true; }

    //     // Store the attempted URL for redirecting
    //     this.authService.redirectUrl = url;

    //     // Navigate to the login page with extras
    //     this.router.navigate([config.routes.signin]);
    //     return false;
    // }
    canActivateChild(): boolean {
        if (this.authService.isValidToken) {
            return true;
        } else {
            this.router.navigate(['/signin']);
            return false;
        }
    }
}
