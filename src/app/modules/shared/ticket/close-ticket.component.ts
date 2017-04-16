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
    selector: 'ewo-close-ticket',
    template: `
     <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                <h3 class="modal-title"><i class="fa fa-plus"></i> <strong>Close Ticket</strong></h3>
            </div>
            <!-- this is a new comment  -->
            <div class="modal-body">
                <form [formGroup]="ticketCloseForm" (ngSubmit)="ticketCloseForm.valid && onCloseSubmit()" class="form-horizontal">
                    <div class="form-group">
                        <label class="col-sm-6 col-md-4 col-lg-3 control-label" for="close_note">Note <span class="required">*</span> </label>
                        <div class="col-sm-6 col-md-8 col-lg-9">
                            <textarea id="close_note" [formControlValidator]="ticketCloseForm.controls.details" formControlName="details" name="details" rows="7" class="form-control" placeholder="Close note"></textarea>
                            <span class="validation-error">{{ticketCloseForm.controls.details.error}}</span>
                        </div>
                    </div>

                    <div class="form-group form-actions">
                        <div class="col-xs-12 text-right">
                            <button type="submit" class="btn btn-effect-ripple btn-success" style="overflow: hidden; position: relative;">Save</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
    `
})
export class CloseTicketComponent implements OnInit {
    @Input() tickets: any[] = [];
    ticketList: any[] = [];
    ticketCloseForm = new FormGroup({
        id: new FormControl(),
        url: new FormControl(''),
        workorder: new FormControl(''),
        details: new FormControl('', Validators.required),
        updated_by_type: new FormControl(''),
        is_private: new FormControl(true),
        tenant_notified: new FormControl(false),
        tenant_follow_up: new FormControl(false),
        vendor_notified: new FormControl(false),
        vendor_follow_up: new FormControl(false),
        action_type: new FormControl('close')
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
                console.log('ticket Close>>', this.ticketList);
            }
        }
    }

    onCloseSubmit () {

        if (!this.ticketCloseForm.valid) return;

        const checkedTicketList: any[] = this.ticketList.filter(item => item.checked);

        let displayTicketsMsg: any[] = [];
        let counter = 0;
        checkedTicketList && checkedTicketList.forEach(ticket => {
            displayTicketsMsg.push(ticket.ticket_key);
            if (ticket.assigned_to)
                delete ticket.assigned_to;

            ticket.url = `${config.api.base}ticket/${ticket.id}/`;
            ticket.closed = true;
            ticket.status = 'Closed';
            this.ticketService.update(ticket, false).subscribe(() => {
                if (++counter == checkedTicketList.length) {
                    this.ticketService.updateTicketList(true);
                    this.toasterService.pop('success', 'Close', `${displayTicketsMsg.join(', ')} has been closed`);
                    this.closeModal();

                }
            },
                error => {
                    this.toasterService.pop('error', 'Close', `${displayTicketsMsg.join(', ')} not closed`);
                });

            this.ticketCloseForm.get('workorder').setValue(`${config.api.base}ticket/${ticket.id}/`);
            // this.ticketCloseForm.get('action_type').setValue('Close');

            this.ticketService.createNote(this.ticketCloseForm.value, false).subscribe(data => {
                // console.log('data>>>', data);
            });

        })

    }

    closeModal () {
        this.ticketCloseForm.reset({
            details: '',
            updated_by_type: '',
            is_private: true,
            tenant_notified: false,
            tenant_follow_up: false,
            vendor_notified: false,
            vendor_follow_up: false,
            action_type: 'close'
        });
        $('#modal-close-ticket').modal('hide');
    }
}
