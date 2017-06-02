import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { EmployeeService } from './../admin/employee/employee.service';
import { TenantService } from './../admin/tenant/tenant.service';
import { TicketService } from './ticket.service';
import { AuthenticationService } from "app/modules/authentication";
import { UpdateTicketLaborService } from './ticket-labor.service';
import { UpdateTicketMaterialService } from './ticket-material.service';
import config from '../../config';

import * as moment from 'moment';

import {
    Storage
} from './../../services/index';

import {
    AppHttp
} from '../../services';
import { AbstractControl, FormGroup, Validators, FormControl } from "@angular/forms";
import { ToasterService } from "angular2-toaster/angular2-toaster";
import { BreadcrumbHeaderService } from "app/modules/shared/breadcrumb-header/breadcrumb-header.service";
import { Subscription } from "rxjs/Subscription";

declare var $: any;

export class TabVisibility {
    isActivityTabVisible = true;
    isLaborTabVisible = false;
    isMaterialTabVisible = false;
    isFilesTabVisible = false;
    selectedTabNo = 1;
}

@Component({
    selector: 'ewo-ticket-details',
    templateUrl: './ticket-details.component.html'
})
export class TicketDetailsComponent implements OnInit {
    overDue: string;
    selectedTenant: any;
    selectedRequestor: any = [];
    requestorsList: any[] = [];
    dueDateOn: number;
    dueDateValid: boolean = true;

    ticket: any;
    ticket_submitter_info: any;
    notes: any[] = [];
    labors: any[];
    materials: any[];
    files: any[];
    tenant_contacts: any[] = [];
    // tenants: any[] = [];
    employees: any[];

    currentCompanyId = 1;

    tabs = new TabVisibility();
    ticketId: any;
    isClosedTicket = false;

    isRequestorValid: boolean = true;

    userInfo: any;

    subscription: Subscription;

    dueDateForm = new FormGroup({
        dueDate: new FormControl('', Validators.required)
    });

    requestorForm = new FormGroup({
        requestor: new FormControl('', Validators.required)
    });

    constructor(
        protected http: AppHttp,
        private employeeService: EmployeeService,
        private tenantService: TenantService,
        private ticketService: TicketService,
        private authService: AuthenticationService,
        private route: ActivatedRoute,
        private updateTicketLaborService: UpdateTicketLaborService,
        private updateTicketMaterialService: UpdateTicketMaterialService,
        private toasterService: ToasterService,
        private breadcrumbHeaderService: BreadcrumbHeaderService,
        private storage: Storage,
        private router: Router
    ) {
        this.authService.verifyToken().take(1).subscribe(data => {
            this.userInfo = this.storage.getUserInfo();
            if (!this.userInfo.IsPropertyManager && !this.userInfo.IsEmployee) {
                this.isClosedTicket = true; // Non admin will get view only
            }
            // this.getAllActiveEmployees();
            // this.ticketService.ticketRefresh$.subscribe(status => {
            //     this.getTicketDetails();
            // });

            // this.route.params.subscribe((params: any) => {
            //     // this.ticketId = params['id'];
            //     this.ticketId = +params.id;
            //     this.setTicketDetails();
            // })
            this.initializeTicketDetails();
        });
    }

    ngOnInit () {
        // this.ticketId = this.route.snapshot.params['id'];

        // this.route.params.subscribe((params: any) => {
        //     // this.ticketId = params['id'];
        //     this.ticketId = +params.id;
        //     this.setTicketDetails();
        // })
        //  this.ticketService.prevTicket$.subscribe(id => {
        //     this.getTicketDetails(id);
        // });
        // this.ticketService.nextTicket$.subscribe(id => {
        //     this.getTicketDetails(id);
        // });

        // Moved to funcion april 21
        // this.getAllNotes(this.ticketId);
        // this.getAllLabors(this.ticketId);
        // this.getAllMaterials(this.ticketId);
        // this.getAllDocuments(this.ticketId);
        // this.getTicketDetails();
        // this.switchTab(1);
        // this.breadcrumbHeaderService.setBreadcrumbTitle('Ticket Details');


        // this.queryParams.subscribe(data => {
        //     let _data = data;
        //     console.log(data);
        // })
        // let data = this.router.events.subscribe(data => {
        //     let _data = data;
        // });

    }

    ngOnDestroy () {
        this.subscription && this.subscription.unsubscribe();
    }

    ngAfterViewChecked () {
        $(function () {
            $('[data-toggle="tooltip"]').tooltip()
        })
    }

