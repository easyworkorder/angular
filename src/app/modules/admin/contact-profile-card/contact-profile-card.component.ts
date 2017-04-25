import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { DataService } from "app/services";
import { TenantService } from "app/modules/admin/tenant/tenant.service";
import { Contact } from "app/modules/admin/contact-profile-card/contact";
declare var $: any;

@Component({
    selector: 'ewo-contact-profile-card',
    templateUrl: './contact-profile-card.component.html'
})
export class ContactProfileCardComponent implements OnInit {
    @Input() contactInfo: Contact;
    @Input() tenant: any;
    @Output('update') change: EventEmitter<any> = new EventEmitter<any>();

    contact: Contact;
    address: any;
    fullName: string;
    photo: string;

    tenantInfo: any;
    constructor(private tenantService: TenantService,
        private dataService: DataService,
        private route: ActivatedRoute) {
    }

    ngOnInit () {
        this.contactInfo = new Contact('', '', '', '', '', '', '', '', '', '', '', '', '');
    }
    ngOnChanges (changes) {
        if (changes['contactInfo']) {
            if (changes['contactInfo'].currentValue) {
                this.contact = changes['contactInfo'].currentValue;
                // console.log('tickets Assign>>', this.ticketList);
                this.fullName = this.dataService.buildName(this.contact.first_name, this.contact.last_name);
                this.address = this.dataService.buildTenantContactAddressHtml(this.contact);
                this.photo = this.dataService.getPhotoUrl(this.contact.photo)

            }
        }
        if (changes['tenant']) {
            if (changes['tenant'].currentValue) {
                this.tenantInfo = changes['tenant'].currentValue;
            }
        }

    }

    editTenant (contact) {
        // this.tenantService.getTenant(contact.tenant).subscribe(tenant => {
        $('#edit-tenant-modal').modal({
            modal: 'show',
            backdrop: 'static'
        });
    }
    updateTenant (tenant) {
        this.change.emit(tenant);
    }
}
