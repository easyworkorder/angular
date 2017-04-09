import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { DataService, AppHttp } from "app/services";

@Component({
    selector: 'ewo-contact-list',
    templateUrl: './contact-list.component.html'
})
export class ContactListComponent implements OnInit {

    constructor(
        // private http: ApdpHttp,
        private dataService: DataService
    ) { }
    /// A List of Contact objects to display
    @Input() contactList: any[];
    @Input() isEditable: boolean = true;
    @Output('update') change: EventEmitter<any> = new EventEmitter<any>();

    ngOnInit() {

    }

    getPhotoUrl(contact: any) {
        var photo = this.dataService.getPhotoUrl(contact.photo);
        return photo;
    }

    stopPropagation(event) {
        event.stopPropagation()
    }

    updateContact(data) {
        this.change.emit(data);
    }
}
