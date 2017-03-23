import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { HeaderService } from "app/modules/shared/header/header.service";
import { AuthenticationService } from "app/modules/authentication";

@Injectable()
export class AdminDashBoardResolver implements Resolve<any> {
    constructor(private headerService: HeaderService,
        private authService: AuthenticationService) {
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // this.authService.verifyToken();
        return this.headerService.setDashBoardTitle({ title: 'ADMINISTRATION PORTAL', link: ['/', 'admin'] });
    }
}

@Injectable()
export class TicketDashBoardResolver implements Resolve<any> {
    constructor(private headerService: HeaderService,
        private authService: AuthenticationService) {
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // this.authService.verifyToken();
        return this.headerService.setDashBoardTitle({ title: 'TICKETS', link: ['/'] });
    }
}

@Injectable()
export class DashBoardResolver implements Resolve<any> {
    constructor(private authService: AuthenticationService) {
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // return this.authService.verifyToken().map(data => data).take(1).subscribe(data => {
        //     console.log('data>>>', data);
        // }, error => {
        //     console.log('error>>>', error);
        // });
         return this.authService.verifyToken();
    }
}


// an array of services to resolve routes with data
export const APP_RESOLVER_PROVIDERS = [
    AdminDashBoardResolver,
    TicketDashBoardResolver,
    DashBoardResolver
];
