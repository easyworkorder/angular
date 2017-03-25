import { Component, OnInit } from '@angular/core';
import { DataService, Storage, AppHttp } from "app/services";

@Component({
    selector: 'ewo-user-dashboard',
    templateUrl: './user-dashboard.component.html',
    styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {

    constructor(
        private dataService: DataService,
        private storage: Storage,
        private http: AppHttp
    ) { }
    tenant: any;

    ngOnInit() {
        var user = this.storage.getUserInfo();
        if(user.IsContact) {
            this.tenant = this.getTenantById(user.tenant_id);
        }
    }

    getTenantById(tenantId) {
        // const observable = this.http.get('tenant/?building=' + building_id); //can call this or
        const observable = this.http.get('tenant/' + tenantId + '/');
        observable.subscribe(data => {
            console.log(data);
        });
        return observable;
    }
}
