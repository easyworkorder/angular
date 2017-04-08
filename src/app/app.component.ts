import { Component } from '@angular/core';
import { ToasterConfig } from 'angular2-toaster';
import { AuthenticationService } from "app/modules/authentication";
import { BreadcrumbService } from "app/modules/shared/breadcrumb";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';

  constructor(
    private authService: AuthenticationService,
    private breadcrumbService: BreadcrumbService) {
    // this.authService.verifyToken();

    //Building
    breadcrumbService.addFriendlyNameForRoute('/admin', 'Administrator Portal');
    breadcrumbService.addFriendlyNameForRoute('/admin/building', 'Buildings');
    breadcrumbService.addFriendlyNameForRouteRegex('^/admin/building/[0-9]{1,10}$', 'Building Admin');
    breadcrumbService.addFriendlyNameForRouteRegex('^/admin/building/[0-9]{1,10}/tenant-profile/[0-9]{1,10}$', 'Tenant Profile');
    breadcrumbService.hideRouteRegex('^/admin/building/[0-9]{1,10}/tenant-profile$');
    //Employee
    breadcrumbService.addFriendlyNameForRoute('/admin/employee', 'Employees');
    //Vendor
    breadcrumbService.addFriendlyNameForRoute('/admin/vendor', 'Vendors');
    breadcrumbService.addFriendlyNameForRouteRegex('^/admin/vendor/[0-9]{1,10}$', 'Vendor Profile');
    //Problem Type
    breadcrumbService.addFriendlyNameForRoute('/admin/problem-type', 'Problem Type');
    //sla policy
    breadcrumbService.addFriendlyNameForRoute('/admin/sla-policy', 'SLA Policy');
  }
  toasterconfig: ToasterConfig =
  new ToasterConfig({
    timeout: 3000,
    positionClass: 'toast-top-center',
  });
}
