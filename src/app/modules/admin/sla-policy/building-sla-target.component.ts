import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import config from '../../../config';
import { FormBuilder, Validators, FormGroup, FormArray } from "@angular/forms";
import { SLAPolicyService } from "app/modules/admin/sla-policy/sla-policy.service";
import { ToasterService } from "angular2-toaster/angular2-toaster";
declare var $: any;

@Component({
  selector: 'ewo-building-sla-target',
  templateUrl: './building-sla-target.component.html',
})
export class BuildingSlaTargetComponent implements OnInit {
  buildingPolicyForm: FormGroup;
  @Input() buildingSLATargets: any;
  @Output('update') change: EventEmitter<any> = new EventEmitter<any>();

  selectedRespondWithinUnit: any = [];
  selectedResolveWithinUnit: any = [];
  selectedOperationHours: any = [];

  respondWithInUnit: any[] = config.slaPolicy.respondAndResolveWithInUnit;
  resolveWithinUnit: any[] = config.slaPolicy.respondAndResolveWithInUnit;
  OperationHours: any[] = config.slaPolicy.OperationHours;

  constructor(
    private fb: FormBuilder,
    // private breadcrumbHeaderService: BreadcrumbHeaderService,
    private slaPolicyService: SLAPolicyService,
    private toasterService: ToasterService
  ) {
  }

  ngOnInit () {
    this.buildingPolicyForm = this.fb.group({
      buildingTargets: this.fb.array([])
    });
    this.getSLAPolicy();
  }

  get buildingTargets (): FormArray {
    return <FormArray>this.buildingPolicyForm.get('buildingTargets');
  }

  buildSlaTarget (url: string, id: any, buildingId: string, priority: string, priorespond_withinrity: string, respond_within_unit: string,
    resolve_within: string, resolve_within_unit: string, operational_hours: string, escalation_email: any = false): FormGroup {
    return this.fb.group({
      url: url,
      id: id,
      building: buildingId,
      priority: priority,
      respond_within: [priorespond_withinrity, [Validators.required]],
      respond_within_unit: respond_within_unit,
      resolve_within: [resolve_within, [Validators.required]],
      resolve_within_unit: resolve_within_unit,
      operational_hours: operational_hours,
      escalation_email: escalation_email
    });
  }

  getSLAPolicy () {
    // this.slaPolicyService.getBuildingSLAPolicy(this.buildingId).map(data => data.results).subscribe(data => {
    let slaPolicy = this.buildingSLATargets;


    let _slaTargets = slaPolicy;

    _slaTargets.forEach(item => {
      this.buildingTargets.push(this.buildSlaTarget(item.url, item.id, item.building, item.priority, item.respond_within,
        item.respond_within_unit, item.resolve_within, item.resolve_within_unit, item.operational_hours, item.escalation_email));
      this.respondWithInUnit.forEach(data => {
        if (data.text == item.respond_within_unit) {
          this.selectedRespondWithinUnit.push({ id: item.id, selected: [data] });
        }
      });

      this.resolveWithinUnit.forEach(data => {
        if (data.text == item.resolve_within_unit) {
          this.selectedResolveWithinUnit.push({ id: item.id, selected: [data] });
        }
      });

      this.OperationHours.forEach(data => {
        if (data.text == item.operational_hours) {
          this.selectedOperationHours.push({ id: item.id, selected: [data] });
        }
      });
      // });
    });
    // })
  }


  onSubmit () {
    if (!this.buildingPolicyForm.valid) return;

    // this.slaPolicyForm.get('company_sla_policy_targets').valid

    const tmpSlaTargets = this.buildingPolicyForm.value.buildingTargets;

    tmpSlaTargets.forEach(item => {
      const respondUnit = this.selectedRespondWithinUnit.find(val => val.id == item.id);
      const resolveUnit = this.selectedResolveWithinUnit.find(val => val.id == item.id);
      const opertionHr = this.selectedOperationHours.find(val => val.id == item.id);

      item.respond_within_unit = respondUnit.selected[0].text;
      item.resolve_within_unit = resolveUnit.selected[0].text;
      item.operational_hours = opertionHr.selected[0].text;
    })

    // this.slaPolicyService.updateBuildingSLATarget(this.buildingPolicyForm.value.buildingTargets);
    let count = 0;
    this.buildingPolicyForm.value.buildingTargets.forEach(item => {
      this.slaPolicyService.updateBuildingSLATarget(item).subscribe(data => {
        count++;
        if (count == this.buildingPolicyForm.value.buildingTargets.length) {
          this.closeModal();
          this.change.emit(true);
          this.toasterService.pop('success', 'UPDATE', 'Building SLA Target has been updated successfully');
        }
      }, error => {
        this.toasterService.pop('error', 'UPDATE', 'Building SLA Target not updated due to API error!!!');
      })
    })

  }

  public onSelectedRespondWithInUnit (index: any, selectedItem: any): void {
    this.selectedRespondWithinUnit[index].selected = [{ id: selectedItem.id, text: selectedItem.text }];
  }

  public onSelectedResolveWithInUnit (index: any, selectedItem: any): void {
    this.selectedResolveWithinUnit[index].selected = [{ id: selectedItem.id, text: selectedItem.text }];
  }

  public onSelectedOperationHours (index: any, selectedItem: any): void {
    this.selectedOperationHours[index].selected = [{ id: selectedItem.id, text: selectedItem.text }];
  }

  closeModal () {
    $('#modalBuildingSLAInfo').modal('hide');
  }

}
