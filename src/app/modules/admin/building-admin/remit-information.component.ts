import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BuildingService } from "app/modules/admin/building/building.service";
declare var $: any;

@Component({
  selector: 'ewo-remit-information',
  templateUrl: './remit-information.component.html',
  styleUrls: ['./remit-information.component.css']
})

export class RemitInformationComponent implements OnInit {
  @Input() editRemitInfo: any;
  @Output('update') change: EventEmitter<any> = new EventEmitter<any>();

  buildingForm = new FormGroup({
    id: new FormControl(),
    remit_company: new FormControl(''),
    remit_addr: new FormControl('', [Validators.required]),
    remit_city: new FormControl('', Validators.required),
    remit_state: new FormControl('', Validators.required),
    remit_postal_code: new FormControl('', Validators.required),
    url: new FormControl()
  });

  constructor(private buildingService: BuildingService) { }

  ngOnInit() {
    this.buildingForm.setValue({
      id: this.editRemitInfo.id,
      remit_company: this.editRemitInfo.remit_company,
      remit_addr: this.editRemitInfo.remit_addr,
      remit_city: this.editRemitInfo.remit_city,
      remit_state: this.editRemitInfo.remit_state,
      remit_postal_code: this.editRemitInfo.remit_postal_code,
      url: this.editRemitInfo.url
    });
  }

  onSubmit() {
    if (!this.buildingForm.valid) return;

    if (this.buildingForm.value.id) {
      this.buildingService.update(this.buildingForm.value).subscribe((building: any) => {
        this.change.emit(true);
        this.closeModal();
      });
    }
  }

  closeModal() {
    $('#modalEditRemitInfo').modal('hide');
  }
}
