import {Component, OnInit, Input} from '@angular/core';
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
declare var $: any;


@Component({
    selector: 'ewo-ticket-activity',
    templateUrl: './ticket-activity.component.html'
})
export class TicketActivityComponent implements OnInit {

    currentCompanyId = 1;

    @Input() ticket: any;
    @Input() notes: any;
    @Input() isAdmin: boolean = false;

    tenants: any[] = [];

    constructor(
        private ticketService: TicketService,
        private tenantService: TenantService,
        ) {

        // this.getActiveTenantsByBuilding(this.ticket.building_id);

    }


    ngOnInit() {
    }

    getActiveTenantsByBuilding(building_id): void {
        /*this.tenantService.getActiveTenantsByBuilding(building_id).subscribe(
            data => {
                let _tenant: any[] = data.results.map(item => {
                    return { id: item.id, text: (item.unitno + ' ' + item.tenant_company_name) };
                })
                this.tenants = _tenant;
            }
        );*/
    }

    public selectedTenant(value: any): void {
        // _tenant = [value];
        // this.ticketNoteForm.get('tenant').setValue(config.api.base + 'tenant/' + _tenant[0].id + '/');
    }

    getPhotoUrl(ticket) {
        if (ticket.photo != null && ticket.photo.length > 0) {
            return ticket.photo;
        }
        return 'assets/img/placeholders/avatars/avatar9.jpg';
    }
}
