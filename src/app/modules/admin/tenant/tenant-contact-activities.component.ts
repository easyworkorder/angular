import { Component, OnInit, Input, EventEmitter, Output, Injectable } from '@angular/core';
import { Subject } from "rxjs/Subject";
import { UpdatePeopleService } from "app/modules/admin/tenant/people.service";
declare var $:any;

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
    templateUrl: './tenant-contact-activities.component.html',
    styleUrls: ['./tenant-contact-activities.component.css']
})
export class TenantContactActivitiesComponent implements OnInit {
    @Input() tenant: any;
    @Output('update') change: EventEmitter<any> = new EventEmitter<any>();

    // updatePeopleInfo: any;


    tabs = new TabVisibility();
    constructor(private updatePeopleService: UpdatePeopleService) { }

    ngOnInit() {

    }

    switchTab(tabId: number) {
        this.tabs.isTicketTabVisible = tabId == 1 ? true : false;
        this.tabs.isInvoiceTabVisible = tabId == 2 ? true : false;
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
        this.updatePeopleService.setUpdatePeople(data);
         $('#add-tenant-cotact-people').modal('show');
    }
}
