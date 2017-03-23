import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from "app/modules/authentication";

@Component({
  selector: 'ewo-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  constructor(private authService: AuthenticationService) {
    this.authService.verifyToken();
  }

  ngOnInit() {
  }
}
