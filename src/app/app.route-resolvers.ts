import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { HeaderService } from "app/modules/shared/header/header.service";
import { AuthenticationService } from "app/modules/authentication";
import { BreadcrumbHeaderService } from "app/modules/shared/breadcrumb-header/breadcrumb-header.service";

@Injectable()
export class AdminDashBoardResolver implements Resolve<any> {
    constructor(private headerService: HeaderService,
        private authService: AuthenticationService,
        private breadcrumbHeaderService: BreadcrumbHeaderService) {
    }
    resolve (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // this.authService.verifyToken();
        // let title = route.data['breadcrumb'];

        // this.breadcrumbHeaderService.setBreadcrumbTitle(title);


        return this.headerService.setDashBoardTitle({ title: 'ADMINISTRATION PORTAL', link: ['/', 'admin'] });
        // return this.headerService.setDashBoardTitle({ title: 'TICKETS', link: ['/'] });
    }
}

@Injectable()
export class TicketDashBoardResolver implements Resolve<any> {
    constructor(private headerService: HeaderService,
        private authService: AuthenticationService) {
    }
    resolve (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // this.authService.verifyToken();
        return this.headerService.setDashBoardTitle({ title: 'TICKETS', link: ['/'] });
    }
}

@Injectable()
export class DashBoardResolver implements Resolve<any> {
    constructor(private authService: AuthenticationService) {
    }
    resolve (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // return this.authService.verifyToken().map(data => data).take(1).subscribe(data => {
        // }, error => {
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
