import {ActivatedRoute} from '@angular/router';
import { Component, OnInit } from '@angular/core';
// import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TenantService } from './tenant.service';
import { DataService } from './../../../services/data.service';
import { TenantComponent } from './tenant.component';
// import { BuildingService } from './../building/building.service';
// import { ValidationService } from './../../services/validation.service';

// export class TabVisibility {
//   isBasicTabVisible = true;
//   isContactTabVisible = false;
//   selectedTabNo = 1;
// }

@Component({
  selector: 'ewo-tenant-contact-profile',
  templateUrl: './tenant-contact.component.html',
})
export class TenantContactComponent implements OnInit {
    constructor(
        private tenantService: TenantService,
        private dataService: DataService,
        private route:ActivatedRoute
        )
    {
        // this.getContactDetails(this.route.snapshot.params['id']);
    }

    tenant: any;
    primaryContact: any;
    test_id: string;

    getContactDetails(contactId) {
        this.tenantService.getContactDetails(contactId).subscribe(
            data => {
                this.primaryContact = data;
                if(this.primaryContact) {
                    this.tenantService.getTenant(this.primaryContact.tenant).subscribe(
                        data => {
                            this.tenant = data;
                        }
                    );
                }
            }
        );
    }

    ngOnInit() {
        // this.getContactDetails(this.route.snapshot.params['id']);
        var contactId = this.route.snapshot.params['id'];
        this.getContactDetails(contactId);
        this.test_id = contactId;
    }

    getPhotoUrl(contact) {
        return this.dataService.getPhotoUrl(contact);
    }
    buildAddressHtml(contact) {
        contact.tenant_company_name = this.tenant.tenant_company_name;
        return this.dataService.buildAddressHtml(contact);
    }
}