import {Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {EmployeeService} from './../admin/employee/employee.service';
import {TenantService} from './../admin/tenant/tenant.service';
import {TicketService} from './ticket.service';
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
    notes: any[] = [];
    labors: any[];
    materials: any[];
    tenants: any[];
    employees: any[];

    currentCompanyId = 1;

    tabs = new TabVisibility();
    ticketId: any;

    constructor(
                protected http: AppHttp,
                private employeeService: EmployeeService,
                private tenantService: TenantService,
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
                this.getActiveTenantsByBuilding(this.ticket.building_id);
            }
        );
        this.switchTab(1);
    }

    getAllNotes(ticketId) {
        this.ticketService.getAllNotes(ticketId).subscribe(
            data => {
                this.notes = data.results;
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

    updateNotes(data){
        this.ticketId && this.getAllNotes(this.ticketId);
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
