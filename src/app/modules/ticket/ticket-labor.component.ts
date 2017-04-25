import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { TicketService } from './ticket.service';
import { DataService } from "app/services";
import { ActivatedRoute } from "@angular/router";
import { AuthenticationService } from "app/modules/authentication";
import { FormBuilder, FormControl, Validators, FormGroup } from "@angular/forms";
import { ValidationService } from 'app/services/validation.service';
import config from '../../config';
import { UpdateTicketLaborService } from './ticket-labor.service';
import { EmployeeService } from "app/modules/admin/employee/employee.service";
declare var $: any;

@Component({
    selector: "ewo-ticket-labor",
    templateUrl: './ticket-labor.component.html'
})
export class TicketLaborComponent implements OnInit {
    @Input() ticket: any;
    @Input() isClosedTicket = false;
    @Input() labors: any;
    @Input() employees: any;
    @Input() updateTicketLaborInfo: any;
    @Output('update') change: EventEmitter<any> = new EventEmitter<any>();
    // @Output('updatePeople') changePeople: EventEmitter<any> = new EventEmitter<any>();
    _submitted = false;
    selectedEmployee: any = [];
    ticketId: number;
    photoFile: File
    selectedPhotoFile: string = '';
    work_date_not_valid = false;

    toDeletedLabor: any;
    constructor(
        private ticketService: TicketService,
        private formBuilder: FormBuilder,
        private authService: AuthenticationService,
        private route: ActivatedRoute,
        private dataService: DataService,
        private updateTicketLaborService: UpdateTicketLaborService,
        private employeeService: EmployeeService) {
        this.updateTicketLaborService.updateLaborInfo$.subscribe(data => {
            this.updateTicketLaborInfo = data;
            this.ticketLaborForm.patchValue(this.updateTicketLaborInfo);
        });
    }
    ngOnInit () {
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

    onSubmit () {
        this._submitted = true;
        if (this.ticketLaborForm.get('work_date').errors) {
            this.work_date_not_valid = true;
        } else {
            this.work_date_not_valid = false;
        }

        if (!this.ticketLaborForm.valid) { return; }

        // Update Labor
        if (this.ticketLaborForm.value.id) {
            this.ticketService.updateLabor(this.ticketLaborForm.value).subscribe((labor: any) => {
                this.ticketService.updateTicket(true);
                this._submitted = false;
                this.change.emit(true);
                this.closeModal();
            });
            return;
        }

        // Add Labor
        this.ticketLaborForm.get('workorder').setValue(`${config.api.base}ticket/${this.ticket.id}/`);
        this.ticketLaborForm.removeControl('id');
        this.ticketService.createLabor(this.ticketLaborForm.value).subscribe((labor: any) => {
            this.ticketService.updateTicket(true);
            this._submitted = false;
            this.change.emit(true);
            this.closeModal();
        });
        this.ticketLaborForm.addControl('id', new FormControl());
    }
    public onSelectedEmployee (value: any): void {
        this.selectedEmployee = [value];
        this.ticketLaborForm.get('employee').setValue(config.api.base + 'employee/' + this.selectedEmployee[0].id + '/');
    }
    editLabor (labor) {
        labor.work_date = labor.work_date.toDate();
        this.setSelectedEmployee(labor.employee);
        this.ticketLaborForm.patchValue(labor);
    }
    deleteLabor (labor) {
        this.toDeletedLabor = labor;
    }
    closeModal () {
        this.resetForm();
        $('#modal-add-labor').modal('hide');
        this.selectedEmployee = [];
    }
    resetForm () {
        this.ticketLaborForm.reset({
            is_billable: true
        });
    }
    setSelectedEmployee (employeeUrl) {
        this.employeeService.getEmployeeByIdByUrl(employeeUrl).subscribe(data => {
            this.selectedEmployee = [{ id: data.id, text: (data.first_name + ' ' + data.last_name) }];
        });
    }
    onSelectDate (value) {
        this.work_date_not_valid = false;
    }
    onModalOkButtonClick (event) {
        if (this.toDeletedLabor) {
            this.ticketService.deleteLabor(this.toDeletedLabor).subscribe(data => {
                $('#modal-labor-delete-confirm').modal('hide');
                this.ticketService.updateTicket(true);
                this.change.emit(true);
            });
        }
    }
}
