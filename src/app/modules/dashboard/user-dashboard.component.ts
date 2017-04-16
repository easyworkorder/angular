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
            console.log(this.userInfo);
            if (this.userInfo && this.userInfo.IsContact) {
                this.tenantContactId = this.userInfo.tenant_contact_id;
                /*this.getTenantById(this.userInfo.tenant_id).subscribe(data => {
                 this.tenant = data;
                 });*/
                this.getWorkOrderStatistics('tenant');
            } else if (this.userInfo && this.userInfo.IsEmployee) {
                this.getWorkOrderStatistics('employee');
                this.IsEmployee = true;
            } else if (this.userInfo && this.userInfo.IsPropertyManager) {
                this.getWorkOrderStatistics('employee');
                this.IsPropertyManager = true;
            } else if (this.userInfo && this.userInfo.IsVendor) {
                this.getWorkOrderStatistics('vendor');
                this.vendorContactId = this.userInfo.vendor_contact_id;
            } else {
                this.getWorkOrderStatistics('employee');
                this.IsPropertyManager = true;
            }

        });
    }

    ngOnInit() {

    }

    updateTicketList(type){

    }

    getWorkOrderStatistics(user_type) {
        const observable = this.http.get('workorderstatistics/?user_type=' + user_type);
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
