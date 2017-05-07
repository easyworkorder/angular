import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { HeaderService } from './header.service';
import { Storage } from 'app/services';
import { AuthenticationService } from "app/modules/authentication";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject } from "rxjs/Subject";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {

    @Input() userInformation: Subject<any>;
    dashboarTitle: any;
    profilePhoto: string;

    private userInfo: any;

    constructor(
        private authService: AuthenticationService,
        private headerService: HeaderService,
        private router: Router,
        private storage: Storage) {
        this.headerService.dashboardTitle$.subscribe(data => this.dashboarTitle = data);
    }

    ngOnInit () {
        this.headerService.setDashBoardTitle({ title: 'TICKETS', link: ['/'] });
        this.profilePhoto = 'assets/img/placeholders/avatars/avatar9.jpg';

        this.userInformation.subscribe(info => {
            this.userInfo = info;
            this.profilePhoto = this.userInfo.photo || 'assets/img/placeholders/avatars/avatar9.jpg';
        })
    }

    ngOnDestroy () {
        this.userInformation.unsubscribe();
    }

    onLinkClicked (event) {
        this.router.url == '/admin' && this.headerService.setDashBoardTitle({ title: 'TICKETS', link: ['/'] });
        this.router.url == '/admin/building' && this.headerService.setDashBoardTitle({ title: 'TICKETS', link: ['/'] });
        this.router.url == '/admin/problem-type' && this.headerService.setDashBoardTitle({ title: 'TICKETS', link: ['/'] });
        this.router.url == '/admin/tenant' && this.headerService.setDashBoardTitle({ title: 'TICKETS', link: ['/'] });
        this.router.url == '/admin/employee' && this.headerService.setDashBoardTitle({ title: 'TICKETS', link: ['/'] });
    }

    logOut () {
        this.authService.signout();
    }
}
