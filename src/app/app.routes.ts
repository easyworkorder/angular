import { Routes, RouterModule } from '@angular/router';

import { SigninComponent } from './modules/authentication/signin.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { BuildingComponent } from './modules/admin/building/building.component';
import { TicketComponent } from './modules/ticket/ticket.component';
import { TicketDetailsComponent } from './modules/ticket/ticket_details.component';
import { AddressComponent } from './modules/address/address.component';
import { TenantComponent } from './modules/admin/tenant/tenant.component';
import { TenantListComponent } from './modules/list/tenant-list/tenant-list.component';
import { TenantContactProfileComponent } from './modules/admin/tenant/tenant-contact-profile.component';
import { ProblemTypeComponent } from './modules/admin/problem_type/problem_type.component';
import { SLAPolicyComponent } from './modules/admin/sla_policy/sla_policy.component';
import { EmployeeComponent } from './modules/admin/employee/employee.component';
import { EmployeeListComponent } from './modules/list/employee-list/employee-list.component';
import { AdminSetupComponent } from './modules/admin_setup/admin_setup.component';
import { AdminDashboardComponent } from './modules/admin/admin-dashboard/admin-dashboard.component';
import { AuthGuard } from "app/services/auth-guard.service";
import { APP_RESOLVER_PROVIDERS, AdminDashBoardResolver, TicketDashBoardResolver, DashBoardResolver } from './app.route-resolvers';
import { NoContentComponent } from "app/modules/shared/no-content.component";
import { BuildingAdminComponent } from "app/modules/admin/building-admin/building-admin.component";
import { BuildingAdminDetailsComponent } from "app/modules/admin/building-admin/building-admin-details.component";
import { UserDashboardComponent } from "app/modules/dashboard/user-dashboard.component";
import {VendorComponent} from "./modules/admin/vendor/vendor.component";
import {VendorListComponent} from "./modules/list/vendor-list/vendor-list.component";
import { VendorContactProfileComponent } from './modules/admin/vendor/vendor-contact-profile.component';


export const appRoutes: Routes = [
    {
        path: '', component: DashboardComponent,
        // resolve: {
        //   token: DashBoardResolver
        // },
        children: [
            // FIXME: For the time being renaming the route to an arbitary name
            // later on we will need to fix it.
            // Probably after login based on user previladge this component will be loaded
            // or routed dynamically.
            // Now we are redirecting all type of users to the dashboard.
            // And form there, user specific views will be loaded by their type(user group)
            { path: '', component: UserDashboardComponent, pathMatch: 'full' },
            { path: 'ticketlist', component: TicketComponent, pathMatch: 'full' },
            {
                path: 'ticket-details/:id', component: TicketDetailsComponent,
                resolve: {
                    admin: TicketDashBoardResolver
                },
                data: {
                    breadcrumb: "Ticket Details"
                },
            },
            { path: 'employee', component: EmployeeListComponent, pathMatch: 'full' },
            { path: 'tenant', component: TenantListComponent, pathMatch: 'full' },
            {
                path: 'tenant-profile/:id', component: TenantContactProfileComponent,
                resolve: {
                    admin: AdminDashBoardResolver
                },
                data: {
                    breadcrumb: "Tenant Profile"
                },
            },
            { path: 'vendor', component: VendorListComponent, pathMatch: 'full' },
            { path: 'address', component: AddressComponent, pathMatch: 'full' },
            {
                path: 'admin', component: AdminDashboardComponent,
                resolve: {
                    ticket: TicketDashBoardResolver
                },
                data: {
                    breadcrumb: "Administrator Portal"
                },
                // canActivateChild: [AuthGuard],
                children: [
                    { path: '', component: AdminSetupComponent },
                    {
                        path: 'building', component: BuildingComponent, resolve: {
                            admin: AdminDashBoardResolver
                        },
                        data: {
                            breadcrumb: "Buildings"
                        },
                    },
                    {
                        path: 'building-details/:id', component: BuildingAdminComponent, resolve: {
                            admin: AdminDashBoardResolver
                        },
                        data: {
                            breadcrumb: "Building Admin"
                        },
                        children: [
                            { path: '', component: BuildingAdminDetailsComponent },
                            {
                                path: 'tenant-profile/:id', component: TenantContactProfileComponent,
                                resolve: {
                                    admin: AdminDashBoardResolver
                                },
                                data: {
                                    breadcrumb: "Tenant Profile"
                                },
                            }
                        ]
                    },
                    // {
                    //   path: 'building-details/:id/tenant-profile/:id', component: TenantContactComponent, resolve: {
                    //     admin: AdminDashBoardResolver
                    //   },
                    // },
                    {
                        path: 'employee', component: EmployeeComponent, resolve: {
                            admin: AdminDashBoardResolver
                        },
                    },
                    {
                        path: 'vendor', component: VendorComponent, resolve: {
                            admin: AdminDashBoardResolver
                        },
                        data: {
                            breadcrumb: "Vendors"
                        },
                    },
                    {
                        path: 'vendor-profile/:id', component: VendorContactProfileComponent, resolve: {
                            admin: AdminDashBoardResolver
                        },
                        data: {
                            breadcrumb: "Vendor Profile"
                        },
                    },
                    {
                        path: 'tenant', component: TenantComponent, resolve: {
                            admin: AdminDashBoardResolver
                        },
                    },
                    {
                        path: 'contact-profile/:id', component: TenantContactProfileComponent
                    },
                    {
                        path: 'problem-type', component: ProblemTypeComponent, resolve: {
                            admin: AdminDashBoardResolver
                        },
                    },
                    {
                        path: 'sla-policy', component: SLAPolicyComponent, resolve: {
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
