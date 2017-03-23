import { Routes, RouterModule } from '@angular/router';

import { SigninComponent } from './modules/authentication/signin.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { BuildingComponent } from './modules/admin/building/building.component';
import { TicketComponent } from './modules/ticket/ticket.component';
import { AddressComponent } from './modules/address/address.component';
import { TenantComponent } from './modules/admin/tenant/tenant.component';
import { TenantListComponent } from './modules/list/tenant-list/tenant-list.component';
import { TenantContactComponent } from './modules/admin/tenant/tenant-contact.component';
import { ProblemTypeComponent } from './modules/admin/problem_type/problem_type.component';
import { EmployeeComponent } from './modules/admin/employee/employee.component';
import { EmployeeListComponent } from './modules/list/employee/employee.component';
import { AdminSetupComponent } from './modules/admin_setup/admin_setup.component';
import { AdminDashboardComponent } from './modules/admin/admin-dashboard/admin-dashboard.component';
import { AuthGuard } from "app/services/auth-guard.service";
import { APP_RESOLVER_PROVIDERS, AdminDashBoardResolver, TicketDashBoardResolver, DashBoardResolver } from './app.route-resolvers';
import { NoContentComponent } from "app/modules/shared/no-content.component";
import { BuildingAdminComponent } from "app/modules/admin/building-admin/building-admin.component";


export const appRoutes: Routes = [
  {
    path: '', component: DashboardComponent,
    // resolve: {
    //   token: DashBoardResolver
    // },
    children: [
      { path: '', component: TicketComponent, pathMatch: 'full' },
      { path: 'employee', component: EmployeeListComponent, pathMatch: 'full' },
      { path: 'tenant', component: TenantListComponent, pathMatch: 'full' },
      { path: 'address', component: AddressComponent, pathMatch: 'full' },
      {
        path: 'admin', component: AdminDashboardComponent,
        resolve: {
          ticket: TicketDashBoardResolver
        },
        // canActivateChild: [AuthGuard],
        children: [
          { path: '', component: AdminSetupComponent },
          {
            path: 'building', component: BuildingComponent, resolve: {
              admin: AdminDashBoardResolver
            },
          },
          {
            path: 'building-details/:id', component: BuildingAdminComponent, resolve: {
              admin: AdminDashBoardResolver
            },
          },
          {
            path: 'employee', component: EmployeeComponent, resolve: {
              admin: AdminDashBoardResolver
            },
          },
          {
            path: 'tenant', component: TenantComponent, resolve: {
              admin: AdminDashBoardResolver
            },
          },
          {
            path: 'contact-profile/:id', component: TenantContactComponent
          },
          {
            path: 'problem-type', component: ProblemTypeComponent, resolve: {
              admin: AdminDashBoardResolver
            },
          },
        ]
      },
    ]
  },
  { path: 'signin', component: SigninComponent },
  { path: '**', component: NoContentComponent },
];

export const routing = RouterModule.forRoot(appRoutes);