    // April21-2017
    ngOnChanges (changes) {
        if (changes['ticket']) {
            if (changes['ticket'].currentValue) {
                this.ticket = changes['ticket'].currentValue;
                this.initializeTicketDetails();
            } else {
                this.ticket = [];
            }
        }
    }
    initializeTicketDetails () {
        this.breadcrumbHeaderService.setBreadcrumbTitle('');
        this.getAllActiveEmployees();
        this.subscription = this.ticketService.ticketRefresh$.subscribe(status => {
            this.getTicketDetails();
        });

        this.route.params.subscribe((params: any) => {
            // this.ticketId = params['id'];
            this.ticketId = +params.id;
            this.setTicketDetails();
        })
    }

    setTicketDetails () {
        this.getAllNotes(this.ticketId);
        this.getAllLabors(this.ticketId);
        this.getAllMaterials(this.ticketId);
        this.getAllFiles(this.ticketId);
        this.getTicketDetails();
        this.switchTab(1);
        // this.breadcrumbHeaderService.setBreadcrumbTitle('Ticket Details');
    }
    getTicketDetails () {
        this.ticketService.getTicketDetails(this.ticketId).subscribe(
            data => {
                this.isClosedTicket = false;//may26-2017
                this.ticket = data;
                if (this.ticket.status === 'Closed') {
                    this.isClosedTicket = true;
                }
                // Set Ticket title
                this.breadcrumbHeaderService.setBreadcrumbTitle(this.ticket.ticket_key);

                this.tenantService.getTenant(this.ticket.tenant).subscribe(
                    data => {
                        let _tenant_contact: any[] = data.tenant_contacts.map(item => {
                            return { id: item.id, text: (item.first_name + ' ' + item.last_name) };
                        });
                        this.tenant_contacts = _tenant_contact;
                    }
                );
                this.ticketService.getTicketSubmitterInfo(this.ticket.id).subscribe(
                    data => {
                        this.ticket_submitter_info = data;
                    });
                // this.tenant = this.tenantService.getTenant(this.ticket.tenant);
                // let _building_id = this.ticket.building.extractIdFromURL();
                // this.getActiveTenantsByBuilding(_building_id);
                this.dueDateCalcutate();
                this.getSelectedTenants();
                this.ticketService.setShowLoadingIcon(false);
            },
            error => {
                this.ticketService.setShowLoadingIcon(false);
            }
        );
    }

    getAllNotes (ticketId) {
        this.ticketService.getAllNotes(ticketId).subscribe(
            data => {
                this.notes = data;
            });
    }

    getAllLabors (ticketId) {
        const observable = this.http.get('ticketlabor/?workorder_id=' + ticketId);
        observable.subscribe(data => {
            this.labors = data.results;
        });
    }

    getAllMaterials (ticketId) {
        const observable = this.http.get('ticketmaterial/?workorder_id=' + ticketId);
        observable.subscribe(data => {
            this.materials = data.results;
        });
    }

    getAllFiles (ticketId) {
        const observable = this.http.get('ticketdocument/?workorder_id=' + ticketId);
        observable.subscribe(data => {
            this.files = data.results;
        });
    }

    switchTab (tabId: number) {
        this.tabs.isActivityTabVisible = tabId === 1 ? true : false;
        this.tabs.isLaborTabVisible = tabId === 2 ? true : false;
        this.tabs.isMaterialTabVisible = tabId === 3 ? true : false;
        this.tabs.isFilesTabVisible = tabId === 4 ? true : false;
        this.tabs.selectedTabNo = tabId;
    }

    onSubmit () {
    }

    getAllActiveEmployees (): void {
        this.employeeService.getAllActiveEmployees(this.currentCompanyId).subscribe(
            data => {
                let _employee: any[] = data.results.map(item => {
                    return { id: item.id, text: (item.first_name + ' ' + item.last_name) };
                })
                //  _employee.splice(0, 0, { id: -1, text: 'Pleae select' });
                this.employees = _employee;
            }
        );
    }

    /*getActiveTenantsByBuilding(building_id): void {
        this.tenantService.getActiveTenantsByBuilding(building_id).subscribe(
            data => {
                let _tenant: any[] = data.results.map(item => {
                    return { id: item.id, text: (item.unitno + ' ' + item.tenant_company_name) };
                })
                this.tenants = _tenant;
            }
        );
    }*/

    updateNotes (data) {
        this.ticketId && this.getAllNotes(this.ticketId);
    }

    updateLaborInfo (data) {
        this.ticketId && this.getAllLabors(this.ticketId);
    }

