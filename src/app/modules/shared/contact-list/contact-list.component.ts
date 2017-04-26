import { Component, OnInit, Input, EventEmitter, Output, AfterViewInit } from '@angular/core';
import { DataService, AppHttp } from "app/services";
declare var $: any;

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
    @Output('delete') deleteChange: EventEmitter<any> = new EventEmitter<any>();
    @Output('sendPassword') sendNewPassword: EventEmitter<any> = new EventEmitter<any>();

    ngOnInit () {
    }
    ngAfterViewInit () {
        $(function () {
            $('[data-toggle="tooltip"]').tooltip()
        })
    }

    getPhotoUrl (contact: any) {
        var photo = this.dataService.getPhotoUrl(contact.photo);
        return photo;
    }

    stopPropagation (event) {
        event.stopPropagation()
    }

    updateContact (data) {
        this.change.emit(data);
    }
    deleteContact (data) {
        this.deleteChange.emit(data);
    }

    sendPassword (data) {
        this.sendNewPassword.emit(data);
    }
}
