import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TenantService } from './../../admin/tenant/tenant.service';
import { DataService } from './../../../services/data.service';
import { Contact } from "app/modules/admin/contact-profile-card/contact";
import { BreadcrumbHeaderService } from "app/modules/shared/breadcrumb-header/breadcrumb-header.service";


@Component({
    selector: 'ewo-tenant-profile',
    templateUrl: './tenant-profile.component.html',
})
export class TenantProfileComponent implements OnInit {
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

    ngOnInit() {
        this.breadcrumbHeaderService.setBreadcrumbTitle('Tenant Profile');
        const contactId = this.route.snapshot.params['id'];
        this.getContactDetails(contactId);
    }

    getContactDetails(contactId) {
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
                    unitNo: this.tenant.unitno,
                    extension: this.tenant.extension
                }

                let tempContact = this.tenant.tenant_contacts.filter(data => {
                    return data.active;
                 });

                this.tenant.contacts = tempContact;
                this.getInsurances(this.tenant.id);
            })
    }

    getPhotoUrl(contact) {
        return this.dataService.getPhotoUrl(contact.photo);
    }

    buildAddressHtml(contact) {
        return this.dataService.buildAddressHtml(contact, this.tenant.tenant_company_name);
    }

    updateInActivity(event) {
        this.getContactDetails(this.route.snapshot.params['id']);
    }

    /**
     * Get Insurance list by tenant
     */
    getInsurances(tenant_id){
        this.tenantService.getInsurances(tenant_id).subscribe(
            data => {
                this.insurances = data.results;
            }
        );
    }
}