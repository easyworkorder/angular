import { Component, OnInit } from '@angular/core';
import { Storage } from "app/services";

@Component({
    selector: 'app-left-menu',
    templateUrl: './left-menu.component.html',
    styleUrls: ['./left-menu.component.css']
})
export class LeftMenuComponent implements OnInit {

    constructor(private storage: Storage) { }
    userInfo: any;
    contactStat: any;
    
    ngOnInit() {
        this.userInfo = this.storage.getUserInfo();
        // FIXME: Call an api and get these statistics for contact
        if(this.userInfo.IsContact){
            this.contactStat = {
                new: 10,
                pending: 20,
                closed: 203,
                replies: 7
            };
        }
    }

}
