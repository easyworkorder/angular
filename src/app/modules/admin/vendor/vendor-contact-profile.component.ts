import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VendorService } from './vendor.service';
import { DataService } from './../../../services/data.service';
import { VendorContact } from "app/modules/admin/contact-profile-card/vendor-contact";
import { BreadcrumbHeaderService } from "app/modules/shared/breadcrumb-header/breadcrumb-header.service";


@Component({
    selector: 'ewo-vendor-contact-profile',
    templateUrl: './vendor-contact-profile.component.html',
})
export class VendorContactProfileComponent implements OnInit {
    vendor: any;
    primaryContact: any;
    contactInfo: VendorContact;
    vendorContactPeoples: any;

    constructor(
        private vendorService: VendorService,
        private dataService: DataService,
        private route: ActivatedRoute,
        private breadcrumbHeaderService: BreadcrumbHeaderService
    ) {
    }

    ngOnInit() {
        this.breadcrumbHeaderService.setBreadcrumbTitle('Vendor Profile');
        const contactId = this.route.snapshot.params['id'];
        this.getContactDetails(contactId);
    }

    getContactDetails(contactId) {

        this.vendorService.getContactDetails(contactId)
            .mergeMap(conact => this.vendorService.getVendor(conact.vendor), (contactInfo, vendorInfo) => ({ contactInfo, vendorInfo }))
            .subscribe(data => {
                this.primaryContact = data.contactInfo;
                this.vendor = data.vendorInfo;
                this.contactInfo = {
                    id: this.primaryContact.id,
                    firstName: this.primaryContact.first_name,
                    lastName: this.primaryContact.last_name,
                    title: this.primaryContact.title,
                    phone: this.primaryContact.phone,
                    phone_extension: this.primaryContact.phone_extension,
                    mobile: this.primaryContact.mobile,
                    photo: this.primaryContact.photo,
                    email: this.primaryContact.email,
                    companyName: this.vendor.company_name
                }

                let tempContact = this.vendor.vendor_contacts.filter(data => {
                    return !data.isprimary_contact;
                });

                this.vendor.vendor_contacts = tempContact;
            })
    }

    getPhotoUrl(contact) {
        return this.dataService.getPhotoUrl(contact.photo);
    }

    buildAddressHtml(contact) {
        return this.dataService.buildAddressHtml(contact, this.vendor.company_name);
    }

    updateInActivity(event) {
        this.getContactDetails(this.route.snapshot.params['id']);
    }
}