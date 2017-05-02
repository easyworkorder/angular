import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { DataService } from "app/services";
import { Router } from "@angular/router";
import { TenantService } from "app/modules/admin/tenant/tenant.service";
declare var $: any;

@Component({
    selector: 'ewo-tenant-list-item',
    templateUrl: './tenant-list-item.component.html'
})
export class TenantListItemComponent implements OnInit {
    constructor(
        // private http: ApdpHttp,
        private dataService: DataService,
        private router: Router,
    ) { }
    /// A List of Contact objects to display
    @Input() tenant: any[];
    @Input() isAdmin: boolean = false;
    @Output('delete') delete: EventEmitter<any> = new EventEmitter<any>();

    ngOnInit () {

    }

    ngAfterViewChecked () {
        $(function () {
            $('[data-toggle="tooltip"]').tooltip()
        })
    }

    buildName (firstName: string, lastName: string) {
        return this.dataService.buildName(firstName, lastName);
    }

    buildAddressHtml (tenant: any) {
        return this.dataService.buildAddressHtml(tenant, tenant.tenant_company_name);
    }

    getPhotoUrl (tenant) {
        if (tenant.photo != null && tenant.photo.length > 0)
            return tenant.photo;
        return 'assets/img/placeholders/avatars/avatar9.jpg';
    }

    stopPropagation (event) {
        event.stopPropagation()
    }

    tenantDetailsLink (tenant) {
        if (this.isAdmin) {
            // this.router.navigate(['admin', 'building-details', tenant.building_id, 'tenant-profile', tenant.contact_id]);
            this.router.navigate(['admin', 'building', tenant.building_id, 'tenant-profile', tenant.contact_id]);
        }
        else {
            // this.router.navigate(['/tenant-profile', tenant.contact_id]);
            this.router.navigate(['/tenant', tenant.contact_id]);
        }
    }

    deleteTenant (event, tenant) {
        event.stopPropagation();
        this.delete.emit(tenant);
    }
}
