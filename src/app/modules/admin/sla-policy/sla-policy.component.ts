import { Component, OnInit } from '@angular/core';
import { BreadcrumbHeaderService } from "app/modules/shared/breadcrumb-header/breadcrumb-header.service";
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { SLAPolicyService } from "app/modules/admin/sla-policy/sla-policy.service";
import config from '../../../config';

@Component({
    selector: 'ewo-sla-policy',
    templateUrl: './sla-policy.component.html',
    styleUrls: ['./sla-policy.component.css']
})
export class SLAPolicyComponent implements OnInit {
    currentCompanyId = 1;
    slaPolicyForm: FormGroup;
    slaPolicy: any;

    selectedRespondWithinUnit: any = [];
    selectedResolveWithinUnit: any = [];
    selectedOperationHours: any = [];

    respondWithInUnit: any[] = config.slaPolicy.respondAndResolveWithInUnit;
    resolveWithinUnit: any[] = config.slaPolicy.respondAndResolveWithInUnit;
    OperationHours: any[] = config.slaPolicy.OperationHours;

    constructor(
        private fb: FormBuilder,
        private breadcrumbHeaderService: BreadcrumbHeaderService,
        private slaPolicyService: SLAPolicyService
    ) {
    }

    ngOnInit() {
        this.breadcrumbHeaderService.setBreadcrumbTitle('SLA Policies');

        this.slaPolicyForm = this.fb.group({
            company: '',
            name: ['', [Validators.required]],
            description: ['', [Validators.required]],
            url: '',
            company_sla_policy_targets: this.fb.array([])
        });
        this.getSLAPolicy();
    }

    getSLAPolicy() {
        const company = this.currentCompanyId;
        this.slaPolicyService.getCompanySLAPolicy(company).map(data => data.results).subscribe(data => {
            this.slaPolicy = data[0];
            this.slaPolicyForm.patchValue({
                company: this.slaPolicy.company,
                name: this.slaPolicy.name,
                description: this.slaPolicy.description,
                url: this.slaPolicy.url
            });

            let _slaTargets = this.slaPolicy.company_sla_policy_targets;
            // console.table(_slaTargets);

            _slaTargets.forEach(item => {
                this.company_sla_policy_targets.push(this.buildSlaTarget(item.id, item.sla, item.priority, item.respond_within,
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
            });
        });
    }

    get company_sla_policy_targets(): FormArray {
        return <FormArray>this.slaPolicyForm.get('company_sla_policy_targets');
    }

    buildSlaTarget(id: any, sla: string, priority: string, priorespond_withinrity: string, respond_within_unit: string,
        resolve_within: string, resolve_within_unit: string, operational_hours: string, escalation_email: any = false): FormGroup {
        return this.fb.group({
            id: id,
            sla: sla,
            priority: priority,
            respond_within: [priorespond_withinrity, [Validators.required]],
            respond_within_unit: respond_within_unit,
            resolve_within: resolve_within,
            resolve_within_unit: resolve_within_unit,
            operational_hours: operational_hours,
            escalation_email: escalation_email
        });
    }
    onSubmit() {
        console.log('Valid?', this.slaPolicyForm.get('company_sla_policy_targets').valid);
        if(!this.slaPolicyForm.valid) return;

        this.slaPolicyForm.get('company_sla_policy_targets').valid

        const tmpSlaTargets = this.slaPolicyForm.value.company_sla_policy_targets;

        tmpSlaTargets.forEach(item => {
            const respondUnit = this.selectedRespondWithinUnit.find(val => val.id == item.id);
            const resolveUnit = this.selectedResolveWithinUnit.find(val => val.id == item.id);
            const opertionHr = this.selectedOperationHours.find(val => val.id == item.id);

            item.respond_within_unit = respondUnit.selected[0].text;
            item.resolve_within_unit = resolveUnit.selected[0].text;
            item.operational_hours = opertionHr.selected[0].text;
        })

        this.slaPolicyService.updateSLAPolicy(this.slaPolicyForm.value);
    }

    public onSelectedRespondWithInUnit(index: any, selectedItem: any): void {
        this.selectedRespondWithinUnit[index].selected = [{ id: selectedItem.id, text: selectedItem.text }];
    }

    public onSelectedResolveWithInUnit(index: any, selectedItem: any): void {
        this.selectedResolveWithinUnit[index].selected = [{ id: selectedItem.id, text: selectedItem.text }];
    }

    public onSelectedOperationHours(index: any, selectedItem: any): void {
        this.selectedOperationHours[index].selected = [{ id: selectedItem.id, text: selectedItem.text }];
    }
}
