import { Component, OnInit, Input, EventEmitter, Output, Injectable } from '@angular/core';
import { AppHttp } from 'app/services';
import { ToasterService } from 'angular2-toaster';
import { UpdatePeopleService } from 'app/modules/admin/tenant/people.service';
import { UpdateTenantInsuranceService } from './tenant-insurance.service';
import { TicketService } from './../../ticket/ticket.service';
import { TenantService } from 'app/modules/admin/tenant/tenant.service';
declare var $: any;

export class TabVisibility {
    isTicketTabVisible = true;
    isInvoiceTabVisible = false;
    isPeopleTabVisible = false;
    isInsuranceTabVisible = false;
    isFilesTabVisible = false;
    selectedTabNo = 1;
}

@Component({
    selector: 'ewo-tenant-contact-activities',
    templateUrl: './tenant-contact-activities.component.html'
})
export class TenantContactActivitiesComponent implements OnInit {
    toDeletedPeople: any;
    toSendPassword: any;

    @Input() tenant: any;
    @Input() insurances: any;
    @Input() tickets: any;
    @Input() files: any;
    @Input() isAdmin: boolean = false;
    @Input() isDashboardList: boolean = false;
    @Input() isTenant: boolean = false;
    @Output('update') change: EventEmitter<any> = new EventEmitter<any>();

    currentCompanyId = 1;

    tabs = new TabVisibility();
    constructor(private updatePeopleService: UpdatePeopleService,
        private updateTenantInsuranceService: UpdateTenantInsuranceService,
        private ticketService: TicketService,
        private tenantService: TenantService,
        protected http: AppHttp,
        private toasterService: ToasterService
    ) { }

    ngOnInit () {
        if (this.isTenant === false && this.tenant) {
            this.getAllTenantTickets(this.tenant.id);
        }
    }

    switchTab (tabId: number) {
        this.tabs.isTicketTabVisible = tabId == 1 ? true : false;
        this.tabs.isInvoiceTabVisible = tabId == 2 ? true : false;
        this.tabs.isPeopleTabVisible = tabId == 3 ? true : false;
        this.tabs.isInsuranceTabVisible = tabId == 4 ? true : false;
        this.tabs.isFilesTabVisible = tabId == 5 ? true : false;
        this.tabs.selectedTabNo = tabId;
    }

    getAllTenantTickets (tenant_id) {
        this.ticketService.getAllTickets(this.currentCompanyId, 'tenant_profile', tenant_id).subscribe(
            data => {
                this.tickets = data;
            }
        );
    }

    updateTicketList (data) {
        if (this.isTenant === false) {
            this.getAllTenantTickets(this.tenant.id);
        } else {
            this.ticketService.updateTicketList(true);
        }
    }

    updatePeople (event) {
        this.change.emit(event);
    }

    updateFileList (event) {
        this.change.emit(event);
    }

    updateContactInfo (data) {
        // this.updatePeopleInfo = data;
        this.updatePeopleService.setUpdatePeople(data);
        $('#add-tenant-cotact-people').modal({
            show: true,
            backdrop: 'static'
        });
    }

    updateInsurance (event) {
        this.change.emit(event);
    }

    updateInsuranceInfo (data) {
        // this.updatePeopleInfo = data;
        this.updateTenantInsuranceService.setUpdateInsurance(data);
        $('#add-tenant-insurance').modal({
            show: true,
            backdrop: 'static'
        });
    }
    deleteContactInfo (data) {
        // this.updatePeopleInfo = data;
        // this.updatePeopleService.setUpdatePeople(data);
        $('#modal-tenant-people-delete-confirm').modal({
            show: true,
            backdrop: 'static'
        });
        this.toDeletedPeople = data;
    }

    onModalOkButtonClick (event) {
        if (this.toDeletedPeople) {
            this.tenantService.deleteContact(this.toDeletedPeople).subscribe(() => {
                this.change.emit(event);
                $('#modal-tenant-people-delete-confirm').modal('hide');
            });
        }
    }

    sendNewPassword (contact) {
        $('#modal-send-password-confirm-list').modal({
            show: true,
            backdrop: 'static'
        });
        this.toSendPassword = contact;
    }

    onModalOkButtonClickToSendPassword (event) {
        const observable = this.http.get('sendpassword/' + this.toSendPassword.id + '/?type=tenant');
        observable.subscribe(data => {
                this.toasterService.pop('success', 'SEND', 'Password has been send successfully');
            },
            error => {
                this.toasterService.pop('error', 'SEND', 'Password not send due to API error!!!');
            });
        $('#modal-send-password-confirm-list').modal('hide');
    }
}
