import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import config from '../../config';
import {TicketService} from './ticket.service';
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
    @Input() employees: any;
    @Input() tenants: any;
    @Input() isAdmin: boolean = false;
    @Output('update') change: EventEmitter<any> = new EventEmitter<any>();


    selectedTenant: any[] = [];
    selectedEmployee: any[] = [];

    /**
     * Note Reply form
     * @param ticketService
     * @param authService
     */
    ticketPublicForm = new FormGroup({
        id: new FormControl(),
        url: new FormControl(''),
        workorder: new FormControl(''),
        details: new FormControl('', Validators.required),
        tenant_list: new FormControl(''),
        updated_by_type: new FormControl('E'),
        is_private: new FormControl(false),
        tenant_notified: new FormControl(true),
        tenant_follow_up: new FormControl(false),
        vendor_notified: new FormControl(false),
        vendor_follow_up: new FormControl(false)
    });

    ticketPrivateForm = new FormGroup({
        id: new FormControl(),
        url: new FormControl(''),
        workorder: new FormControl(''),
        details: new FormControl('', Validators.required),
        employee_list: new FormControl(''),
        updated_by_type: new FormControl('E'),
        is_private: new FormControl(true),
        tenant_notified: new FormControl(false),
        tenant_follow_up: new FormControl(false),
        vendor_notified: new FormControl(false),
        vendor_follow_up: new FormControl(false)
    });

    constructor(
        private ticketService: TicketService,
        private authService: AuthenticationService,
        ) {
        this.authService.verifyToken().take(1).subscribe(data => {});
    }


    ngOnInit() {
    }

    onPublicSubmit() {
        this.ticketPublicForm.get('workorder').setValue(`${config.api.base}ticket/${this.ticket.id}/`);
        this.ticketService.createNote(this.ticketPublicForm.value).subscribe((note: any) => {
            this.change.emit(true);
            this.closeModal();
        });
    }

    onPrivateSubmit() {
        this.ticketPrivateForm.get('workorder').setValue(`${config.api.base}ticket/${this.ticket.id}/`);
        this.ticketService.createNote(this.ticketPrivateForm.value).subscribe((note: any) => {
            this.change.emit(true);
            this.closeModal();
        });
    }

    getPhotoUrl(ticket) {
        if (ticket.photo != null && ticket.photo.length > 0) {
            return ticket.photo;
        }
        return 'assets/img/placeholders/avatars/avatar9.jpg';
    }

    /**
     * Set selected tenant data
     * @param value
     */
    public selectedTenantList(value: any): void {
        this.selectedTenant.push(value);
        this.setTenantList();
    }

    public removedTenantList(value: any): void {
        let sel = [];
        this.selectedTenant.forEach(item => {
            if (item.id !== value.id) {
                sel.push(item);
            }
        });
        this.selectedTenant = sel;
        this.setTenantList();
    }

    setTenantList() {
        let tenantList = this.itemsToString( this.selectedTenant );
        tenantList = tenantList.split(',').join(',');
        this.ticketPublicForm.get('tenant_list').setValue(tenantList);
    }

    /**
     * Set selected employee data
     * @param value
     */
    public selectedEmployeeList(value: any): void {
        this.selectedEmployee.push(value);
        this.setEmployeeList();
    }

    public removedEmployeeList(value: any): void {
        let sel = [];
        this.selectedEmployee.forEach(item => {
            if (item.id !== value.id) {
                sel.push(item);
            }
        });
        this.selectedEmployee = sel;
        this.setEmployeeList();
    }

    setEmployeeList() {
        let employeeList = this.itemsToString( this.selectedEmployee );
        employeeList = employeeList.split(',').join(',');
        this.ticketPrivateForm.get('employee_list').setValue(employeeList);
    }

    public itemsToString(value: Array<any> = []): string {
        return value
            .map((item: any) => {
                return item.id;
            }).join(',');
    }

    closeModal() {
        this.resetForm();
        this.selectedTenant = [];
        this.selectedEmployee = [];
        $('#modal-add-public').modal('hide');
        $('#modal-add-private').modal('hide');
    }

    resetForm() {
        this.ticketPublicForm.reset({
            details: '',
            updated_by_type: 'E',
            is_private: false,
            tenant_notified: true,
            tenant_follow_up: false,
            vendor_notified: false,
            vendor_follow_up: false
        });
        this.ticketPrivateForm.reset({
            details: '',
            updated_by_type: 'E',
            is_private: true,
            tenant_notified: false,
            tenant_follow_up: false,
            vendor_notified: false,
            vendor_follow_up: false
        });
    }
}
