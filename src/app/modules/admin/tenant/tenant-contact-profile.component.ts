import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TenantService } from './tenant.service';
import { DataService } from './../../../services/data.service';
import { Contact } from "app/modules/admin/contact-profile-card/contact";
import { BreadcrumbHeaderService } from "app/modules/shared/breadcrumb-header/breadcrumb-header.service";


@Component({
    selector: 'ewo-tenant-contact-profile',
    templateUrl: './tenant-contact-profile.component.html',
})
export class TenantContactProfileComponent implements OnInit {
    tenant: any;
    primaryContact: any;
    contactInfo: Contact;

    constructor(
        private tenantService: TenantService,
        private dataService: DataService,
        private route: ActivatedRoute,
        private breadcrumbHeaderService: BreadcrumbHeaderService
    ) {
    }

    ngOnInit() {
        this.breadcrumbHeaderService.setBreadcrumbTitle('Tenant Profile');
        const contactId = this.route.snapshot.params['id'];
        this.getContactDetails(contactId);
    }

    getContactDetails(contactId) {
        // this.tenantService.getContactDetails(contactId).subscribe(
        //     data => {
        //         this.primaryContact = data;
        //         if (this.primaryContact) {
        //             this.tenantService.getTenant(this.primaryContact.tenant).subscribe(
        //                 data => {
        //                     this.tenant = data;
        //                 }
        //             );
        //         }
        //     }
        // );

        this.tenantService.getContactDetails(contactId)
            .mergeMap(conact => this.tenantService.getTenant(conact.tenant), (contactInfo, tenantInfo) => ({ contactInfo, tenantInfo }))
            .subscribe(data => {
                this.primaryContact = data.contactInfo;
                this.tenant = data.tenantInfo;
                this.contactInfo = {
                    id: this.primaryContact.id,
                    firstName: this.primaryContact.first_name,
                    lastName: this.primaryContact.last_name,
                    title: this.primaryContact.title,
                    phone: this.primaryContact.phone,
                    mobile: this.primaryContact.mobile,
                    photo: this.primaryContact.photo,
                    email: this.primaryContact.email,
                    companyName: this.tenant.tenant_company_name,
                    unitNo: this.tenant.unitno
                }
            })
    }

    getPhotoUrl(contact) {
        return this.dataService.getPhotoUrl(contact);
    }

    buildAddressHtml(contact) {
        contact.tenant_company_name = this.tenant.tenant_company_name;
        return this.dataService.buildAddressHtml(contact);
    }
}