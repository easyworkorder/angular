import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from "app/modules/authentication";
import { BreadcrumbHeaderService } from "app/modules/shared/breadcrumb-header/breadcrumb-header.service";
import { HeaderService } from "app/modules/shared/header/header.service";

@Component({
  selector: 'ewo-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  constructor(
    private authService: AuthenticationService,
    private headerService: HeaderService,
    private breadcrumbHeaderService: BreadcrumbHeaderService) {
    this.authService.verifyToken();
  }

  ngOnInit () {
    //  this.breadcrumbHeaderService.setBreadcrumbTitle('SLA Policies');
    this.headerService.setDashBoardTitle({ title: 'TICKETS', link: ['/'] });

  }
}
