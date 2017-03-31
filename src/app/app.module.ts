import { APP_BASE_HREF } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, BaseRequestOptions, XHRBackend, XSRFStrategy, CookieXSRFStrategy } from '@angular/http';
import { ToasterModule, ToasterService } from 'angular2-toaster';
import { SelectModule } from 'ng2-select';

import { routing } from './app.routes';

import { AppComponent } from './app.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { HeaderService } from './modules/shared/header/header.service';
import { HeaderComponent } from './modules/shared/header/header.component';
import { LeftMenuComponent } from './modules/shared/left-menu/left-menu.component';
import { ClickInsideDirective } from './directives/click-inside.directive';

import {
    Storage,
    AppHttp,
    EventService, // global
    NotificationService, // global
    DataService
} from './services';

import { AuthenticationService, SigninComponent } from './modules/authentication';
import { BuildingService } from './modules/admin/building/building.service';
import { AddressService } from './modules/address/address.service';
import { TenantService } from './modules/admin/tenant/tenant.service';
import { ProblemTypeService } from './modules/admin/problem_type/problem_type.service';
import { SLAPolicyService } from './modules/admin/sla_policy/sla_policy.service';
import { EmployeeService } from './modules/admin/employee/employee.service';
import { VendorService } from './modules/admin/vendor/vendor.service';
import { TicketService } from './modules/ticket/ticket.service';

// import { NotFoundComponent } from './components/not-found/not-found.component';
import {APP_RESOLVER_PROVIDERS} from "./app.route-resolvers";

import {
    FormControlValidator,
    ActiveDirective,
} from './directives';

import {
    PluralizePipe,
    TruncatePipe,
    SafePipe,
    FilterWithStartLetterPipe
} from './pipes';
import { BuildingComponent } from './modules/admin/building/building.component';
import { AddressComponent } from './modules/address/address.component';
import { TenantComponent } from './modules/admin/tenant/tenant.component';
import { TenantListComponent } from './modules/list/tenant-list/tenant-list.component';
import { TenantContactProfileComponent} from './modules/admin/tenant/tenant-contact-profile.component';
import { ProblemTypeComponent } from './modules/admin/problem_type/problem_type.component';
import { SLAPolicyComponent } from './modules/admin/sla_policy/sla_policy.component';
import { EmployeeComponent } from './modules/admin/employee/employee.component';
import { EmployeeListComponent } from './modules/list/employee-list/employee-list.component';
import { TicketComponent } from './modules/ticket/ticket.component';
import { TicketDetailsComponent } from './modules/ticket/ticket_details.component';
import { AdminSetupComponent } from './modules/admin_setup/admin_setup.component';
import { ValidationMessagesComponent } from './validation_messages.component';
import { VendorComponent } from './modules/admin/vendor/vendor.component';
import { VendorListComponent } from './modules/list/vendor-list/vendor-list.component';
import { VendorContactProfileComponent } from './modules/admin/vendor/vendor-contact-profile.component';
import { VendorContactProfileCardComponent } from './modules/admin/contact-profile-card/vendor-contact-profile-card.component';

