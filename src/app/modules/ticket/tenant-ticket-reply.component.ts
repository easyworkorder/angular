import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { TicketService } from "app/modules/ticket/ticket.service";
import { ToasterService } from "angular2-toaster/angular2-toaster";
import config from '../../config';
import {
    Storage
} from './../../services/index';
declare var $: any;

@Component({
    selector: 'ewo-tenant-ticket-reply',
    template: `
     <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                <h3 class="modal-title"><i class="fa fa-plus"></i> <strong>Reply</strong></h3>
            </div>
            <!-- this is a new comment  -->
            <div class="modal-body">
                <form [formGroup]="ticketPublicForm" (ngSubmit)="onPublicSubmit()" class="form-horizontal">
                   <!-- <div class="form-group">
                        <label class="col-sm-6 col-md-4 col-lg-3 control-label" for="tenant_list">Tenant <span class="required">*</span></label>
                        <div class="col-sm-6 col-md-8 col-lg-9">
                            <ng-select id="tenant_list" [multiple]="true" [items]="tenant_contacts" (selected)="selectedTenantList($event)" (removed)="removedTenantList($event)"
                                placeholder="Choose Reciptient(s)" [active]="selectedTenant"></ng-select>
                            <span *ngIf="_publicFormSubmitted && (selectedTenant.length == 0)" class="validation-error">This field is Required</span>
                        </div>
                    </div>-->

                    <div class="form-group">
                        <label class="col-sm-6 col-md-4 col-lg-3 control-label" for="details">Note <span class="required">*</span> </label>
                        <div class="col-sm-6 col-md-8 col-lg-9">
                            <textarea id="details" [formControlValidator]="ticketPublicForm.controls.details" formControlName="details" name="details"
                                rows="7" class="form-control" placeholder="Note..."></textarea>
                            <span class="validation-error">{{ticketPublicForm.controls.details.error}}</span>
                        </div>
                    </div>
                    <div class="form-group form-actions">
                        <div class="col-xs-12 text-right">
                            <button type="submit" class="btn btn-effect-ripple btn-success" [disabled]="isSubmit">Submit<i *ngIf="isSubmit" class="fa fa-spinner fa-spin"></i></button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
    `
})
export class TenantTicketReplyComponent implements OnInit {
    @Input() ticket: any;
    isSubmit: boolean = false;
    ticketPublicForm = new FormGroup({
        id: new FormControl(),
        url: new FormControl(''),
        workorder: new FormControl(''),
        details: new FormControl('', Validators.required),
        tenant_list: new FormControl(''),
        updated_by_type: new FormControl('TU'),
        is_private: new FormControl(false),
        tenant_notified: new FormControl(false),
        tenant_follow_up: new FormControl(true),
        vendor_notified: new FormControl(false),
        vendor_follow_up: new FormControl(false),
        action_type: new FormControl('tenant_reply')
    });

    constructor(
        private storage: Storage,
        private ticketService: TicketService,
        private toasterService: ToasterService
    ) { }

    ngOnInit () {
    }
    onPublicSubmit () {
        // this._publicFormSubmitted = true;
        if (!this.ticketPublicForm.valid) {
            return;
        }
        this.isSubmit = true;
        this.ticketPublicForm.get('workorder').setValue(`${config.api.base}ticket/${this.ticket.id}/`);
        this.ticketService.createNote(this.ticketPublicForm.value, true).subscribe((note: any) => {
            this.isSubmit = false;
            // this.change.emit(true);
            this.closeModal();
        });
    }

    closeModal () {
        this.ticketPublicForm.reset({
            is_private: false,
            tenant_notified: false,
            tenant_follow_up: true,
            vendor_notified: false,
            vendor_follow_up: false,
            action_type: 'tenant_reply',
            updated_by_type: 'TU'
        });

        $('#modal-tenant-ticket-reply').modal('hide');

    }
}