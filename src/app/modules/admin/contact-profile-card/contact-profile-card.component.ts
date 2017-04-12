import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { DataService } from "app/services";
import { TenantService } from "app/modules/admin/tenant/tenant.service";
import { Contact } from "app/modules/admin/contact-profile-card/contact";

@Component({
    selector: 'ewo-contact-profile-card',
    templateUrl: './contact-profile-card.component.html'
})
export class ContactProfileCardComponent implements OnInit {
    @Input() contactInfo: Contact;

    constructor(private tenantService: TenantService,
        private dataService: DataService,
        private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.contactInfo = new Contact('', '', '', '', '', '', '', '', '', '', '', '', '');
    }

    getPhotoUrl(contact) {
        return this.dataService.getPhotoUrl(contact.photo);
    }

    buildAddressHtml(contact) {
        return this.dataService.buildAddressHtml(contact, contact.tenant_company_name);
    }
}
