import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import config from '../../../config';
import { ProblemTypeService } from './problem_type.service';
import { AuthenticationService } from "app/modules/authentication";

declare var $: any;

@Component({
    selector: 'ewo-problem-type-list',
    templateUrl: 'problem_type.component.html',
})

export class ProblemTypeComponent implements OnInit {

    // problemTypes: any[] = [];
    problemTypesList1: any[] = [];
    problemTypesList2: any[] = [];
    currentCompanyId = 1;

    problemTypeForm = new FormGroup({
        id: new FormControl(),
        company: new FormControl(config.api.base + 'company/' + this.currentCompanyId + '/'),
        problem_name: new FormControl('', Validators.required),
        tenant_view: new FormControl(false),
        active: new FormControl('true'),
        url: new FormControl()
    });

    problemTypeSearchControl = new FormControl('');

    constructor(
        private problemTypeService: ProblemTypeService,
        private authService: AuthenticationService) {
        this.authService.verifyToken().take(1).subscribe(data => {
            this.getAllProblemTypes(this.currentCompanyId);
        });
    }

    ngOnInit() {
        $('#modal-add-problem-type').on('hidden.bs.modal', () => {
            this.closeModal();
        });
    }

    getAllProblemTypes(company_id): void {
        this.problemTypeService.getAllProblemTypes(company_id).subscribe(
            data => {
                // this.problemTypes = data.results;

                const results: any[] = data.results;
                let temp = results.sort((a: any, b: any) => {
                    if (a.problem_name.toLowerCase() < b.problem_name.toLowerCase()) return -1;
                    if (a.problem_name.toLowerCase() > b.problem_name.toLowerCase()) return 1;
                    return 0;
                });

                var half_length = Math.ceil(temp.length / 2);
                this.problemTypesList1 = temp.slice(0, half_length);
                this.problemTypesList2 = temp.slice(half_length);
            }
        );
    }

    editProblemType(problemType) {
        this.problemTypeForm.setValue(problemType);
    }

    onSubmit() {
        // console.log(this.problemTypeForm.value);
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
    }

    closeModal() {
        this.resetForm();
        $('#modal-add-problem-type').modal('hide');
    }

    resetForm() {
        this.problemTypeForm.reset({
            company: config.api.base + 'company/' + this.currentCompanyId + '/',
            problem_name: '',
            tenant_view: false,
            active: 'true',
        });
    }
}

