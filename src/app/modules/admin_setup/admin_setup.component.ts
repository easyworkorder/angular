import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthenticationService } from "app/modules/authentication";
import { BreadcrumbHeaderService } from "app/modules/shared/breadcrumb-header/breadcrumb-header.service";
import { HeaderService } from "app/modules/shared/header/header.service";
declare var App: any;

@Component({
    selector: 'app-admin-setup',
    templateUrl: './admin_setup.component.html'
})
export class AdminSetupComponent implements OnInit {

    constructor(
        private breadcrumbHeaderService: BreadcrumbHeaderService,
        private headerService: HeaderService,
    ) { }

    ngOnInit () {
        this.breadcrumbHeaderService.setBreadcrumbTitle('Administration Portal');
        this.headerService.setDashBoardTitle({ title: 'TICKETS', link: ['/'] });

    }
}
