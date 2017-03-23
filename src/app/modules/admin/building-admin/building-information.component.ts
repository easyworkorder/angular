import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BuildingService } from "app/modules/admin/building/building.service";
declare var $: any;

@Component({
  selector: 'ewo-building-information',
  templateUrl: './building-information.component.html',
  styleUrls: ['./building-information.component.css']
})
export class BuildingInformationComponent implements OnInit {
  @Input() editBuildingInfo: any;
  @Output('update') change: EventEmitter<any> = new EventEmitter<any>();

  buildingForm = new FormGroup({
    id: new FormControl(),
    name: new FormControl(''),
    // sqfootage: new FormControl('', [Validators.required, ValidationService.numericValidator]),
    sqfootage: new FormControl('', [Validators.required]),
    address: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    postal_code: new FormControl('', Validators.required),
    // mgt_fee_percent: new FormControl('', [Validators.required, ValidationService.percentValidator]),
    mgt_fee_percent: new FormControl('', [Validators.required]),
    url: new FormControl()
  });

  constructor(private buildingService: BuildingService) { }

  ngOnInit() {
    this.buildingForm.setValue({
      id: this.editBuildingInfo.id,
      name: this.editBuildingInfo.name,
      sqfootage: this.editBuildingInfo.sqfootage,
      address: this.editBuildingInfo.address,
      city: this.editBuildingInfo.city,
      state: this.editBuildingInfo.state,
      postal_code: this.editBuildingInfo.postal_code,
      mgt_fee_percent: this.editBuildingInfo.mgt_fee_percent,
      url: this.editBuildingInfo.url
    });
  }

  onSubmit() {
    if (!this.buildingForm.valid) return;

    if (this.buildingForm.value.id) {
      this.buildingService.update(this.buildingForm.value).subscribe((building: any) => {
        this.change.emit(true);
        this.closeModal();
      });
      return;
    }
  }

  closeModal() {
    $('#modalEditBuildingInfo').modal('hide');
  }
}
