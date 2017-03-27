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
    contactStat: any;
    userInfo: any;

    ngOnInit() {
        this.userInfo = this.storage.getUserInfo();
        if (this.userInfo && this.userInfo.IsContact) {
            this.getTenantById(this.userInfo.tenant_id).subscribe(data => {
                this.tenant = data;
            });
            this.getWorkOrderStatistics(this.userInfo.tenant_id);
        }
    }

    getWorkOrderStatistics(tenantId) {
        const observable = this.http.get('workorderstatistics/');
        observable.subscribe(data => {
            console.log(data);
            this.contactStat = data;
        });
        return observable;
    }

    getTenantById(tenantId) {
        const observable = this.http.get('tenant/' + tenantId + '/');
        observable.subscribe(data => {
            console.log(data);
        });
        return observable;
    }
}
