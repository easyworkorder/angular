import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import config from '../../config';
import {EmployeeService} from './../admin/employee/employee.service';
import {BuildingService} from './../admin/building/building.service';
import {TenantService} from './../admin/tenant/tenant.service';
import {ProblemTypeService} from './../admin/problem_type/problem_type.service';
import {TicketService} from './ticket.service';
import { ValidationService } from "./../../services/validation.service";
import {AuthenticationService} from "app/modules/authentication";
declare var $: any;

@Component ({
    selector: 'ewo-ticket-edit',
    templateUrl: './ticket-edit.component.html'
})

export class TicketEditComponent implements OnInit {

    @Input() ticket: any[];

    _submitted = false;
    building: any[] = [];
    tenant: any[] = [];
    problem_type: any[] = [];
    priority: any[] = [];
    employee: any[] = [];
    group: any[] = [];

    tickets: any[] = [];
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
    currentCompanyId = 1;

    ticketForm = new FormGroup({
        id: new FormControl(),
        building: new FormControl(''),
        tenant: new FormControl(''),
        problemtype: new FormControl(''),
        priority: new FormControl(''),
        employee: new FormControl(''),
        group: new FormControl(''),
        subject: new FormControl('', Validators.required),
        description: new FormControl('', Validators.required),
        is_private: new FormControl(false),
        estimated_amount: new FormControl(0, ValidationService.numericValidator),
        is_billable: new FormControl(false),
        is_safety_issue: new FormControl(false),
        notify_tenant: new FormControl(false),
        tenant_notify_flag: new FormControl(false),
        status: new FormControl('Open')
    });

    constructor(private buildingService: BuildingService,
                private employeeService: EmployeeService,
                private tenantService: TenantService,
                private problemTypeService: ProblemTypeService,
                private ticketService: TicketService,
                private authService: AuthenticationService) {
        this.authService.verifyToken().take(1).subscribe(data => {
            this.getAllTickets();
            this.getAllActiveBuildings();
            this.getAllActiveEmployees();
            this.getAllActiveProblemTypes();
        });
    }

    ngOnInit() {

    }

    onSubmit() {
        this._submitted = true;
        // console.log(this.ticketForm.value);
        this.ticketService.create(this.ticketForm.value).subscribe((tikcet: any) => {
            // this.getAllTickets();
            // this.closeModal();
        });
    }

    getAllTickets(): void {
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
    }

    getAllActiveEmployees(): void {
        this.employeeService.getAllActiveEmployees(this.currentCompanyId).subscribe(
            data => {
                let _employee: any[] = data.results.map(item => {
                    return { id: item.id, text: (item.last_name + ' ' + item.first_name) };
                })
                this.employees = _employee;
            }
        );
    }

    getAllActiveProblemTypes(): void {
        this.problemTypeService.getAllActiveProblemTypes(this.currentCompanyId).subscribe(
            data => {
                let _problem_type: any[] = data.results.map(item => {
                    return { id: item.id, text: (item.problem_name) };
                })
                this.problem_types = _problem_type;
            }
        );
    }

    getActiveTenantsByBuilding(building_id): void {
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
    }

    public selectedProblemType(value: any): void {
        this.problem_type = [value];
        this.ticketForm.get('problemtype').setValue(config.api.base + 'problemType/' + this.problem_type[0].id + '/');
    }

    public selectedPriority(value: any): void {
        this.priority = [value];
        this.ticketForm.get('priority').setValue(this.priority[0].id);
    }

    public selectedEmployee(value: any): void {
        this.employee = [value];
        this.ticketForm.get('employee').setValue(config.api.base + 'employee/' + this.employee[0].id + '/');
    }

    public selectedGroup(value: any): void {
        this.group = [value];
        this.ticketForm.get('group').setValue(this.group[0].id);
    }
}
