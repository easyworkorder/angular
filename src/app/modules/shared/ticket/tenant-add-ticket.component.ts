import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import config from '../../../config';
import {EmployeeService} from './../../admin/employee/employee.service';
import {BuildingService} from './../../admin/building/building.service';
import {TenantService} from './../../admin/tenant/tenant.service';
import {ProblemTypeService} from './../../admin/problem_type/problem_type.service';
import {TicketService} from './../../ticket/ticket.service';
import {AuthenticationService} from "app/modules/authentication";
declare var $: any;

@Component({
    selector: 'ewo-tenant-add-ticket',
    templateUrl: './tenant-add-ticket.component.html'
})
export class TenantAddTicketComponent implements OnInit {

    @Input() tenant: any;
    @Input() isAdmin: boolean = false;
    @Input() isDashboardList: boolean = false;
    @Output('update') change: EventEmitter<any> = new EventEmitter<any>();

    _submitted = false;
    // building: any[] = [];
    // tenant: any[] = [];
    selectedProblemType: any[] = [];
    selectedPriority: any[] = [];
    selectedAssignedTo: any[] = [];
    selectedGroup: any[] = [];
    selectedSource: any[] = [];
    selectedNotified: any[] = [];
    sendNotification = false;

    // tickets: any[] = [];
    // buildings: any[] = [];
    // tenants: any[] = [];
    problem_types: any[] = [];
    priorities = [{ id: 'Low', text: 'Low' },
                    { id: 'Medium', text: 'Medium' },
                    { id: 'High', text: 'High' },
                    { id: 'Urgent', text: 'Urgent' },
                    { id: 'Safety', text: 'Safety' }];
    employees: any[] = [];
    groups = [{ id: 'Property Manager', text: 'Property Manager' },
        { id: 'Engineering', text: 'Engineering' },
        { id: 'Security', text: 'Security' },
        { id: 'Janitorial', text: 'Janitorial' },
        { id: 'Safety', text: 'Safety' }];
    sources = [{ id: 'Email', text: 'Email' },
        { id: 'Portal', text: 'Portal' },
        { id: 'Phone', text: 'Phone' },
        { id: 'Chat', text: 'Chat' },
        { id: 'Agent', text: 'Agent' }];

    currentCompanyId = 1;

    ticketForm = new FormGroup({
        id: new FormControl(),
        building: new FormControl(''),
        tenant: new FormControl(''),
        problemtype: new FormControl(''),
        priority: new FormControl(''),
        assigned_to: new FormControl(''),
        source: new FormControl('Agent'),
        group: new FormControl(''),
        subject: new FormControl('', Validators.required),
        description: new FormControl('', Validators.required),
        is_private: new FormControl(false),
        estimated_amount: new FormControl(0),
        is_billable: new FormControl(false),
        is_safety_issue: new FormControl(false),
        notify_tenant: new FormControl(false),
        tenant_notify_flag: new FormControl(false),
        status: new FormControl('Unassigned'),
        closed: new FormControl(false),
        notified_list: new FormControl(''),
        optional_notification_message: new FormControl(''),
        is_save_as_note: new FormControl(false),
        notify_employee: new FormControl(false),
        is_deleted: new FormControl(false)
    });

    constructor(private buildingService: BuildingService,
                private employeeService: EmployeeService,
                private tenantService: TenantService,
                private problemTypeService: ProblemTypeService,
                private ticketService: TicketService,
                private authService: AuthenticationService) {
        this.authService.verifyToken().take(1).subscribe(data => {
            // this.getAllTickets();
            // this.getAllActiveBuildings();
            this.getAllActiveEmployees();
            this.getAllActiveProblemTypes();
        });
    }

    ngOnInit() {
        /**
         * Enable additional ticket fields when admin
         */
        if (this.isAdmin) {
            this.isDashboardList = this.isAdmin;
        }
    }

    onSubmit() {
        this._submitted = true;
        if (!this.ticketForm.valid) { return; }
        this.ticketForm.get('building').setValue(this.tenant.building);
        this.ticketForm.get('tenant').setValue(this.tenant.url);
        this.ticketService.create(this.ticketForm.value).subscribe((tikcet: any) => {
            // this.getAllTickets();
            this.change.emit(true);
            this.closeModal();
        });
    }

