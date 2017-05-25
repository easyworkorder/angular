import { Component, OnInit } from '@angular/core';
import { DataService, Storage, AppHttp } from 'app/services';
import { AuthenticationService } from 'app/modules/authentication';
import { TicketService } from './../ticket/ticket.service';
import { BreadcrumbHeaderService } from "app/modules/shared/breadcrumb-header/breadcrumb-header.service";
import config from '../../config';
import { HeaderService } from "app/modules/shared/header/header.service";

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
    currentCompanyId = 1;

    constructor(
        private authService: AuthenticationService,
        private dataService: DataService,
        private storage: Storage,
        private ticketService: TicketService,
        private breadcrumbHeaderService: BreadcrumbHeaderService,
        private headerService: HeaderService,
        private http: AppHttp
    ) {
        this.authService.verifyToken().take(1).subscribe(data => {
            this.userInfo = this.storage.getUserInfo();


            if (this.userInfo && this.userInfo.IsContact) {
                this.tenantContactId = this.userInfo.tenant_contact_id;
                /*this.getTenantById(this.userInfo.tenant_id).subscribe(data => {
                 this.tenant = data;
                 });*/


            } else if (this.userInfo && this.userInfo.IsEmployee) {
                this.IsEmployee = true;

            } else if (this.userInfo && this.userInfo.IsPropertyManager) {
                this.IsPropertyManager = true;

            } else if (this.userInfo && this.userInfo.IsVendor) {
                this.vendorContactId = this.userInfo.vendor_contact_id;

            } else {
                this.IsPropertyManager = true;
            }

            this.getWorkOrderStatistics().subscribe(() => {
                let statFlag: string[] = ['new', 'replies', 'due_today', 'overdue', 'pending', 'closed'];
                if (this.userInfo && !(this.userInfo.IsEmployee || this.userInfo.IsPropertyManager)) {
                    statFlag.length = 0;
                    statFlag = ['new', 'replies', 'pending', 'closed'];
                }

                statFlag.some(val => {
                    if (+this.contactStat[val] > 0) {
                        this.currentRequestType = val;
                        return true;
                    }
                });
                //may26-2017
                const storeReqType = this.storage.get(config.storage.ticketRequestType);
                if (storeReqType) {
                    let tmpStat = this.contactStat[storeReqType];
                    if (tmpStat > 0) {
                        this.currentRequestType = storeReqType;
                    }
                }


                this.getAllTickets(this.currentRequestType);
            });

            this.getWorkOrderQuickStats();
            // this.getAllTickets(this.currentRequestType);

            this.ticketService.tickettListRefresh$.subscribe(status => {
                this.getWorkOrderStatistics();
                this.getWorkOrderQuickStats();
                this.getAllTickets(this.currentRequestType);
            });

        });
    }

    ngOnInit () {
        this.breadcrumbHeaderService.setBreadcrumbTitle('Desktop');
        this.headerService.setDashBoardTitle({ title: 'DESKTOP', link: ['/'] });

        //may26-2017
        const storeReqType = this.storage.get(config.storage.ticketRequestType);

        this.storage.set(config.storage.ticketRequestType, (storeReqType ? storeReqType : this.currentRequestType));
    }

    getAllTickets (type): void {
        this.ticketService.getAllTickets(this.currentCompanyId, type).subscribe(
            data => {
                this.tickets = data;
            }
        );
    }

    updateTicketList (type) {

        this.currentRequestType = type;

        //For Temp
        this.storage.set(config.storage.ticketRequestType, type);

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

    getWorkOrderStatistics () {
        const observable = this.http.get('workorderstatistics/' + this.currentCompanyId + '/');
        observable.subscribe(data => {
            // console.log(data);
            this.contactStat = data;
        });
        return observable;
    }

    getWorkOrderQuickStats () {
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
