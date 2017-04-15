import { Component, OnInit, Input, EventEmitter, Output, OnChanges } from '@angular/core';
import { DataService, AppHttp } from "app/services";
import { Router } from "@angular/router";
import { FormControl } from "@angular/forms";
import { TicketService } from "app/modules/ticket/ticket.service";
declare var $: any;
import config from '../../../config';


import {
    Storage
} from './../../../services/index';
import { ToasterService } from "angular2-toaster/angular2-toaster";

@Component({
    selector: 'ewo-ticket-list',
    templateUrl: './ticket-list.component.html'
})
export class TicketListComponent implements OnInit {
    @Input() employees: any[] = [];

    constructor(
        // private http: ApdpHttp,
        private dataService: DataService,
        private router: Router,
        private storage: Storage,
        private ticketService: TicketService,
        private toasterService: ToasterService
    ) { }
    /// A List of Contact objects to display
    @Input() tickets: any[];
    @Input() isAdmin: boolean = false;
    @Output('update') change: EventEmitter<any> = new EventEmitter<any>();

    ticketList: any[] = [];

    allCheckbox: FormControl = new FormControl(false);
    ngOnInit () {
        this.allCheckbox.valueChanges.subscribe(value => {
            this.ticketList.map(item => item.checked = value)
        });
    }
    ngOnChanges (changes) {
        if (changes['tickets']) {
            if (changes['tickets'].currentValue.length > 0) {
                this.ticketList = changes['tickets'].currentValue.map(item => Object.assign({}, item, { checked: false }));
                console.log('tickets>>', this.ticketList);
            }
        }
    }

    stopPropagation (event) {
        event.stopPropagation();
    }

    updateTicket (data) {
        this.change.emit(data);
    }

    getTicketDetails (ticket) {
        this.router.navigate(['/ticket-details', ticket.id]);
    }

    getPhotoUrl (ticket) {
        if (ticket.photo != null && ticket.photo.length > 0) {
            return ticket.photo;
        }
        return 'assets/img/placeholders/avatars/avatar12.jpg';
    }

    // onAllCheckboxChange (event) {
    //     // event.target.value = !event.target.value;

    //     console.log('all', event.target.checked);
    //     this.ticketList.map(item => item.checked = event.target.checked)
    // }

    onChangeCheckbox (value) {
        // console.log('Valu', value);
        // let all = this.ticketList.every(item => item.checked);

        // all && this.allCheckbox.setValue(all);
    }

    onModalConfirm (value) {
        let checkedOne = this.ticketList.some(item => item.checked);
        if (!checkedOne) {
            $('#' + value).modal({
                show: true,
                backdrop: 'static'
            })
            return;
        }

        const user = this.storage.getUserInfo();
        const checkedTicketList: any[] = this.ticketList.filter(item => item.checked);

        let displayTicketsMsg: any[] = [];
        let counter = 0;
        checkedTicketList && checkedTicketList.forEach(ticket => {
            displayTicketsMsg.push(ticket.ticket_key);

            ticket.assigned_to = `${config.api.base}employee/${user.user_id}/`;
            ticket.url = `${config.api.base}ticket/${ticket.id}/`;
            ticket.status = 'Open';
            this.ticketService.update(ticket, false).subscribe(() => {
                if (++counter == checkedTicketList.length) {
                    this.toasterService.pop('success', 'Accept', `${displayTicketsMsg.join(', ')} Ticket${checkedTicketList.length == 1 ? '' : '\'s'} has been Accepted successfully`);
                }
            });

            let note = {
                workorder: `${config.api.base}ticket/${ticket.id}/`,
                action_type: 'accept',
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

    onModalAssignTicket (value) {
        let checkedOne = this.ticketList.some(item => item.checked);
        // const modalId = checkedOne ? value : 'modal-confirm';
        if (!checkedOne) {
            $('#modal-confirm').modal({
                show: true,
                backdrop: 'static'
            })
            return;
        }

        $('#' + value).modal({
            show: true,
            backdrop: 'static'
        })
    }

    onModalCloseTicket (value) {
        let checkedOne = this.ticketList.some(item => item.checked);
        // const modalId = checkedOne ? value : 'modal-confirm';
        if (!checkedOne) {
            $('#modal-confirm').modal({
                show: true,
                backdrop: 'static'
            })
            return;
        }

        $('#' + value).modal({
            show: true,
            backdrop: 'static'
        })
    }
    onModalDeleteTicket (modalId) {
        let checkedOne = this.ticketList.some(item => item.checked);
        // const modalId = checkedOne ? value : 'modal-confirm';
        if (!checkedOne) {
            $('#modal-confirm').modal({
                show: true,
                backdrop: 'static'
            })
            return;
        }

        $('#' + modalId).modal({
            show: true,
            backdrop: 'static'
        })
    }

    onDeleteModalOkButtonClick (event) {
        const checkedTicketList: any[] = this.ticketList.filter(item => item.checked);

        let displayTicketsMsg: any[] = [];
        let counter = 0;
        checkedTicketList && checkedTicketList.forEach(ticket => {
            displayTicketsMsg.push(ticket.ticket_key);
            ticket.assigned_to && delete ticket.assigned_to;

            ticket.url = `${config.api.base}ticket/${ticket.id}/`;
            ticket.status = 'Deleted';
            ticket.is_deleted = true;
            this.ticketService.update(ticket, false).subscribe(() => {
                if (++counter == checkedTicketList.length) {
                    $('#modal-delete-ticket').modal('hide');
                    this.ticketService.updateTicketList(true);
                    this.toasterService.pop('success', 'Delete?', `${displayTicketsMsg.join(', ')} Ticket${checkedTicketList.length == 1 ? '' : '\'s'} has been deleted successfully`);
                }
            }, error => {
                this.toasterService.pop('error', 'Delete?', `${displayTicketsMsg.join(', ')} Ticket${checkedTicketList.length == 1 ? '' : '\'s'} are not deleted`);
            });
        })
    }
}
