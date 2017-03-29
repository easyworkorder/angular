import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';

import config from '../../../config';
import {SLAPolicyService} from './sla_policy.service';
import {AuthenticationService} from "app/modules/authentication";

declare var $: any;

@Component({
    selector: 'ewo-sla-policy-list',
    templateUrl: 'sla_policy.component.html',
})

export class SLAPolicyComponent implements OnInit {

    sla_policy: any[] = [];
    currentCompanyId = 1;

    constructor(private slaPolicyService: SLAPolicyService,
                private formBuilder: FormBuilder,
                private authService: AuthenticationService) {
        this.authService.verifyToken().take(1).subscribe(data => {
            //this.getSlaPolicy(this.currentCompanyId);
        });
    }

    ngOnInit() {

    }
/*
    slaForm = this.formBuilder.group({
        id: new FormControl(),
        company: new FormControl(config.api.base + 'company/' + this.currentCompanyId + '/'),
        name: new FormControl('', Validators.required),
        description: new FormControl('', Validators.required),
        url: new FormControl(),
        sla_target: this.formBuilder.array(
            [this.buildSlaTarget('Urgent', '', '', '', '', '', false)],
            [this.buildSlaTarget('Urgent', '', '', '', '', '', false)],
            null
        )
    });

    buildSlaTarget(priority: string, respond_within: string, respond_within_unit: string, resolve_within: string,
                   resolve_within_unit: string, operational_hours: string, escalation_email: boolean) {
        return new FormGroup({
            priority: new FormControl(priority),
            respond_within: new FormControl(respond_within, Validators.required),
            respond_within_unit: new FormControl(respond_within_unit),
            resolve_within: new FormControl(resolve_within, Validators.required),
            resolve_within_unit: new FormControl(resolve_within_unit),
            operational_hours: new FormControl(operational_hours),
            escalation_email: new FormControl(false)
        });
    }

    getSlaPolicy(company_id): void {
        this.slaPolicyService.getSlaPolicy(company_id).subscribe(
            data => {
                this.sla_policy = data.results;
            }
        );
    }

    editProblemType(problemType) {
        this.problemTypeForm.setValue(problemType);
    }

    onSubmit() {
        if (this.problemTypeForm.value.id) {
            this.problemTypeService.update(this.problemTypeForm.value).subscribe((problemType: any) => {
                this.getAllProblemTypes(this.currentCompanyId);
                this.closeModal();
            });
            return;
        }

        this.problemTypeService.create(this.problemTypeForm.value).subscribe((problemType: any) => {
            this.getAllProblemTypes(this.currentCompanyId);
            this.closeModal();
        });
    }*/
}

