import { APP_BASE_HREF } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
import { VendorService } from './modules/admin/vendor/vendor.service';

// import { NotFoundComponent } from './components/not-found/not-found.component';
import { APP_RESOLVER_PROVIDERS } from "./app.route-resolvers";

import {
    FormControlValidator,
    ActiveDirective,
    ModalDialogDirective
} from './directives';

import {
    PluralizePipe,
    TruncatePipe,
    SafePipe,
    FilterWithStartLetterPipe,
    PhonePipe,
    DateFormatPipe,
} from './pipes';
import { BuildingComponent } from './modules/admin/building/building.component';
import { AddressComponent } from './modules/address/address.component';
import { TenantComponent } from './modules/admin/tenant/tenant.component';
import { TenantListComponent } from './modules/list/tenant-list/tenant-list.component';
import { TenantContactProfileComponent } from './modules/admin/tenant/tenant-contact-profile.component';
import { ProblemTypeComponent } from './modules/admin/problem_type/problem_type.component';
import { EmployeeComponent } from './modules/admin/employee/employee.component';
import { EmployeeListComponent } from './modules/list/employee-list/employee-list.component';
/**
 * Ticket
 */
import { TicketComponent } from './modules/ticket/ticket.component';
import { TicketDetailsComponent } from './modules/ticket/ticket-details.component';
import { TicketEditComponent } from './modules/ticket/ticket-edit.component';
import { TicketActivityComponent } from './modules/ticket/ticket-activity.component';
import { UpdateTicketLaborService } from './modules/ticket/ticket-labor.service';
import { TicketLaborComponent } from './modules/ticket/ticket-labor.component';
import { UpdateTicketMaterialService } from './modules/ticket/ticket-material.service';
import { TicketMaterialComponent } from './modules/ticket/ticket-material.component';
import { TicketListComponent } from './modules/shared/ticket/ticket-list.component';
import { TicketService } from './modules/ticket/ticket.service';

import { AdminSetupComponent } from './modules/admin_setup/admin_setup.component';
import { ValidationMessagesComponent } from './validation_messages.component';

/**
 * Vendor Admin
 */
import { VendorComponent } from './modules/admin/vendor/vendor.component';
import { VendorContactProfileComponent } from './modules/admin/vendor/vendor-contact-profile.component';
import { VendorContactProfileCardComponent } from './modules/admin/contact-profile-card/vendor-contact-profile-card.component';
import { VendorContactActivitiesComponent } from './modules/admin/vendor/vendor-contact-activities.component';
import { VendorContactPeopleComponent } from './modules/admin/vendor/vendor-contact-people.component';
import { VendorInsuranceComponent } from './modules/admin/vendor/vendor-insurance.component';
import { UpdateVendorPeopleService } from 'app/modules/admin/vendor/vendor-people.service';
import { UpdateVendorInsuranceService } from 'app/modules/admin/vendor/vendor-insurance.service';

/**
 * Vendor Dashboard
 */
import { VendorListComponent } from './modules/list/vendor-list/vendor-list.component';
import { VendorProfileComponent } from './modules/list/vendor-list/vendor-profile.component';

/**
 * Vendor Dashboard after login
 */
import { VendorDashboardComponent } from './modules/dashboard/vendor-dashboard.component';

/**
 * Tenant Admin
 */
import { TenantContactActivitiesComponent } from './modules/admin/tenant/tenant-contact-activities.component';
import { TenantContactPeopleComponent } from './modules/admin/tenant/tenant-contact-people.component';
import { TenantInsuranceComponent } from './modules/admin/tenant/tenant-insurance.component';
import { UpdateTenantInsuranceService } from 'app/modules/admin/tenant/tenant-insurance.service';
import { UpdatePeopleService } from "app/modules/admin/tenant/people.service";

/**
 * Tenant dashboard list component
 */
import { ContactListComponent } from "app/modules/shared/contact-list/contact-list.component";
import { TenantProfileComponent } from './modules/list/tenant-list/tenant-profile.component';

/**
 * Tenant Dashboard after login
 */
