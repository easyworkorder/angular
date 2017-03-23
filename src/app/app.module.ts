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
import { EmployeeService } from './modules/admin/employee/employee.service';
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
import { TenantListComponent } from './modules/list/tenant/tenant.component';
import { TenantContactComponent} from './modules/admin/tenant/tenant-contact.component';
import { ProblemTypeComponent } from './modules/admin/problem_type/problem_type.component';
import { EmployeeComponent } from './modules/admin/employee/employee.component';
import { EmployeeListComponent } from './modules/list/employee/employee.component';
import { TicketComponent } from './modules/ticket/ticket.component';
import { AdminSetupComponent } from './modules/admin_setup/admin_setup.component';
import { ValidationMessagesComponent } from './validation_messages.component';

import { ValidationService } from './services/validation.service'
import { AuthGuard } from "app/services/auth-guard.service";
import { EmployeeStartWithPipe, EmployeeMultipleStartWithPipe } from './modules/admin/employee/employee.pipe';
import { AdminDashboardComponent } from './modules/admin/admin-dashboard/admin-dashboard.component';
import { NoContentComponent } from "app/modules/shared/no-content.component";
import { BuildingAdminComponent } from './modules/admin/building-admin/building-admin.component';
import { BuildingInformationComponent } from './modules/admin/building-admin/building-information.component';
import { RemitInformationComponent } from './modules/admin/building-admin/remit-information.component';

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
        TenantContactComponent,
        ProblemTypeComponent,
        EmployeeComponent,
        EmployeeListComponent,
        TicketComponent,
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
        RemitInformationComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        routing,
        ToasterModule,
        SelectModule
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
        EmployeeService,
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
        ...APP_RESOLVER_PROVIDERS
        // { provide: XSRFStrategy, useValue: new      CookieXSRFStrategy('token', 'x-csrftoken')
        // },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
