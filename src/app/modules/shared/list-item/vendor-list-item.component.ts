import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { DataService } from "app/services";
import { Router } from "@angular/router";

@Component({
    selector: 'ewo-vendor-list-item',
    templateUrl: './vendor-list-item.component.html'
})
export class VendorListItemComponent implements OnInit {

    constructor(
        // private http: ApdpHttp,
        private dataService: DataService,
        private router: Router
    ) { }
    /// A List of Contact objects to display
    @Input() vendor: any[];
    @Input() isAdmin:boolean = false;
    //@Input() isEditable: boolean = true;
    //@Output('update') change: EventEmitter<any> = new EventEmitter<any>();

    ngOnInit() {

    }

    buildName(firstName: string, lastName: string) {
        return this.dataService.buildName(firstName, lastName);
    }

    buildAddressHtml(vendor: any) {
        return this.dataService.buildVendorAddressHtml(vendor, vendor.company_name);
    }

    getPhotoUrl(vendor) {
        if (vendor.photo != null && vendor.photo.length > 0)
            return vendor.photo;
        return 'assets/img/placeholders/avatars/avatar9.jpg';
    }

    stopPropagation(event) {
        event.stopPropagation()
    }

    vendorDetailsLink(vendor) {
        if(this.isAdmin){
            this.router.navigate(['/admin', 'vendor-profile', vendor.contact_id]);
        }
        else {
            this.router.navigate(['/vendor-profile', vendor.contact_id]);
        }
    }
}
