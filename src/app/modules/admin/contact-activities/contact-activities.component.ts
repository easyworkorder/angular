import { Component, OnInit, Input } from '@angular/core';
import { DataService, Storage } from "app/services";

@Component({
    selector: 'ewo-contact-activities',
    templateUrl: './contact-activities.component.html',
    styleUrls: ['./contact-activities.component.css']
})
export class ContactActivitiesComponent implements OnInit {

    constructor(
        private dataService: DataService,
        private storage: Storage
    ) { }

    @Input() tenant: any;

    ngOnInit() {
        var user = this.storage.getUserInfo();
    }

}
