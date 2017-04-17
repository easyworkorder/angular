import { Component, OnInit } from '@angular/core';
import { DataService, Storage, AppHttp } from 'app/services';
import { AuthenticationService } from 'app/modules/authentication';
import { TicketService } from './../ticket/ticket.service';

@Component({
    selector: 'ewo-user-dashboard',
    templateUrl: './user-dashboard.component.html'
})
export class UserDashboardComponent implements OnInit {

    tenantContactId: any;
    contactStat: any;
    quickStat: any;
    userInfo: any;
    IsEmployee: any;
    IsPropertyManager: any;
    vendorContactId: any;

    tickets: any;
    currentRequestType = 'new';
    currentCompanyId= 1;

    constructor(
        private authService: AuthenticationService,
        private dataService: DataService,
        private storage: Storage,
        private ticketService: TicketService,
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


            } else if (this.userInfo && this.userInfo.IsEmployee) {
                /**
                 * Get All ticket list for employees
                 */
                this.getAllTickets(this.currentRequestType);
                this.IsEmployee = true;

            } else if (this.userInfo && this.userInfo.IsPropertyManager) {
                /**
                 * Get All ticket list for property manager
                 */
                this.getAllTickets(this.currentRequestType);
                this.IsPropertyManager = true;

            } else if (this.userInfo && this.userInfo.IsVendor) {
                this.vendorContactId = this.userInfo.vendor_contact_id;

            } else {
                /**
                 * Get All ticket list for admin
                 */
                this.getAllTickets(this.currentRequestType);
                this.IsPropertyManager = true;
            }

            this.getWorkOrderStatistics();
            this.getWorkOrderQuickStats();

            this.ticketService.tickettListRefresh$.subscribe(status => {
                this.getAllTickets(this.currentRequestType);
            });

        });
    }

    ngOnInit() {

    }

    getAllTickets (type): void {
        this.ticketService.getAllTickets(this.currentCompanyId, type).subscribe(
            data => {
                this.tickets = data;
            }
        );
    }

    updateTicketList(type) {

        this.currentRequestType = type;

        switch (type) {
            case 'new':
                this.getAllTickets('new');
                break;
            case 'replies':
                this.getAllTickets('replies');
                break;
            case 'due_today':
                this.getAllTickets('due_today');
                break;
            case 'overdue':
                this.getAllTickets('overdue');
                break;
            case 'pending':
                this.getAllTickets('pending');
                break;
            case 'closed':
                this.getAllTickets('closed');
                break;
        }
    }

    getWorkOrderStatistics() {
        const observable = this.http.get('workorderstatistics/' + this.currentCompanyId + '/');
        observable.subscribe(data => {
            // console.log(data);
            this.contactStat = data;
        });
        return observable;
    }

    getWorkOrderQuickStats() {
        const observable = this.http.get('workorderquickstats/' + this.currentCompanyId + '/');
        observable.subscribe(data => {
            // console.log(data);
            this.quickStat = data;
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
