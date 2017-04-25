import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { TicketService } from './ticket.service';
import { DataService } from "app/services";
import { ActivatedRoute } from "@angular/router";
import { AuthenticationService } from "app/modules/authentication";
import { FormBuilder, FormControl, Validators, FormGroup } from "@angular/forms";
import { ValidationService } from 'app/services/validation.service';
import config from '../../config';
import { UpdateTicketMaterialService } from './ticket-material.service';
declare var $: any;

@Component({
    selector: "ewo-ticket-material",
    templateUrl: './ticket-material.component.html'
})
export class TicketMaterialComponent implements OnInit {
    toDeletedMaterial: any;
    @Input() ticket: any;
    @Input() isClosedTicket = false;
    @Input() materials: any;
    @Input() updateTicketMaterialInfo: any;
    @Output('update') change: EventEmitter<any> = new EventEmitter<any>();
    _submitted = false;
    ticketId: number;
    isMaterialDateValid: boolean = true;
    constructor(
        private ticketService: TicketService,
        private formBuilder: FormBuilder,
        private authService: AuthenticationService,
        private route: ActivatedRoute,
        private dataService: DataService,
        private updateTicketMaterialService: UpdateTicketMaterialService) {

        this.updateTicketMaterialService.updateMaterialInfo$.subscribe(data => {
            this.updateTicketMaterialInfo = data;
            this.ticketMaterialForm.patchValue(this.updateTicketMaterialInfo);
        });
    }
    ngOnInit () {
        this.ticketId = this.route.snapshot.params['id'];
        $('#modal-ticket-material').on('hidden.bs.modal', () => {
            this.closeModal();
        });
    }
    ticketMaterialForm = new FormGroup({
        id: new FormControl(),
        url: new FormControl(''),
        workorder: new FormControl(''),
        date: new FormControl('', Validators.required),
        description: new FormControl('', Validators.required),
        cost_each: new FormControl('', Validators.required),
        quantity: new FormControl('', Validators.required),
        is_billable: new FormControl(true),
        gl_code: new FormControl(''),
    });

    onSubmit () {
        this._submitted = true;
        this.isMaterialDateValid = false;

        if (this.dataService.dateValidation(this.ticketMaterialForm.get('date'))) {
            this.isMaterialDateValid = true;
        } else {
            this.isMaterialDateValid = false;
            return;
        }

        if (!this.ticketMaterialForm.valid) { return; }

        // Update Material
        if (this.ticketMaterialForm.value.id) {
            this.ticketService.updateMaterial(this.ticketMaterialForm.value).subscribe((material: any) => {
                this.ticketService.updateTicket(true);
                this._submitted = false;
                this.change.emit(true);
                this.closeModal();
            });
            return;
        }

        // Add Material
        this.ticketMaterialForm.get('workorder').setValue(`${config.api.base}ticket/${this.ticket.id}/`);
        this.ticketMaterialForm.removeControl('id');
        if (this.ticketMaterialForm.value.url)
            delete this.ticketMaterialForm.value.url;

        this.ticketService.createMaterial(this.ticketMaterialForm.value).subscribe((material: any) => {
            this.ticketService.updateTicket(true);
            this._submitted = false;
            this.closeModal();
            this.change.emit(true);
        });
        this.ticketMaterialForm.addControl('id', new FormControl());
    }


    editMaterial (material) {
        material.date = material.date.toDate();
        this.ticketMaterialForm.patchValue(material);
    }

    closeModal () {
        $('#modal-ticket-material').modal('hide');
        this.resetForm();
    }

    resetForm () {
        this.ticketMaterialForm.reset({
            is_billable: true
        });
    }
    onSelectDate (value) {
        this.isMaterialDateValid = true;
    }
    onModalOkButtonClick (event) {
        if (this.toDeletedMaterial) {
            this.ticketService.deleteMaterial(this.toDeletedMaterial).subscribe(data => {
                $('#modal-material-delete-confirm').modal('hide');
                this.ticketService.updateTicket(true);
                this.change.emit(true);
            })
        }
    }
}
