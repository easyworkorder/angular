import { Component, OnInit, Input } from '@angular/core';
import { DataService, AppHttp } from "app/services";

@Component({
    selector: 'ewo-contact-list',
    templateUrl: './contact-list.component.html',
    styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {

    constructor(
        // private http: ApdpHttp,
        private dataService: DataService
    ) { }
    /// A List of TenantContact objects to display
    @Input() tenant: any[];
    @Input() isEditable: boolean = true;
    ngOnInit() {

    }

    getPhotoUrl(contact: any){
        var photo = this.dataService.getPhotoUrl(contact.photo);
        return photo;
    }

    stopPropagation(event) {
        event.stopPropagation()
    }
}
