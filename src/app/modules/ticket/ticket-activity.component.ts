import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { ToasterService } from 'angular2-toaster';
import { ActivatedRoute } from '@angular/router';

import config from '../../config';
import { TicketService } from './ticket.service';
import { VendorService } from './../admin/vendor/vendor.service';
import { AuthenticationService } from "app/modules/authentication";
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
    @Input() tenant_contacts: any;
    @Input() isAdmin: boolean = false;
    @Output('update') change: EventEmitter<any> = new EventEmitter<any>();

    _vendorSubmitted = false;

    vendors: any[] = [];
    selectedVendor: any[] = [];

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

    /**
     * Private Note form
     * @type {FormGroup}
     */
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

    /**
     * Send Vendor form
     * @type {FormGroup}
     */
    ticketVendorForm = new FormGroup({
        id: new FormControl(),
        url: new FormControl(''),
        workorder: new FormControl(''),
        details: new FormControl('', Validators.required),
        updated_by_type: new FormControl('E'),
        is_private: new FormControl(true),
        tenant_notified: new FormControl(false),
        tenant_follow_up: new FormControl(false),
        vendor_notified: new FormControl(true),
        vendor_follow_up: new FormControl(false),
        send_tenant_info: new FormControl(true)
    });

    ticketVendorRequestForm = new FormGroup({
        id: new FormControl(),
        url: new FormControl(''),
        vendor: new FormControl(''),
        workordernote: new FormControl(''),
        send_tenant_info: new FormControl(true)
    });

    ticketCloseForm = new FormGroup({
        id: new FormControl(),
        url: new FormControl(''),
        workorder: new FormControl(''),
        details: new FormControl('', Validators.required),
        updated_by_type: new FormControl('E'),
        is_private: new FormControl(false),
        tenant_notified: new FormControl(false),
        tenant_follow_up: new FormControl(false),
        vendor_notified: new FormControl(false),
        vendor_follow_up: new FormControl(false)
    });
    /**
     * To Close the ticket
     * @type {FormGroup}
     */
    ticketForm = new FormGroup({
        id: new FormControl(),
        status: new FormControl('Closed'),
        closed: new FormControl(true),
        submitted_by_type: new FormControl('E'),
        url: new FormControl()
    });

    constructor(
        private ticketService: TicketService,
        private vendorService: VendorService,
        private authService: AuthenticationService,
        private toasterService: ToasterService
        ) {
        this.authService.verifyToken().take(1).subscribe(data => { console.log(this.tenant_contacts);
            /**
             * Get All Vendors
             */
            this.vendorService.getAllActiveVendors(this.currentCompanyId).subscribe(
                data => {
                    let _vendor: any[] = data.map(item => {
                        return { id: item.id, text: (item.company_name) };
                    })
                    this.vendors = _vendor;
                }
            );
        });
    }


    ngOnInit() {
        this.ticketForm.patchValue(this.ticket);
    }

    onPublicSubmit() {
        this.ticketPublicForm.get('workorder').setValue(`${config.api.base}ticket/${this.ticket.id}/`);
        this.ticketService.createNote(this.ticketPublicForm.value, true).subscribe((note: any) => {
            this.change.emit(true);
            this.closeModal();
        });
    }

    onPrivateSubmit() {
        this.ticketPrivateForm.get('workorder').setValue(`${config.api.base}ticket/${this.ticket.id}/`);
        this.ticketService.createNote(this.ticketPrivateForm.value, true).subscribe((note: any) => {
            this.change.emit(true);
            this.closeModal();
        });
    }

    onVendorSubmit() {
        this._vendorSubmitted = true;
        if (this.selectedVendor.length === 0) {
            return;
        }
        this.ticketVendorForm.get('workorder').setValue(`${config.api.base}ticket/${this.ticket.id}/`);
        this.ticketService.createNote(this.ticketVendorForm.value, false).subscribe((note: any) => {
            this.ticketVendorRequestForm.get('workordernote').setValue(`${config.api.base}ticketnote/${note.id}/`);
            this.ticketVendorRequestForm.get('send_tenant_info').setValue(this.ticketVendorForm.get('send_tenant_info').value);
            this.ticketService.createWorkorderVendor(this.ticketVendorRequestForm.value);
            this.change.emit(true);
            this.closeModal();
        });
    }

    onCloseSubmit() {
        this.ticketCloseForm.get('workorder').setValue(`${config.api.base}ticket/${this.ticket.id}/`);
        this.ticketService.createNote(this.ticketCloseForm.value, false).subscribe((note: any) => {

            this.ticketForm.get('status').setValue('Closed');
            this.ticketForm.get('closed').setValue(true);
            this.ticketForm.get('submitted_by_type').setValue('E');

            this.ticketService.update(this.ticketForm.value, false).subscribe((tikcet: any) => {});
            this.toasterService.pop('success', 'UPDATE', 'Ticket has been Closed successfully');
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

    /**
     * Set selected vendor data
     * @param value
     */
    public setSelectedVendor(value: any): void {
        this.selectedVendor = [value];
        this.ticketVendorRequestForm.get('vendor').setValue(config.api.base + 'vendor/' + this.selectedVendor[0].id + '/');
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
        this.selectedVendor = [];
        $('#modal-add-public').modal('hide');
        $('#modal-add-private').modal('hide');
        $('#modal-send-vendor').modal('hide');
        $('#modal-close-wo').modal('hide');
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

        this.ticketVendorForm.reset({
            details: '',
            updated_by_type: 'E',
            is_private: true,
            tenant_notified: false,
            tenant_follow_up: false,
            vendor_notified: true,
            vendor_follow_up: false,
            send_tenant_info: true
        });

        this.ticketCloseForm.reset({
            details: '',
            updated_by_type: 'E',
            is_private: false,
            tenant_notified: false,
            tenant_follow_up: false,
            vendor_notified: false,
            vendor_follow_up: false
        });


        this._vendorSubmitted = false;
    }
}
