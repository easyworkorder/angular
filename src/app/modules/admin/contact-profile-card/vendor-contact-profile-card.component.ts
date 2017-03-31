import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { DataService } from "app/services";
import { VendorService } from "app/modules/admin/vendor/vendor.service";
import {VendorContact} from "app/modules/admin/contact-profile-card/vendor-contact";

@Component({
    selector: 'ewo-vendor-contact-profile-card',
    templateUrl: './vendor-contact-profile-card.component.html'
})
export class VendorContactProfileCardComponent implements OnInit {
    @Input() contactInfo: VendorContact;

    constructor(private vendorService: VendorService,
        private dataService: DataService,
        private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.contactInfo = new VendorContact('', '', '', '', '', '', '', '', '', '', '', '');
    }

    getPhotoUrl(contact) {
        return this.dataService.getPhotoUrl(contact.photo);
    }

    buildAddressHtml(contact) {
        return this.dataService.buildVendorAddressHtml(contact, contact.companyName);
    }
}
