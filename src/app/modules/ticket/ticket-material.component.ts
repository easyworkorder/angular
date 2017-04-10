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
    @Input() ticket: any;
    @Input() materials: any;
    @Input() updateTicketMaterialInfo: any;
    @Output('update') change: EventEmitter<any> = new EventEmitter<any>();
    _submitted = false;
    ticketId: number;

    constructor(
        private ticketService: TicketService,
        private formBuilder: FormBuilder,
        private authService: AuthenticationService,
        private route: ActivatedRoute,
        private dataService: DataService,
        private updateTicketMaterialService: UpdateTicketMaterialService) {

        this.updateTicketMaterialService.updateMaterialInfo$.subscribe(data => {
            this.updateTicketMaterialInfo = data;
            this.ticketMaterialForm.setValue(this.updateTicketMaterialInfo);
        });
    }

    ngOnInit() {
        this.ticketId = this.route.snapshot.params['id'];
        $('#add-ticket-material').on('hidden.bs.modal', () => {
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

    onSubmit() {
        this._submitted = true;
        if (!this.ticketMaterialForm.valid) { return; }

        // Update Material
         if (this.ticketMaterialForm.value.id) {
             this.ticketService.updateMaterial(this.ticketMaterialForm.value).subscribe((material: any) => {
                 this.change.emit(true);
                 this.closeModal();
             });
             return;
         }

        // Add Material
         this.ticketMaterialForm.get('workorder').setValue(`${config.api.base}ticket/${this.ticket.id}/`);
         // let val = this.ticketMaterialForm.value;
         this.ticketMaterialForm.removeControl('id');
         this.ticketService.createMaterial(this.ticketMaterialForm.value).subscribe((material: any) => {
             // console.log('Tenant created', tenant);
        //     // this.getAllTenantsByBuilding(this.buildingId);
        //     // this.isSuccess = true;

             this.change.emit(true);
             this.closeModal();
         });
         this.ticketMaterialForm.addControl('id', new FormControl());

    }


    editMaterial(material) {
        console.log(material);
        this.ticketMaterialForm.patchValue(material);
        console.log(this.ticketMaterialForm.value);
    }

    closeModal() {
        this.resetForm();
        $('#add-ticket-material').modal('hide');
    }

    resetForm() {
        this.ticketMaterialForm.reset({
            is_billable: true
        });
    }
}
