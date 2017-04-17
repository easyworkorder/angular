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
    insurances: any;
    primaryContact: any;
    contactInfo: Contact;

    constructor(
        private tenantService: TenantService,
        private dataService: DataService,
        private route: ActivatedRoute,
        private breadcrumbHeaderService: BreadcrumbHeaderService
    ) {
    }

    ngOnInit () {
        this.breadcrumbHeaderService.setBreadcrumbTitle('Tenant Profile');
        const contactId = this.route.snapshot.params['id'];
        this.getContactDetails(contactId);
    }

    getContactDetails (contactId) {
        this.tenantService.getContactDetails(contactId)
            .mergeMap(conact => this.tenantService.getTenant(conact.tenant), (contactInfo, tenantInfo) => ({ contactInfo, tenantInfo }))
            .subscribe(data => {
                this.primaryContact = data.contactInfo;
                this.tenant = data.tenantInfo;
                this.contactInfo = {
                    id: this.primaryContact.id,
                    first_name: this.primaryContact.first_name,
                    last_name: this.primaryContact.last_name,
                    title: this.primaryContact.title,
                    phone: this.primaryContact.phone,
                    mobile: this.primaryContact.mobile,
                    fax: this.primaryContact.fax,
                    emergency_phone: this.primaryContact.emergency_phone,
                    photo: this.primaryContact.photo,
                    email: this.primaryContact.email,
                    companyName: this.tenant.tenant_company_name,
                    unit_no: this.tenant.unitno,
                    phone_extension: this.tenant.extension
                }

                /*let tempContact = this.tenant.tenant_contacts.filter(data => {
                    return !data.isprimary_contact;
                });*/

                this.tenant.contacts = this.tenant.tenant_contacts;
                this.getInsurances(this.tenant.id);
            })
    }

    getPhotoUrl (contact) {
        return this.dataService.getPhotoUrl(contact.photo);
    }

    // buildAddressHtml(contact) {
    //     return this.dataService.buildAddressHtml(contact, this.tenant.tenant_company_name);
    // }

    updateInActivity (event) {
        this.getContactDetails(this.route.snapshot.params['id']);
    }

    /**
     * Get Insurance list by vendor
     */
    getInsurances (tenant_id) {
        this.tenantService.getInsurances(tenant_id).subscribe(
            data => {
                this.insurances = data.results;
            }
        );
    }
}