import { ValidationService } from './services/validation.service'
import { AuthGuard } from "app/services/auth-guard.service";
import { EmployeeStartWithPipe, EmployeeMultipleStartWithPipe } from './modules/admin/employee/employee.pipe';
import { AdminDashboardComponent } from './modules/admin/admin-dashboard/admin-dashboard.component';
import { NoContentComponent } from "app/modules/shared/no-content.component";
import { BuildingAdminComponent } from './modules/admin/building-admin/building-admin.component';
import { BuildingInformationComponent } from './modules/admin/building-admin/building-information.component';
import { RemitInformationComponent } from './modules/admin/building-admin/remit-information.component';
import { BreadcrumbHeaderComponent } from './modules/shared/breadcrumb-header/breadcrumb-header.component';
import { BuildingAdminDetailsComponent } from './modules/admin/building-admin/building-admin-details.component';
import { UserDashboardComponent } from './modules/dashboard/user-dashboard.component';
import { ContactProfileCardComponent } from './modules/admin/contact-profile-card/contact-profile-card.component';
import { ContactActivitiesComponent } from './modules/admin/contact-activities/contact-activities.component';
import { BreadcrumbComponent } from './modules/shared/breadcrumb/breadcrumb.component';
import { BreadcrumbHeaderService } from "app/modules/shared/breadcrumb-header/breadcrumb-header.service";
import { AlphabeticalSortComponent } from './modules/shared/alphabetical-sort/alphabetical-sort.component';
import { ContactListComponent } from "app/modules/shared/contact-list/contact-list.component";
import { TenantContactActivitiesComponent } from './modules/admin/tenant/tenant-contact-activities.component';
import { TenantContactPeopleComponent } from './modules/admin/tenant/tenant-contact-people.component';
import { UpdatePeopleService } from "app/modules/admin/tenant/people.service";
import { CalendarModule } from "app/modules/shared/calendar/calendar.component";


export function translateStaticLoaderFactory(Backend, defaultOptions, storage, notificationService) {
    return new AppHttp(Backend, defaultOptions, storage, notificationService);
};


@NgModule({
    declarations: [
        AppComponent,
        // NotificationComponent,
        // NotificationListComponent,
        // FooterComponent,
        // TicketListComponent,
        // AppDrawerComponent,
        SigninComponent,
        DashboardComponent,
        HeaderComponent,
        LeftMenuComponent,
        // NotFoundComponent,

        // Pipes
        SafePipe,
        PluralizePipe,
        TruncatePipe,
        FilterWithStartLetterPipe,
        // Directives
        FormControlValidator,
        ActiveDirective,
        BuildingComponent,
        AddressComponent,
        TenantComponent,
        TenantListComponent,
        TenantContactProfileComponent,
        ProblemTypeComponent,
        SLAPolicyComponent,
        EmployeeComponent,
        EmployeeListComponent,
        TicketComponent,
        TicketDetailsComponent,
        VendorComponent,
        VendorListComponent,
        VendorContactProfileComponent,
        VendorContactProfileCardComponent,
        AdminSetupComponent,

        //Validation Messages
        ValidationMessagesComponent,

        EmployeeStartWithPipe,
        EmployeeMultipleStartWithPipe,
        AdminDashboardComponent,
        NoContentComponent,
        BuildingAdminComponent,
        ClickInsideDirective,
        BuildingInformationComponent,
        RemitInformationComponent,
        BreadcrumbHeaderComponent,
        BuildingAdminDetailsComponent,
        UserDashboardComponent,
        ContactProfileCardComponent,
        ContactActivitiesComponent,
        BreadcrumbComponent,
        AlphabeticalSortComponent,
        ContactListComponent,
        TenantContactActivitiesComponent,
        TenantContactPeopleComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        routing,
        ToasterModule,
        SelectModule,
        CalendarModule,
    ],
    providers: [
        AuthGuard,
        BaseRequestOptions,
        Storage,
        DataService,
        AuthenticationService,
        BuildingService,
        AddressService,
        TenantService,
        TicketService,
        ProblemTypeService,
        SLAPolicyService,
        EmployeeService,
        VendorService,
        EventService,
        NotificationService,
        {
            provide: APP_BASE_HREF,
            useValue: '/'
        },
        {
            provide: AppHttp,
            deps: [XHRBackend, BaseRequestOptions, Storage, NotificationService],
            useFactory: translateStaticLoaderFactory
        },
        ValidationService,
        ToasterService,
        HeaderService,
        ...APP_RESOLVER_PROVIDERS,
        BreadcrumbHeaderService,
        UpdatePeopleService
        // { provide: XSRFStrategy, useValue: new      CookieXSRFStrategy('token', 'x-csrftoken')
        // },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
