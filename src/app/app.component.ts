import { Component } from '@angular/core';
import { ToasterConfig } from 'angular2-toaster';
import { AuthenticationService } from "app/modules/authentication";
import { BreadcrumbService } from "app/modules/shared/breadcrumb";
import { Router } from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private breadcrumbService: BreadcrumbService) {
    // this.authService.verifyToken();
    //Dashboard
    breadcrumbService.addFriendlyNameForRoute('', 'Desktop');
    breadcrumbService.addFriendlyNameForRoute('/employee', 'Employees');
    breadcrumbService.addFriendlyNameForRoute('/tenant', 'Tenants');
    // breadcrumbService.addFriendlyNameForRoute('/tenant-profile', 'Tenants');
    // breadcrumbService.addCallbackForRoute('/tenant-profile', this.tenantProfileNav);
    breadcrumbService.addFriendlyNameForRouteRegex('^/tenant/[0-9]{1,10}$', 'Tenant Profile');
    // breadcrumbService.addCallbackForRoute('^/tenant-profile/[0-9]{1,10}$', this.tenantProfileNav);
    breadcrumbService.addFriendlyNameForRoute('/vendor', 'Vendors');
    breadcrumbService.addFriendlyNameForRouteRegex('^/vendor/[0-9]{1,10}$', 'Vendor Profile');

    //Tickets
    breadcrumbService.addFriendlyNameForRoute('/ticketlist', 'Tickets');
    breadcrumbService.addFriendlyNameForRoute('/ticket-details', 'Tickets');
    breadcrumbService.addFriendlyNameForRouteRegex('^/ticket-details/[0-9]{1,10}$', 'Ticket Details');
    //For Tickets Details april20
    breadcrumbService.addFriendlyNameForRouteRegex('^/admin/building/[0-9]{1,10}/tenant-profile/[0-9]{1,10}/ticket-details/[0-9]{1,10}$', 'Ticket Details');
    breadcrumbService.hideRouteRegex('^/ticket-details/[0-9]{1,10}/admin/building/[0-9]{1,10}/tenant-profile/[0-9]{1,10}/ticket-details$');
    breadcrumbService.hideRouteRegex('^/admin/building/[0-9]{1,10}/tenant-profile/[0-9]{1,10}/ticket-details$');

    breadcrumbService.addFriendlyNameForRouteRegex('^/tenant/[0-9]{1,10}/ticket-details/[0-9]{1,10}$', 'Ticket Details');
    breadcrumbService.addFriendlyNameForRouteRegex('^/vendor/[0-9]{1,10}/ticket-details/[0-9]{1,10}$', 'Ticket Details');
    breadcrumbService.hideRouteRegex('^/tenant/[0-9]{1,10}/ticket-details$');
    breadcrumbService.hideRouteRegex('^/vendor/[0-9]{1,10}/ticket-details$');

    //Building
    breadcrumbService.addFriendlyNameForRoute('/admin', 'Administrator Portal');
    breadcrumbService.addFriendlyNameForRoute('/admin/building', 'Buildings');
    breadcrumbService.addFriendlyNameForRouteRegex('^/admin/building/[0-9]{1,10}$', 'Tenants');
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

  tenantProfileNav (id: string): string {
    console.log('id', id);
    // this.router.navigate(['/tenant']);
    return '';
  }
}
