import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Storage } from 'app/services';
import { ToasterService } from 'angular2-toaster';
import { ActivatedRoute, Router } from '@angular/router';

import config from '../../config';
import { TicketService } from './ticket.service';
import { VendorService } from './../admin/vendor/vendor.service';
import { EmployeeService } from './../admin/employee/employee.service';
import { AuthenticationService } from "app/modules/authentication";
import { BreadcrumbHeaderService } from "app/modules/shared/breadcrumb-header/breadcrumb-header.service";
declare var $: any;

const enum Page {
    prev,
    next
}

@Component({
    selector: 'ewo-ticket-activity',
    templateUrl: './ticket-activity.component.html'
})
export class TicketActivityComponent implements OnInit {
    isSubmit: boolean = false;
    currentCompanyId = 1;

    @Input() ticket: any;
    // @Input() ticketList: any;
    @Input() ticket_submitter_info: any;
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
    allTickets: any;

    prevDisabled: boolean = false;
    nextDisabled: boolean = false;

    showPrevLoadingIcon: boolean = false;
    showNextLoadingIcon: boolean = false;

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
        // submitted_by_type: new FormControl('E'),
        url: new FormControl()
    });

    constructor(
        private ticketService: TicketService,
        private vendorService: VendorService,
        private employeeService: EmployeeService,
        private authService: AuthenticationService,
        private storage: Storage,
        private toasterService: ToasterService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private breadcrumbHeaderService: BreadcrumbHeaderService,
    ) {
        this.authService.verifyToken().take(1).subscribe(data => {
            this.userInfo = this.storage.getUserInfo();


            // let _problemtype_id = this.ticket.problemtype.extractIdFromURL();
            // /**
            //  * Get All Vendors by problem type
            //  */
            // this.vendorService.getActiveVendorsByProblemType(_problemtype_id).subscribe(
            //     data => {
            //         let _vendor: any[] = data.map(item => {
            //             return { id: item.id, text: (item.company_name) };
            //         })
            //         this.vendors = _vendor;
            //     }
            // );

            // this.getEmployeesByTicketBuildingProblemType(_problemtype_id);

        });
        this.ticketService.showNextPrevLoadingIcon$.subscribe(show => {
            this.showPrevLoadingIcon = show;
            this.showNextLoadingIcon = show;
        });
    }


    ngOnInit () {
        // this.ticketForm.patchValue(this.ticket);
        //for next prev
        // this.ticketService.tickets$.subscribe(data => {
        //     const ticketId = this.ticket.id;
        //     this.allTickets = data;
        //     const allTicketIds = this.allTickets.map(item => item.id);
        // });

        console.log('this.storage.get(config.storage.ticketRequestType)', this.storage.get(config.storage.ticketRequestType));


        if (!this.ticketService.getTickets()) {
            let ticketRequestType = this.storage.get(config.storage.ticketRequestType);
            // this.ticketService.updateTicketList(true);

            this.getAllTickets(ticketRequestType);

        } else {
            this.disabledButtons();
        }
    }


    ngOnChanges (changes) {
        if (changes['ticket']) {
            if (changes['ticket'].currentValue) {
                this.ticket = changes['ticket'].currentValue;
                this.ticketForm.patchValue(this.ticket);
                this.getProblemTypes();
            } else {
                this.ticket = [];
            }
        }
    }
    getAllTickets (type): void {
        this.ticketService.getAllTickets(this.currentCompanyId, type).subscribe(
            data => {
                // this.tickets = data;
                this.ticketService.setTickets(data);
                this.disabledButtons();

            }
        );
    }
    getProblemTypes () {
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

        this.getEmployeesByTicketBuildingProblemType(_problemtype_id);

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
        // this.ticketVendorForm.get('updated_by_id').setValue(this.userInfo.user_id);
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
            // this.ticketForm.get('submitted_by_type').setValue('E');

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
            // console.log('Selected file type is: ' + fileList[0].type);
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
            vendor_follow_up: false,
            action_type: 'tenant_message'
        });

        this.ticketPrivateForm.reset({
            details: '',
            updated_by_type: 'E',
            is_private: true,
            tenant_notified: false,
            tenant_follow_up: false,
            vendor_notified: false,
            vendor_follow_up: false,
            action_type: 'employee_message'
        });

        this.ticketVendorForm.reset({
            details: '',
            updated_by_type: 'E',
            is_private: true,
            tenant_notified: false,
            tenant_follow_up: false,
            vendor_notified: true,
            vendor_follow_up: false,
            send_tenant_info: true,
            action_type: 'send_vendor'
        });

        this.ticketCloseForm.reset({
            details: '',
            updated_by_type: 'E',
            is_private: false,
            tenant_notified: false,
            tenant_follow_up: false,
            vendor_notified: false,
            vendor_follow_up: false,
            action_type: 'close'
        });


        this._vendorSubmitted = false;
        this._publicFormSubmitted = false;
    }

    btnPrevClick (event) {
        this.getNextPrevTicket(Page.prev);
        this.disabledButtons();

        // let tickets = this.ticketService.getTickets();
        // const allTicketIds: any[] = tickets.map(item => item.id);
        // const length = allTicketIds.length;
        // const ticketIndex = allTicketIds.indexOf(this.ticket.id);

        // this.router.navigate(['/ticket-details', allTicketIds[ticketIndex - 1]]);


        // if (length > 1 && ticketIndex == 0) {
        //     this.prevDisabled = true;
        // } else if (length > 1 && ticketIndex > 0) {
        //     this.router.navigate(['/ticket-details', allTicketIds[ticketIndex - 1]]);
        // } else if (length > 1 && ticketIndex == length) {
        //     this.nextDisabled = true;
        //     this.router.navigate(['/ticket-details', allTicketIds[ticketIndex - 1]]);
        // }




        // else if (length > 1 && ticketIndex > 0) {
        //     this.router.navigate(['/ticket-details', allTicketIds[ticketIndex - 1]]);
        // }

    }
    btnNexClick (event) {
        this.getNextPrevTicket(Page.next);
        this.disabledButtons();
    }

    getNextPrevTicket (page) {
        let tickets: any[] = this.ticketService.getTickets();
        if (!tickets) return;
        const allTicketIds: any[] = tickets.map(item => item.id).reverse();
        const length = allTicketIds.length;
        const ticketIndex = allTicketIds.indexOf(this.ticket.id);

        //Set tickets
        this.ticketService.setTickets(tickets);
        if (page == Page.prev) {
            this.showPrevLoadingIcon = true;

            let id = +allTicketIds[ticketIndex - 1];
            // let id = +allTicketIds[ticketIndex + 1];

            //new tickets
            let _ticket = tickets.find(item => item.id == id);
            this.ticket = _ticket;
            // this.breadcrumbHeaderService.setBreadcrumbTitle('');
            this.router.navigate(['/ticket-details', id], { replaceUrl: true });

            // this.router.navigate(['/ticket-details', id], { replaceUrl: true, relativeTo: this.activatedRoute });
            // this.ticketService.setPrevTicket(allTicketIds[ticketIndex - 1]);
            // this.ticketService.setPrevTicket(id);

        }
        else if (page == Page.next) {
            this.showNextLoadingIcon = true;
            let id = +allTicketIds[ticketIndex + 1];
            // let id = +allTicketIds[ticketIndex - 1];

            //new tickets
            let _ticket = tickets.find(item => item.id == id);
            this.ticket = _ticket;
            // this.breadcrumbHeaderService.setBreadcrumbTitle('');
            this.router.navigate(['/ticket-details', id], { replaceUrl: true });

            // this.router.navigate(['/ticket-details', allTicketIds[ticketIndex + 1]], {replaceUrl: true});
            // this.router.navigate(['/ticket-details', id], { replaceUrl: true, relativeTo: this.activatedRoute, skipLocationChange: false });

            // this.ticketService.setNextTicket(allTicketIds[ticketIndex + 1]);
            // this.ticketService.setNextTicket(id);

        }
    }

    disabledButtons () {
        this.prevDisabled = false;
        this.nextDisabled = false;
        let tickets = this.ticketService.getTickets();
        if (!tickets) return;
        const allTicketIds: any[] = tickets.map(item => item.id).reverse();
        const length = allTicketIds.length;
        const ticketIndex = allTicketIds.indexOf(this.ticket.id);

        if (length == 1) {
            this.prevDisabled = true;
            this.nextDisabled = true;
            return;
        }

        if (length > 1 && ticketIndex == 0) {
            this.prevDisabled = true;
        } else if (length > 1 && (ticketIndex + 1) == length) {
            this.nextDisabled = true;
        }
    }
}
