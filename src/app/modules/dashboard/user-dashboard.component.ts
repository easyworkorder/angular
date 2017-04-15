import { Component, OnInit } from '@angular/core';
import { DataService, Storage, AppHttp } from "app/services";
import { AuthenticationService } from "app/modules/authentication";

@Component({
    selector: 'ewo-user-dashboard',
    templateUrl: './user-dashboard.component.html'
})
export class UserDashboardComponent implements OnInit {

    tenantContactId: any;
    contactStat: any;
    userInfo: any;
    IsEmployee: any;
    IsPropertyManager: any;
    vendorContactId: any;

    constructor(
        private authService: AuthenticationService,
        private dataService: DataService,
        private storage: Storage,
        private http: AppHttp
    ) {
        this.authService.verifyToken().take(1).subscribe(data => {
            this.userInfo = this.storage.getUserInfo();
            if (this.userInfo && this.userInfo.IsContact) {
                this.tenantContactId = this.userInfo.tenant_contact_id;
                /*this.getTenantById(this.userInfo.tenant_id).subscribe(data => {
                 this.tenant = data;
                 });*/
                this.getWorkOrderStatistics(this.userInfo.tenant_id);
            } else if (this.userInfo && this.userInfo.IsEmployee) {
                this.IsEmployee = true;
            } else if (this.userInfo && this.userInfo.IsPropertyManager) {
                this.IsPropertyManager = true;
            } else if (this.userInfo && this.userInfo.IsVendor) {
                this.vendorContactId = this.userInfo.vendor_contact_id;
            } else {
                this.IsPropertyManager = true;
            }

        });
    }

    ngOnInit() {

    }

    getWorkOrderStatistics(tenantId) {
        const observable = this.http.get('workorderstatistics/');
        observable.subscribe(data => {
            // console.log(data);
            this.contactStat = data;
        });
        return observable;
    }

    /*getTenantById(tenantId) {
        const observable = this.http.get('tenant/' + tenantId + '/');
        observable.subscribe(data => {
            // console.log(data);
        });
        return observable;
    }*/
}
