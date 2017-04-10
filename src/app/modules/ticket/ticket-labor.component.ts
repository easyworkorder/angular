import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { TicketService } from './ticket.service';
import { DataService } from "app/services";
import { ActivatedRoute } from "@angular/router";
import { AuthenticationService } from "app/modules/authentication";
import { FormBuilder, FormControl, Validators, FormGroup } from "@angular/forms";
import { ValidationService } from 'app/services/validation.service';
import config from '../../config';
import { UpdateTicketLaborService } from './ticket-labor.service';
declare var $: any;

@Component({
    selector: "ewo-ticket-labor",
    templateUrl: './ticket-labor.component.html'
})
export class TicketLaborComponent implements OnInit {
    @Input() ticket: any;
    @Input() labors: any;
    @Input() employees: any;
    @Input() updateTicketLaborInfo: any;
    @Output('update') change: EventEmitter<any> = new EventEmitter<any>();
    // @Output('updatePeople') changePeople: EventEmitter<any> = new EventEmitter<any>();
    _submitted = false;
    employee: any[] = [];
    ticketId: number;

    photoFile: File
    selectedPhotoFile:string = '';

    constructor(
        private ticketService: TicketService,
        private formBuilder: FormBuilder,
        private authService: AuthenticationService,
        private route: ActivatedRoute,
        private dataService: DataService,
        private updateTicketLaborService: UpdateTicketLaborService) {
        this.updateTicketLaborService.updateLaborInfo$.subscribe(data => {
            this.updateTicketLaborInfo = data;
            this.ticketLaborForm.setValue(this.updateTicketLaborInfo);
        });
    }

    ngOnInit() {
        this.ticketId = this.route.snapshot.params['id'];
        $('#add-ticket-labor').on('hidden.bs.modal', () => {
            this.closeModal();
        });
    }

    ticketLaborForm = new FormGroup({
        id: new FormControl(),
        url: new FormControl(''),
        workorder: new FormControl(''),
        employee: new FormControl('', Validators.required),
        work_date: new FormControl('', Validators.required),
        work_description: new FormControl('', Validators.required),
        billable_hours: new FormControl('', Validators.required),
        billing_amount: new FormControl('', Validators.required),
        is_billable: new FormControl(true),
        gl_code: new FormControl(''),
    });

    onSubmit() {
        this._submitted = true;
        if (!this.ticketLaborForm.valid) { return; }

        // Update Labor
         if (this.ticketLaborForm.value.id) {
             this.ticketService.updateLabor(this.ticketLaborForm.value).subscribe((labor: any) => {
                 this.change.emit(true);
                 this.closeModal();
             });
             return;
         }

        // Add Labor
         this.ticketLaborForm.get('workorder').setValue(`${config.api.base}ticket/${this.ticket.id}/`);
         // let val = this.ticketLaborForm.value;
         this.ticketLaborForm.removeControl('id');
         this.ticketService.createLabor(this.ticketLaborForm.value).subscribe((labor: any) => {
             // console.log('Tenant created', tenant);
        //     // this.getAllTenantsByBuilding(this.buildingId);
        //     // this.isSuccess = true;

             this.change.emit(true);
             this.closeModal();
         });
         this.ticketLaborForm.addControl('id', new FormControl());

    }

    public selectedEmployee(value: any): void {
        this.employee = [value];
        this.ticketLaborForm.get('employee').setValue(config.api.base + 'employee/' + this.employee[0].id + '/');
    }


    editLabor(labor) {
        console.log(labor);
        this.ticketLaborForm.patchValue(labor);
        console.log(this.ticketLaborForm.value);
    }

    closeModal() {
        this.resetForm();
        $('#add-ticket-labor').modal('hide');
    }

    resetForm() {
        this.ticketLaborForm.reset({
            is_billable: true
        });
    }
}
