import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthenticationService } from "app/modules/authentication";
import config from './../../config';
import { Storage } from './../../services/index';

declare var App: any;
declare var ReadyDashboard: any;
declare var $:any;

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

    constructor(
        private authService: AuthenticationService,
        private storage: Storage) {
        //  this.authService.verifyToken();
     }

    userInfo: any;

    ngOnInit() {
        App.init();
        ReadyDashboard.init();
        $(document).ready(function () {
            App.init();
            ReadyDashboard.init();
        });
        $(window).on("load", function () {
            App.init();
            ReadyDashboard.init();
        });

        this.userInfo = this.storage.getUserInfo();
    }

    ngAfterViewInit() {
        App.init();
        ReadyDashboard.init();
    }

}
