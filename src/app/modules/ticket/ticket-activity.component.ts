import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Storage } from 'app/services';
import { ToasterService } from 'angular2-toaster';
import { ActivatedRoute } from '@angular/router';

import config from '../../config';
import { TicketService } from './ticket.service';
import { VendorService } from './../admin/vendor/vendor.service';
import { EmployeeService } from './../admin/employee/employee.service';
import { AuthenticationService } from "app/modules/authentication";
declare var $: any;


@Component({
    selector: 'ewo-ticket-activity',
    templateUrl: './ticket-activity.component.html'
})
export class TicketActivityComponent implements OnInit {
    isSubmit: boolean = false;
    currentCompanyId = 1;

    @Input() ticket: any;
    @Input() notes: any;
    // @Input() employees: any;
    @Input() tenant_contacts: any;
    @Input() isAdmin: boolean = false;
    @Output('update') change: EventEmitter<any> = new EventEmitter<any>();

    _vendorSubmitted = false;
    _publicFormSubmitted = false;

    vendors: any[] = [];
    employees: any[] = [];
    selectedVendor: any[] = [];

    selectedTenant: any[] = [];
    selectedEmployee: any[] = [];

    attachFile: File;
    selectedFile: string = '';

    userInfo: any;

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
        vendor_follow_up: new FormControl(false),
        action_type: new FormControl('tenant_message')
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
        vendor_follow_up: new FormControl(false),
        action_type: new FormControl('employee_message')
    });

    /**
     * Send Vendor form
     * @type {FormGroup}
     */
    ticketVendorForm = new FormGroup({
        id: new FormControl(),
        url: new FormControl(''),
        workorder: new FormControl(''),
        vendor: new FormControl(''),
        details: new FormControl('', Validators.required),
        updated_by_id: new FormControl(''),
        updated_by_type: new FormControl('E'),
        is_private: new FormControl(true),
        tenant_notified: new FormControl(false),
        tenant_follow_up: new FormControl(false),
        vendor_notified: new FormControl(true),
        vendor_follow_up: new FormControl(false),
        send_tenant_info: new FormControl(true),
        action_type: new FormControl('send_vendor')
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
        vendor_follow_up: new FormControl(false),
        action_type: new FormControl('close')

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
        private employeeService: EmployeeService,
        private authService: AuthenticationService,
        private storage: Storage,
        private toasterService: ToasterService
    ) {
        this.authService.verifyToken().take(1).subscribe(data => {
            this.userInfo = this.storage.getUserInfo();
            console.log('userInfo2', this.userInfo);


            let _problemtype_id = this.ticket.problemtype.extractIdFromURL();
            /**
             * Get All Vendors by problem type
             */
            this.vendorService.getActiveVendorsByProblemType(_problemtype_id).subscribe(
                data => {
                    let _vendor: any[] = data.map(item => {
                        return { id: item.id, text: (item.company_name) };
                    })
                    this.vendors = _vendor;
                }
            );
            this.getEmployeesByTicketBuildingProblemType(_problemtype_id); //TEMP
        });
    }


    ngOnInit () {
        this.ticketForm.patchValue(this.ticket);
    }

    onPublicSubmit () {
        this._publicFormSubmitted = true;
        if (!this.ticketPublicForm.valid) {
            return;
        }
        this.isSubmit = true;
        this.ticketPublicForm.get('workorder').setValue(`${config.api.base}ticket/${this.ticket.id}/`);
        this.ticketService.createNote(this.ticketPublicForm.value, true).subscribe((note: any) => {
            this.isSubmit = false;
            this.change.emit(true);
            this.closeModal();
        });
    }

    onPrivateSubmit () {
        this.isSubmit = true;
        this.ticketPrivateForm.get('workorder').setValue(`${config.api.base}ticket/${this.ticket.id}/`);
        this.ticketService.createNote(this.ticketPrivateForm.value, true).subscribe((note: any) => {
            this.isSubmit = false;
            this.change.emit(true);
            this.closeModal();
        });
    }

    onVendorSubmit () {
        this.isSubmit = true;
        this._vendorSubmitted = true;
        if (this.selectedVendor.length === 0) {
            return;
        }
        this.ticketVendorForm.get('workorder').setValue(`${config.api.base}ticket/${this.ticket.id}/`);
        this.ticketVendorForm.get('updated_by_id').setValue(this.userInfo.user_id);
        this.ticketService.createNote(this.ticketVendorForm.value, false).subscribe((note: any) => {
            this.ticketVendorRequestForm.get('workordernote').setValue(`${config.api.base}ticketnote/${note.id}/`);
            this.ticketVendorRequestForm.get('send_tenant_info').setValue(this.ticketVendorForm.get('send_tenant_info').value);
            this.ticketService.createWorkorderVendor(this.ticketVendorRequestForm.value);
            this.isSubmit = false;
            this.change.emit(true);
            this.closeModal();
        });
    }

    onCloseSubmit () {
        this.isSubmit = true;
        this.ticketCloseForm.get('workorder').setValue(`${config.api.base}ticket/${this.ticket.id}/`);
        this.ticketService.createNote(this.ticketCloseForm.value, false).subscribe((note: any) => {

            this.ticketForm.get('status').setValue('Closed');
            this.ticketForm.get('closed').setValue(true);
            this.ticketForm.get('submitted_by_type').setValue('E');

            this.ticketService.update(this.ticketForm.value, false).subscribe((tikcet: any) => { });
            this.toasterService.pop('success', 'UPDATE', 'Ticket has been Closed successfully');
            this.isSubmit = false;
            this.change.emit(true);
            this.closeModal();
        });
    }

    fileSelectionChange (event) {
        let fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            this.attachFile = fileList[0];
            this.selectedFile = this.attachFile.name;
            console.log('Selected file type is: ' + fileList[0].type);
        }
    }

    getPhotoUrl (ticket) {
        if (ticket.photo != null && ticket.photo.length > 0) {
            return ticket.photo;
        }
        return 'assets/img/placeholders/avatars/avatar9.jpg';
    }

    /**
     * Get All employee for ticket building & problem type
     */
    getEmployeesByTicketBuildingProblemType (problemtype_id): void {
        let _building_id = this.ticket.building.extractIdFromURL();
        this.employeeService.getEmployeesByTicketBuildingProblemType(_building_id, problemtype_id).subscribe(
            data => {
                let _employee: any[] = data.map(item => {
                    return { id: item.id, text: (item.first_name + ' ' + item.last_name) };
                })
                //  _employee.splice(0, 0, { id: -1, text: 'Pleae select' });
                this.employees = _employee;
            }
        );
    }

    /**
     * Set selected tenant data
     * @param value
     */
    public selectedTenantList (value: any): void {
        this.selectedTenant.push(value);
        this.setTenantList();
    }

    public removedTenantList (value: any): void {
        let sel = [];
        this.selectedTenant.forEach(item => {
            if (item.id !== value.id) {
                sel.push(item);
            }
        });
        this.selectedTenant = sel;
        this.setTenantList();
    }

    setTenantList () {
        let tenantList = this.itemsToString(this.selectedTenant);
        tenantList = tenantList.split(',').join(',');
        this.ticketPublicForm.get('tenant_list').setValue(tenantList);
    }

    /**
     * Set selected employee data
     * @param value
     */
    public selectedEmployeeList (value: any): void {
        this.selectedEmployee.push(value);
        this.setEmployeeList();
    }

    public removedEmployeeList (value: any): void {
        let sel = [];
        this.selectedEmployee.forEach(item => {
            if (item.id !== value.id) {
                sel.push(item);
            }
        });
        this.selectedEmployee = sel;
        this.setEmployeeList();
    }

    setEmployeeList () {
        let employeeList = this.itemsToString(this.selectedEmployee);
        employeeList = employeeList.split(',').join(',');
        this.ticketPrivateForm.get('employee_list').setValue(employeeList);
    }

    /**
     * Set selected vendor data
     * @param value
     */
    public setSelectedVendor (value: any): void {
        this.selectedVendor = [value];
        this.ticketVendorRequestForm.get('vendor').setValue(config.api.base + 'vendor/' + this.selectedVendor[0].id + '/');
        this.ticketVendorForm.get('vendor').setValue(config.api.base + 'vendor/' + this.selectedVendor[0].id + '/');
    }

    public itemsToString (value: Array<any> = []): string {
        return value
            .map((item: any) => {
                return item.id;
            }).join(',');
    }

    closeModal () {
        this.resetForm();
        this.selectedTenant = [];
        this.selectedEmployee = [];
        this.selectedVendor = [];
        $('#modal-add-public').modal('hide');
        $('#modal-add-private').modal('hide');
        $('#modal-send-vendor').modal('hide');
        $('#modal-close-wo').modal('hide');
    }

    resetForm () {
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
        this._publicFormSubmitted = false;
    }
}
