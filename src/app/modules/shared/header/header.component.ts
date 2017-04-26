import { Component, OnInit, Input } from '@angular/core';
import { HeaderService } from './header.service';
import { Storage } from 'app/services';
import { AuthenticationService } from "app/modules/authentication";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {

  @Input() userInfo: any;
  dashboarTitle: any;

  constructor(
    private authService: AuthenticationService,
    private headerService: HeaderService,
    private router: Router,
    private storage: Storage) {
      this.headerService.dashboardTitle$.subscribe(data => this.dashboarTitle = data);
  }

  ngOnInit () {
    this.headerService.setDashBoardTitle({ title: 'TICKETS', link: ['/'] });
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
