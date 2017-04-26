import { Component, OnInit, Input, EventEmitter, Output, Injectable } from '@angular/core';
import { AppHttp } from 'app/services';
import { ToasterService } from 'angular2-toaster';
import { VendorService } from './vendor.service';
import { UpdateVendorPeopleService } from './vendor-people.service';
import { UpdateVendorInsuranceService } from './vendor-insurance.service';
import {TicketService} from './../../ticket/ticket.service';

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
    selector: 'ewo-vendor-contact-activities',
    templateUrl: './vendor-contact-activities.component.html'
})
export class VendorContactActivitiesComponent implements OnInit {

    toSendPassword: any;

    @Input() vendor: any;
    @Input() insurances: any;
    @Input() files: any;
    @Input() tickets: any;
    @Input() isAdmin: false;
    @Input() isDashboardList: false;
    @Input() isVendor: boolean =  false;
    @Output('update') change: EventEmitter<any> = new EventEmitter<any>();

    toDeletedPeople: any;

    currentCompanyId = 1;

    tabs = new TabVisibility();
    constructor(
        private vendorService: VendorService,
        private updateVendorPeopleService: UpdateVendorPeopleService,
        private updateVendorInsuranceService: UpdateVendorInsuranceService,
        private ticketService: TicketService,
        protected http: AppHttp,
        private toasterService: ToasterService) { }

    ngOnInit() {
        if (this.isVendor === false) {
            this.getAllVendorTickets(this.vendor.id);
        }
    }

    switchTab(tabId: number) {
        this.tabs.isTicketTabVisible = tabId === 1 ? true : false;
        this.tabs.isInvoiceTabVisible = tabId === 2 ? true : false;
        this.tabs.isPeopleTabVisible = tabId === 3 ? true : false;
        this.tabs.isInsuranceTabVisible = tabId === 4 ? true : false;
        this.tabs.isFilesTabVisible = tabId === 5 ? true : false;
        this.tabs.selectedTabNo = tabId;
    }

    getAllVendorTickets(vendor_id) {
        this.ticketService.getAllTickets(this.currentCompanyId, 'vendor_profile', vendor_id).subscribe(
            data => {
                this.tickets = data;
            }
        );
    }

    updateTicketList(data) {
        if ( this.isVendor === false) {
            this.getAllVendorTickets(this.vendor.id);
        } else {
            this.ticketService.updateTicketList(true);
        }

    }

    updatePeople(event) {
        this.change.emit(event);
    }

    updateContactInfo(data) {
        // this.updatePeopleInfo = data;
        this.updateVendorPeopleService.setUpdatePeople(data);
        $('#add-vendor-cotact-people').modal({
            backdrop: 'static',
            show: true
        });
    }

    updateInsurance(event) {
        this.change.emit(event);
    }

    updateFileList(event){
        this.change.emit(event);
    }

    updateInsuranceInfo(data) {
        // this.updatePeopleInfo = data;
        this.updateVendorInsuranceService.setUpdateInsurance(data);
        $('#add-vendor-insurance').modal({
            backdrop: 'static',
            show: true
        });
    }

    deleteContactInfo (data) {
        // this.updatePeopleInfo = data;
        // this.updatePeopleService.setUpdatePeople(data);
        $('#modal-vendor-people-delete-confirm').modal({
            show: true,
            backdrop: 'static'
        });
        this.toDeletedPeople = data;
    }

    onModalOkButtonClick (event) {
        if (this.toDeletedPeople) {
            this.vendorService.deleteContact(this.toDeletedPeople).subscribe(() => {
                this.change.emit(event);
                $('#modal-vendor-people-delete-confirm').modal('hide');
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
        const observable = this.http.get('sendpassword/' + this.toSendPassword.id + '/?type=vendor');
        observable.subscribe(data => {
                this.toasterService.pop('success', 'SEND', 'Password has been send successfully');
            },
            error => {
                this.toasterService.pop('error', 'SEND', 'Password not send due to API error!!!');
            });
        $('#modal-send-password-confirm-list').modal('hide');
    }
}
