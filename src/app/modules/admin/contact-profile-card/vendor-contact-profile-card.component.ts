import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { DataService } from "app/services";
import { VendorService } from "app/modules/admin/vendor/vendor.service";
import { VendorContact } from "app/modules/admin/contact-profile-card/vendor-contact";

@Component({
    selector: 'ewo-vendor-contact-profile-card',
    templateUrl: './vendor-contact-profile-card.component.html'
})
export class VendorContactProfileCardComponent implements OnInit {
    @Input() contactInfo: VendorContact;
    contact: VendorContact;
    address: any;
    fullName: string;
    photo: string;

    constructor(private vendorService: VendorService,
        private dataService: DataService,
        private route: ActivatedRoute) {
    }

    ngOnInit () {
        this.contactInfo = new VendorContact('', '', '', '', '', '', '', '', '', '', '', '');
    }

    ngOnChanges (changes) {
        if (changes['contactInfo']) {
            if (changes['contactInfo'].currentValue) {
                this.contact = changes['contactInfo'].currentValue;
                this.fullName = this.dataService.buildName(this.contact.first_name, this.contact.last_name);
                this.address = this.dataService.buildVendorAddressHtml(this.contact, true);
                this.photo = this.dataService.getPhotoUrl(this.contact.photo);
            }
        }
    }
}
