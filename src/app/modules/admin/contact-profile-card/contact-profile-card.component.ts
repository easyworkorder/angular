import { Component, OnInit, Input, OnChanges } from '@angular/core';
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
    contact: Contact;
    address: any;
    fullName: string;
    photo: string;

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
    }
}
