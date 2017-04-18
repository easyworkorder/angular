import { Component, OnInit, Input, EventEmitter, Output, Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
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

    @Input() vendor: any;
    @Input() insurances: any;
    @Input() tickets: any;
    @Input() isAdmin: false;
    @Input() isDashboardList: false;
    @Input() isVendor: boolean =  false;
    @Output('update') change: EventEmitter<any> = new EventEmitter<any>();

    currentCompanyId = 1;

    tabs = new TabVisibility();
    constructor(
        private vendorService: VendorService,
        private updateVendorPeopleService: UpdateVendorPeopleService,
        private updateVendorInsuranceService: UpdateVendorInsuranceService,
        private ticketService: TicketService) { }

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

    updateInsuranceInfo(data) {
        // this.updatePeopleInfo = data;
        this.updateVendorInsuranceService.setUpdateInsurance(data);
        $('#add-vendor-insurance').modal({
            backdrop: 'static',
            show: true
        });
    }
}
