import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { TicketService } from "app/modules/ticket/ticket.service";
import { ToasterService } from "angular2-toaster/angular2-toaster";
import config from '../../../config';
import {
    Storage
} from './../../../services/index';
declare var $: any;

@Component({
    selector: 'ewo-assign-ticket',
    templateUrl: './assign-ticket.component.html',
    styleUrls: ['./assign-ticket.component.css']
})
export class AssignTicketComponent implements OnInit {
    @Input() employees: any[] = [];
    @Input() tickets: any[] = [];
    selectedEmployee: any[] = [];
    ticketList: any[] = [];
    isEmployeeValid = true;
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
        private storage: Storage,
        private ticketService: TicketService,
        private toasterService: ToasterService
    ) { }

    ngOnInit () {
    }

    ngOnChanges (changes) {
        if (changes['tickets']) {
            if (changes['tickets'].currentValue.length > 0) {
                this.ticketList = changes['tickets'].currentValue;
                console.log('tickets Assign>>', this.ticketList);
            }
        }
    }
    onPrivateSubmit () {
        // this.ticketPrivateForm.get('workorder').setValue(`${config.api.base}ticket/${this.ticket.id}/`);
        // this.ticketService.createNote(this.ticketPrivateForm.value, true).subscribe((note: any) => {
        //   this.closeModal();
        // });

        this.isEmployeeValid = true;
        // const user = this.storage.getUserInfo();
        if (this.selectedEmployee.length == 0) {
            this.isEmployeeValid = false;
            return;
        }

        if (!this.ticketPrivateForm.valid) return;


        const checkedTicketList: any[] = this.ticketList.filter(item => item.checked);


        let displayTicketsMsg: any[] = [];
        let counter = 0;
        checkedTicketList && checkedTicketList.forEach(ticket => {
            displayTicketsMsg.push(ticket.ticket_key);

            ticket.assigned_to = `${config.api.base}employee/${this.selectedEmployee[0].id}/`;
            ticket.url = `${config.api.base}ticket/${ticket.id}/`;

            this.ticketService.update(ticket, false).subscribe(() => {
                if (++counter == checkedTicketList.length) {
                    this.toasterService.pop('success', 'Assign', `${displayTicketsMsg.join(', ')} Ticket${checkedTicketList.length == 1 ? '' : '\'s'} has been Assign to ${this.selectedEmployee[0].text}`);
                    this.closeModal();
                }
            });

            let note = {
                workorder: `${config.api.base}ticket/${ticket.id}/`,
                details: this.ticketPrivateForm.get('details').value,
                action_type: 'Assign',
                is_private: true,
                tenant_notified: false,
                tenant_follow_up: false,
                vendor_notified: false,
                vendor_follow_up: false
            }
            this.ticketService.createNote(note, false).subscribe(data => {
                console.log('data>>>', data);
            });

        })

    }

    public selectedEmployeeList (value: any): void {
        this.isEmployeeValid = true;
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
    public itemsToString (value: Array<any> = []): string {
        return value
            .map((item: any) => {
                return item.id;
            }).join(',');
    }

    closeModal () {
        this.ticketPrivateForm.reset({
            details: '',
            is_private: true,
            tenant_notified: false,
            tenant_follow_up: false,
            vendor_notified: false,
            vendor_follow_up: false
        });
        this.selectedEmployee = [];
        $('#modal-assign').modal('hide');
    }

}
