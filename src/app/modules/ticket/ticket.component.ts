import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import config from '../../config';
import { EmployeeService } from './../admin/employee/employee.service';
import { BuildingService } from './../admin/building/building.service';
import { TenantService } from './../admin/tenant/tenant.service';
import { ProblemTypeService } from './../admin/problem_type/problem_type.service';
import { TicketService } from './ticket.service';
import { AuthenticationService } from "app/modules/authentication";
declare var $: any;

@Component({
    selector: 'ewo-ticket',
    templateUrl: './ticket.component.html'
})
export class TicketComponent implements OnInit {

    @Input() tickets: any[];
    @Input() currentRequestType: any;

    _submitted = false;
    building: any[] = [];
    tenant: any[] = [];
    problem_type: any[] = [];
    priority: any[] = [];
    assigned_to: any[] = [];
    group: any[] = [];
    selectSource: any[] = [];
    selectedNotified: any[] = [];
    sendNotification = false;


    buildings: any[] = [];
    tenants: any[] = [];
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
        source: new FormControl('', Validators.required),
        group: new FormControl('', Validators.required),
        subject: new FormControl('', Validators.required),
        description: new FormControl('', Validators.required),
        is_private: new FormControl(false),
        estimated_amount: new FormControl(0),
        is_billable: new FormControl(false),
        is_safety_issue: new FormControl(false),
        notify_tenant: new FormControl(false),
        tenant_notify_flag: new FormControl(false),
        status: new FormControl('Open'),
        closed: new FormControl(false),
        notified_list: new FormControl(''),
        optional_notification_message: new FormControl(''),
        is_save_as_note: new FormControl(false),
        notify_employee: new FormControl(false),
        is_deleted: new FormControl(false)
    });

    /**
     * If Save Notification as Note selected
     * @type {FormGroup}
     */
    ticketPrivateForm = new FormGroup({
        id: new FormControl(),
        url: new FormControl(''),
        workorder: new FormControl(''),
        details: new FormControl(''),
        employee_list: new FormControl(''),
        updated_by_type: new FormControl('E'),
        is_private: new FormControl(true),
        tenant_notified: new FormControl(false),
        tenant_follow_up: new FormControl(false),
        vendor_notified: new FormControl(false),
        vendor_follow_up: new FormControl(false),
        action_type: new FormControl('employee_message')
    });

    constructor(private buildingService: BuildingService,
        private employeeService: EmployeeService,
        private tenantService: TenantService,
        private problemTypeService: ProblemTypeService,
        private ticketService: TicketService,
        private authService: AuthenticationService) {
        this.authService.verifyToken().take(1).subscribe(data => {
            // this.getAllTickets('Unassigned');
            this.getAllActiveBuildings();
            this.getAllActiveEmployees();
            this.getAllActiveProblemTypes();
        });
    }

    ngOnInit () {
        // Default source selection
        this.selectSource = [{ id: 'Portal', text: 'Portal' }]
        this.ticketForm.get('source').setValue(this.selectSource[0].id);
    }

    ngAfterViewChecked () {
        $(function () {
            $('[data-toggle="tooltip"]').tooltip()
        })
    }
    onSubmit () {
        this._submitted = true;
        if (!this.ticketForm.valid) { return; }
        this.ticketService.create(this.ticketForm.value).subscribe((ticket: any) => {
            /*if (this.ticketForm.get('is_save_as_note').value) {
                this.ticketPrivateForm.get('workorder').setValue(config.api.base + 'ticket/' + ticket.id + '/');
                this.ticketPrivateForm.get('details').setValue(this.ticketForm.get('optional_notification_message').value);
                this.ticketService.createNote(this.ticketPrivateForm.value, true).subscribe((note: any) => {});
            }*/
            // this.getAllTickets('Unassigned');
            this.ticketService.updateTicketList(true);
            this.closeModal();
        });
    }

    getAllActiveBuildings (): void {
        this.buildingService.getAllActiveBuildings(this.currentCompanyId).subscribe(
            data => {
                let _building: any[] = data.results.map(item => {
                    return { id: item.id, text: (item.name) };
                })
                this.buildings = _building;
            }
        );
    }

    getAllActiveEmployees (): void {
        this.employeeService.getAllActiveEmployees(this.currentCompanyId).subscribe(
            data => {
                let _employee: any[] = data.results.map(item => {
                    return { id: item.id, text: (item.first_name + ' ' + item.last_name) };
                })
                this.employees = _employee;
            }
        );
    }

    getAllActiveProblemTypes (): void {
        this.problemTypeService.getAllActiveProblemTypes(this.currentCompanyId).subscribe(
            data => {
                let _problem_type: any[] = data.results.map(item => {
                    return { id: item.id, text: (item.problem_name) };
                })
                this.problem_types = _problem_type;
            }
        );
    }

    getActiveTenantsByBuilding (building_id): void {
        this.tenantService.getActiveTenantsByBuilding(building_id).subscribe(
            data => {
                let _tenant: any[] = data.results.map(item => {
                    return { id: item.id, text: (item.unitno + ' ' + item.tenant_company_name) };
                })
                this.tenants = _tenant;
            }
        );
    }

    public selectedBuilding (value: any): void {
        this.building = [value];
        this.getActiveTenantsByBuilding(this.building[0].id);
        this.ticketForm.get('building').setValue(config.api.base + 'building/' + this.building[0].id + '/');
    }

    public selectedTenant (value: any): void {
        this.tenant = [value];
        this.ticketForm.get('tenant').setValue(config.api.base + 'tenant/' + this.tenant[0].id + '/');
    }

    public selectedProblemType (value: any): void {
        this.problem_type = [value];
        this.ticketForm.get('problemtype').setValue(config.api.base + 'problemType/' + this.problem_type[0].id + '/');
    }

    public selectedPriority (value: any): void {
        this.priority = [value];
        this.ticketForm.get('priority').setValue(this.priority[0].id);
    }

    public selectedAssignedTo (value: any): void {
        this.assigned_to = [value];
        this.ticketForm.get('assigned_to').setValue(config.api.base + 'employee/' + this.assigned_to[0].id + '/');
    }

    public selectedGroup (value: any): void {
        this.group = [value];
        this.ticketForm.get('group').setValue(this.group[0].id);
    }

    public selectedSource (value: any): void {
        this.selectSource = [value];
        this.ticketForm.get('source').setValue(this.selectSource[0].id);
    }

    public emptyNoficationFields (value): void {
        if (!value.target.checked) {
            this.selectedNotified = [];
            this.ticketForm.get('notified_list').setValue('');
            this.ticketForm.get('optional_notification_message').setValue('');
            this.ticketForm.get('is_save_as_note').setValue(false);
        }
    }

    public selectedNotifiedList (value: any): void {

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

    public removedNotifiedList (value: any): void {
        let sel = [];
        this.selectedNotified.forEach(item => {
            if (item.id !== value.id) {
                sel.push(item);
            }
        });
        this.selectedNotified = sel;
        this.setNotifiedList();
    }

    setNotifiedList () {
        let notifiedList = this.itemsToString(this.selectedNotified);
        notifiedList = notifiedList.split(',').join(',');
        this.ticketForm.get('notified_list').setValue(notifiedList);
        this.ticketPrivateForm.get('employee_list').setValue(notifiedList);
    }

    public itemsToString (value: Array<any> = []): string {
        return value
            .map((item: any) => {
                return item.id;
            }).join(',');
    }

    closeModal () {
        this.resetForm();
        this.building = [];
        this.tenant = [];
        this.problem_type = [];
        this.priority = [];
        this.assigned_to = [];
        this.group = [];
        $('#modal-add-ticket').modal('hide');
    }

    resetForm () {

        this.ticketForm.reset({
            is_private: false,
            estimated_amount: 0,
            is_billable: false,
            is_safety_issue: false,
            notified_list: '',
            tenant_notify_flag: true,
            closed: false,
            is_save_as_note: false,
            notify_employee: false,
            notify_tenant: false,
            is_deleted: false,
            status: 'Open'
        });

        this.ticketPrivateForm.reset({
            employee_list: '',
            is_private: true,
            tenant_notified: false,
            tenant_follow_up: false,
            vendor_notified: false,
            vendor_follow_up: false,
            action_type: 'employee_message'
        });
    }
}