    updateMaterialInfo (data) {
        this.ticketId && this.getAllMaterials(this.ticketId);
    }

    updateFileInfo (data) {
        this.ticketId && this.getAllFiles(this.ticketId);
    }

    onDueDateEdit (event) {
        if (this.ticket) {
            this.dueDateForm.get('dueDate').setValue(this.ticket.due_date.toDate());
        }
    }
    onDueDateSubmit () {
        this.dueDateValid = false;

        if (this.dateValidation(this.dueDateForm.get('dueDate'))) {
            this.dueDateValid = true;
        } else {
            this.dueDateValid = false;
            return;
        }

        if (!this.dueDateForm.valid) return;

        const _due_date = this.dueDateForm.get('dueDate').value;

        // Added Offset Time
        this.ticket.due_date = moment(_due_date).add({ hours: 23, minutes: 59, seconds: 59 });

        if (this.ticket.assigned_to)
            delete this.ticket.assigned_to;

        this.ticketService.update(this.ticket, false).subscribe(() => {
            this.dueDateCalcutate();
            this.toasterService.pop('success', 'Due Date', `Due date has been Updated`);
            $('#modal-due-date').modal('hide');
        },
            error => {
                this.toasterService.pop('error', 'Due Date', `Due date not Updated`);
            })
    }

    dateValidation (control: AbstractControl): boolean {
        return control.value !== null && control.value !== undefined && control.value !== '' ? true : false;
    }
    onSelectDueDate (value) {
        this.dueDateValid = true;
    }

    dueDateCalcutate () {
        const now = moment();
        const exp = moment(this.ticket.due_date);

        const days = exp.diff(now, 'days');
        const hours = exp.subtract(days, 'days').diff(now, 'hours');
        const minutes = exp.subtract(hours, 'hours').diff(now, 'minutes');

        const isOverDue = days < 0 || hours < 0 || minutes < 0;

        this.overDue = isOverDue ? 'Overdue ' : 'Due in ';
        this.overDue += days != 0 ? (Math.abs(days) == 1 ? `${Math.abs(days)} Day` : `${Math.abs(days)} Days`) : '';
        this.overDue += hours != 0 ? (Math.abs(hours) == 1 ? (days != 0 ? ',' : '') + ` ${Math.abs(hours)} Hour` : (days != 0 ? ',' : '') + ` ${Math.abs(hours)} Hours`) : '';
        this.overDue += minutes != 0 ? (Math.abs(minutes) == 1 ? (hours != 0 ? ',' : '') + ` ${Math.abs(minutes)} Minute` : (hours != 0 ? ',' : '') + ` ${Math.abs(minutes)} Minutes`) : '';
    }

    onRequestorSubmit () {
        this.isRequestorValid = true;
        // const user = this.storage.getUserInfo();
        if (this.selectedRequestor.length == 0) {
            this.isRequestorValid = false;
            return;
        }
        if (!this.requestorForm.valid) return;

        this.ticket.tenant = this.requestorForm.get('requestor').value;
        if (this.ticket.assigned_to)
            delete this.ticket.assigned_to;

        this.ticketService.update(this.ticket, false).subscribe(() => {
            this.getSelectedTenants();
            this.toasterService.pop('success', 'Requestor change', `Requestor has been Updated`);
            $('#modal-requestor').modal('hide');
        },
            error => {
                this.toasterService.pop('error', 'Requestor change', `Requestor not Updated`);
            })

    }

    onSelectedRequestor (value: any): void {
        this.isRequestorValid = true;
        this.selectedRequestor = [value];
        this.requestorForm.get('requestor').setValue(config.api.base + 'tenant/' + this.selectedRequestor[0].id + '/');
    }
    onRequestorModalOpen () {
        if (this.ticket) {
            this.getActiveTenantsByBuilding(this.ticket.building.extractIdFromURL())
        }
    }

    getActiveTenantsByBuilding (building_id): void {
        this.tenantService.getActiveTenantsByBuilding(building_id).subscribe(
            data => {
                let _tenant: any[] = data.results.map(item => {
                    return { id: item.id, text: (item.unitno + ' ' + item.tenant_company_name) };
                })
                this.requestorsList = _tenant;
            }
        );
    }

    getSelectedTenants () {
        if (this.ticket) {
            this.tenantService.getTenant(this.ticket.tenant).subscribe(tenant => {
                this.selectedTenant = tenant;

                this.selectedRequestor = [{ id: this.selectedTenant.id, text: (this.selectedTenant.unitno + ' ' + this.selectedTenant.tenant_company_name) }]
            })
        }
    }
}
