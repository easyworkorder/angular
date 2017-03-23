import {Component, OnInit} from '@angular/core';
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

@Component({
    selector: 'ewo-ticket',
    templateUrl: './ticket.component.html',
    styleUrls: ['./ticket.component.css']
})
export class TicketComponent implements OnInit {

    _submitted = false;
    building: any[] = [];
    tenant: any[] = [];
    problem_type: any[] = [];
    priority: any[] = [];
    employee: any[] = [];
    group: any[] = [];

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
    submit_time = new Date().getTime();

    ticketForm = new FormGroup({
        id: new FormControl(),
        company: new FormControl(config.api.base + 'company/' + this.currentCompanyId + '/'),
        building: new FormControl(''),
        tenant: new FormControl(''),
        problemtype: new FormControl(''),
        priority: new FormControl(''),
        employee: new FormControl(''),
        group: new FormControl(''),
        submit_time: new FormControl(this.submit_time),
        description: new FormControl('', Validators.required),
        is_private: new FormControl(false),
        estimated_amount: new FormControl(''),
        is_billable: new FormControl(false),
        is_safety_issue: new FormControl(false),
        status: new FormControl('Open'),
        respond_within: new FormControl(''),
        respond_within_unit: new FormControl(''),
        resolve_within: new FormControl(''),
        resolve_within_unit: new FormControl('')
    });

    constructor(private buildingService: BuildingService,
                private employeeService: EmployeeService,
                private tenantService: TenantService,
                private problemTypeService: ProblemTypeService,
                private ticketService: TicketService,
                private authService: AuthenticationService) {
        this.authService.verifyToken().take(1).subscribe(data => {
            this.getAllActiveBuildings();
            this.getAllActiveEmployees();
            this.getAllActiveProblemTypes();
        });
    }

    ngOnInit() {

    }

    onSubmit() {
        this._submitted = true;

        /*this.ticketService.create(this.ticketForm.value).subscribe((building: any) => {
            this.getAllBuildings();
            this.closeModal();
        });*/
    }

    getAllActiveBuildings(): void {
        this.buildingService.getAllActiveBuildings(this.currentCompanyId).subscribe(
            data => {
                let _building: any[] = data.results.map(item => {
                    return { id: item.id, text: (item.name) };
                })
                //  _employee.splice(0, 0, { id: -1, text: 'Pleae select' });
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
                //  _employee.splice(0, 0, { id: -1, text: 'Pleae select' });
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
        this.ticketForm.get('priority').setValue(this.problem_type[0].id);
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