    /*getAllTickets(): void {
        this.ticketService.getAllTickets(this.currentCompanyId).subscribe(
            data => {
                this.tickets = data;
            }
        );
    }

    getAllActiveBuildings(): void {
        this.buildingService.getAllActiveBuildings(this.currentCompanyId).subscribe(
            data => {
                let _building: any[] = data.results.map(item => {
                    return { id: item.id, text: (item.name) };
                })
                this.buildings = _building;
            }
        );
    }*/

    getAllActiveEmployees(): void {
        this.employeeService.getAllActiveEmployees(this.currentCompanyId).subscribe(
            data => {
                let _employee: any[] = data.results.map(item => {
                    return { id: item.id, text: (item.first_name + ' ' + item.last_name) };
                })
                this.employees = _employee;
            }
        );
    }

    getAllActiveProblemTypes(): void {
        this.problemTypeService.getAllActiveProblemTypesForTenant(this.currentCompanyId).subscribe(
            data => {
                let _problem_type: any[] = data.results.map(item => {
                    return { id: item.id, text: (item.problem_name) };
                })
                this.problem_types = _problem_type;
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
    }

    public selectedBuilding(value: any): void {
        this.building = [value];
        this.getActiveTenantsByBuilding(this.building[0].id);
        this.ticketForm.get('building').setValue(config.api.base + 'building/' + this.building[0].id + '/');
    }

    public selectedTenant(value: any): void {
        this.tenant = [value];
        this.ticketForm.get('tenant').setValue(config.api.base + 'tenant/' + this.tenant[0].id + '/');
    }*/

    public setSelectedProblemType(value: any): void {
        this.selectedProblemType = [value];
        this.ticketForm.get('problemtype').setValue(config.api.base + 'problemType/' + this.selectedProblemType[0].id + '/');
    }

    public setSelectedPriority(value: any): void {
        this.selectedPriority = [value];
        this.ticketForm.get('priority').setValue(this.selectedPriority[0].id);
    }

    public setSelectedAssignedTo(value: any): void {
        this.selectedAssignedTo = [value];
        this.ticketForm.get('assigned_to').setValue(config.api.base + 'employee/' + this.selectedAssignedTo[0].id + '/');
    }

    public setSelectedGroup(value: any): void {
        this.selectedGroup = [value];
        this.ticketForm.get('group').setValue(this.selectedGroup[0].id);
    }

    public setSelectedSource(value: any): void {
        this.selectedSource = [value];
        this.ticketForm.get('source').setValue(this.selectedSource[0].id);
    }

    public emptyNoficationFields(value): void {
        if (!value.target.checked) {
            this.selectedNotified = [];
            this.ticketForm.get('notified_list').setValue('');
            this.ticketForm.get('optional_notification_message').setValue('');
            this.ticketForm.get('is_save_as_note').setValue(false);
        }
    }

    public selectedNotifiedList(value: any): void {

        if (this.selectedNotified.length >= 1 && value.id === -1) {
            this.removedNotifiedList(value);
            return;
        }
        if (this.selectedNotified.some(val => val.id === -1)) {
            this.removedNotifiedList({ id: -1, text: 'All' });
        }
        this.selectedNotified.push(value);
        this.setNotifiedList();
    }

    public removedNotifiedList(value: any): void {
        let sel = [];
        this.selectedNotified.forEach(item => {
            if (item.id !== value.id) {
                sel.push(item);
            }
        });
        this.selectedNotified = sel;
        this.setNotifiedList();
    }

    setNotifiedList() {
        let notifiedList = this.itemsToString(this.selectedNotified);
        notifiedList = notifiedList.split(',').join(',');
        this.ticketForm.get('notified_list').setValue(notifiedList);
    }

    public itemsToString(value: Array<any> = []): string {
        return value
            .map((item: any) => {
                return item.id;
            }).join(',');
    }

    closeModal() {
        this.resetForm();
        // this.building = [];
        // this.tenant = [];
        this.selectedProblemType = [];
        this.selectedPriority = [];
        this.selectedAssignedTo = [];
        this.selectedGroup = [];
        $('#modal-add-tenant-ticket').modal('hide');
    }

    resetForm() {
        this.ticketForm.reset({
            is_private: false,
            estimated_amount: 0,
            is_billable: false,
            is_safety_issue: false,
            notify_tenant: false,
            tenant_notify_flag: false,
            closed: false,
            is_save_as_note: false,
            notify_employee: false,
            is_deleted: false,
            status: 'Unassigned',
            source: 'Agent'
        });
    }
}
