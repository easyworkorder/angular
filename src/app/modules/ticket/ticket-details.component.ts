import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import config from '../../config';
import {EmployeeService} from './../admin/employee/employee.service';
import {BuildingService} from './../admin/building/building.service';
import {TenantService} from './../admin/tenant/tenant.service';
import {ProblemTypeService} from './../admin/problem_type/problem_type.service';
import {TicketService} from './ticket.service';
import { ValidationService } from "./../../services/validation.service";
import {AuthenticationService} from "app/modules/authentication";
import { UpdateTicketLaborService } from './ticket-labor.service';
import { UpdateTicketMaterialService } from './ticket-material.service';

import {
    AppHttp
} from '../../services';

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

    ticket: any;
    notes: any[];
    labors: any[];
    materials: any[];



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
        title: new FormControl('', Validators.required),
        description: new FormControl('', Validators.required),
        is_private: new FormControl(false),
        estimated_amount: new FormControl(0, ValidationService.numericValidator),
        is_billable: new FormControl(false),
        is_safety_issue: new FormControl(false),
        status: new FormControl('Open'),
        url: new FormControl('')
    });

    tabs = new TabVisibility();
    ticketId:any;

    constructor(
                protected http: AppHttp,
                private buildingService: BuildingService,
                private employeeService: EmployeeService,
                private tenantService: TenantService,
                private problemTypeService: ProblemTypeService,
                private ticketService: TicketService,
                private authService: AuthenticationService,
                private route: ActivatedRoute,
                private updateTicketLaborService: UpdateTicketLaborService,
                private updateTicketMaterialService: UpdateTicketMaterialService) {
        this.authService.verifyToken().take(1).subscribe(data => {
            this.getAllActiveEmployees();

        });
    }

    ngOnInit() {
        this.ticketId = this.route.snapshot.params['id'];
        this.getAllNotes(this.ticketId);
        this.getAllLabors(this.ticketId);
        this.getAllMaterials(this.ticketId);
        this.ticketService.getTicketDetails(this.ticketId).subscribe(
            data => {
                this.ticket = data;
                this.ticketForm.patchValue(data);//
            }
        );
        this.switchTab(1);
    }

    getAllNotes(ticketId) {
        this.ticketService.getAllNotes(ticketId).subscribe(
            data => {
                this.notes = data;
            });
    }

    getAllLabors(ticketId) {
        const observable = this.http.get('ticketlabor/?workorder_id=' + ticketId);
        observable.subscribe(data => {
            this.labors = data.results;
        });
    }

    getAllMaterials(ticketId) {
        const observable = this.http.get('ticketmaterial/?workorder_id=' + ticketId);
        observable.subscribe(data => {
            this.materials = data.results;
        });
    }

    switchTab(tabId: number) {
        this.tabs.isActivityTabVisible = tabId === 1 ? true : false;
        this.tabs.isLaborTabVisible = tabId === 2 ? true : false;
        this.tabs.isMaterialTabVisible = tabId === 3 ? true : false;
        this.tabs.isFilesTabVisible = tabId === 4 ? true : false;
        this.tabs.selectedTabNo = tabId;
    }

    onSubmit() {
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
                    return { id: item.id, text: (item.first_name + ' ' + item.last_name) };
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

    closeModal() {
        this.resetForm();
        this.building = [];
        this.tenant= [];
        this.problem_type= [];
        this.priority = [];
        this.employee = [];
        this.group = [];
        $('#modal-add-request').modal('hide');
    }

    resetForm() {
        this.ticketForm.reset({
            is_private: false,
            estimated_amount: 0,
            is_billable: false,
            is_safety_issue: false
        });
    }

    updateLaborInfo(data) {
        // this.updatePeopleInfo = data;
        // this.updateTicketLaborService.setUpdateLabor(data);
        // $('#modal-add-labor').modal({
        //     backdrop: 'static',
        //     show: true
        // });
        // console.log(data);
        this.ticketId && this.getAllLabors(this.ticketId);
    }

    updateMaterialInfo(data) {
        this.updateTicketMaterialService.setUpdateMaterial(data);
        $('#modal-add-material').modal({
            backdrop: 'static',
            show: true
        });
    }
}