import { TenantDashboardComponent } from './modules/dashboard/tenant-dashboard.component';
import { TenantAddTicketComponent } from './modules/shared/ticket/tenant-add-ticket.component';

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
import { BreadcrumbHeaderService } from "app/modules/shared/breadcrumb-header/breadcrumb-header.service";
import { AlphabeticalSortComponent } from './modules/shared/alphabetical-sort/alphabetical-sort.component';
import { InsuranceListComponent } from "app/modules/shared/insurance-list/insurance-list.component";

import { CalendarModule } from "app/modules/shared/calendar/calendar.component";
import { SLAPolicyComponent } from './modules/admin/sla-policy/sla-policy.component';
import { SLAPolicyService } from "app/modules/admin/sla-policy/sla-policy.service";

/**
 * Import list components
 */
import { VendorListItemComponent } from './modules/shared/list-item/vendor-list-item.component';
import { TenantListItemComponent } from './modules/shared/list-item/tenant-list-item.component';
import { EmployeeListItemComponent } from './modules/shared/list-item/employee-list-item.component';
import { BuildingSlaTargetComponent } from './modules/admin/sla-policy/building-sla-target.component';

import { InputValueRestrictionModule } from "app/directives/input-value-restriction.directive";
import { LoadingSpinnerModule } from "app/modules/shared/loading-spinner/loading-spinner.module";
import { BreadcrumbComponent, BreadcrumbService } from "app/modules/shared/breadcrumb";
import { VerifyEmailComponent } from "app/modules/shared/verify-email.component";
import { VerifyEmailService } from "app/modules/shared/verify-email.service";
import { ConfirmModalComponent } from './modules/shared/confirm-modal/confirm-modal.component';
import { AssignTicketComponent } from './modules/shared/ticket/assign-ticket.component';

export function translateStaticLoaderFactory (Backend, defaultOptions, storage, notificationService) {
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
        PhonePipe,
        DateFormatPipe,
        // Directives
        FormControlValidator,
        ActiveDirective,
        BuildingComponent,
        AddressComponent,
        TenantComponent,
        TenantContactProfileComponent,
        TenantInsuranceComponent,
        ProblemTypeComponent,
        EmployeeComponent,
        EmployeeListComponent,
        /**
         * Ticket
         */
        TicketComponent,
        TicketDetailsComponent,
        TicketEditComponent,
        TicketActivityComponent,
        TicketLaborComponent,
        TicketMaterialComponent,
        TicketListComponent,

        /**
         * Vendor Admin component
         */
        VendorComponent,
        VendorContactProfileComponent,
        VendorContactProfileCardComponent,
        VendorContactActivitiesComponent,
        VendorContactPeopleComponent,
        VendorInsuranceComponent,

        /**
         * Vendor dashboard list component
         */
        VendorListComponent,
        VendorProfileComponent,

        /**
         * Vendor dashboard after login
         */
        VendorDashboardComponent,

        /**
         * Tenant dashboard list component
         */
        TenantListComponent,
        TenantProfileComponent,

        /**
         * Tenant dashboard after login
         */
        TenantDashboardComponent,
        TenantAddTicketComponent,

        AdminSetupComponent,

        // Validation Messages
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
        AlphabeticalSortComponent,
        ContactListComponent,
        InsuranceListComponent,
        TenantContactActivitiesComponent,
        TenantContactPeopleComponent,
        SLAPolicyComponent,

        // List Item components
        VendorListItemComponent,
        TenantListItemComponent,
        EmployeeListItemComponent,
        BuildingSlaTargetComponent,
        ModalDialogDirective,
        BreadcrumbComponent,
        VerifyEmailComponent,
        ConfirmModalComponent,
        AssignTicketComponent
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
        // TextMaskModule,
        InputValueRestrictionModule,
        LoadingSpinnerModule,
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
        UpdateTicketLaborService,
        UpdateTicketMaterialService,
        ProblemTypeService,
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
        UpdatePeopleService,
        UpdateVendorPeopleService,
        UpdateVendorInsuranceService,
        UpdateTenantInsuranceService,
        SLAPolicyService,
        BreadcrumbService,
        VerifyEmailService

        // { provide: XSRFStrategy, useValue: new      CookieXSRFStrategy('token', 'x-csrftoken')
        // },
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    bootstrap: [AppComponent]
})
export class AppModule { }
