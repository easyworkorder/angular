import { Component, OnInit, Input, EventEmitter, Output, Injectable } from '@angular/core';
import { Subject } from "rxjs/Subject";
import { VendorService } from './vendor.service';
import { UpdateVendorPeopleService } from "./vendor-people.service";
import { UpdateVendorInsuranceService } from "./vendor-insurance.service";
declare var $:any;

export class TabVisibility {
    isTicketTabVisible = true;
    //isInvoiceTabVisible = false;
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
    @Output('update') change: EventEmitter<any> = new EventEmitter<any>();

    // updatePeopleInfo: any;


    tabs = new TabVisibility();
    constructor(
                private vendorService: VendorService,
                private updateVendorPeopleService: UpdateVendorPeopleService,
                private updateVendorInsuranceService: UpdateVendorInsuranceService) {}

    ngOnInit() {

    }

    switchTab(tabId: number) {
        this.tabs.isTicketTabVisible = tabId == 1 ? true : false;
        //this.tabs.isInvoiceTabVisible = tabId == 2 ? true : false;
        this.tabs.isPeopleTabVisible = tabId == 3 ? true : false;
        this.tabs.isInsuranceTabVisible = tabId == 4 ? true : false;
        this.tabs.isFilesTabVisible = tabId == 5 ? true : false;
        this.tabs.selectedTabNo = tabId;
    }

    updatePeople(event) {
        this.change.emit(event);
    }

    updateContactInfo(data) {
        // this.updatePeopleInfo = data;
        this.updateVendorPeopleService.setUpdatePeople(data);
         $('#add-vendor-cotact-people').modal('show');
    }

    updateInsurance(event) {
        this.change.emit(event);
    }

    updateInsuranceInfo(data) {
        // this.updatePeopleInfo = data;
        this.updateVendorInsuranceService.setUpdateInsurance(data);
        $('#add-vendor-insurance').modal('show');
    }
}
