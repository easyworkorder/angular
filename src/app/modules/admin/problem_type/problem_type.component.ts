import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import config from '../../../config';
import { ProblemTypeService } from './problem_type.service';
import { AuthenticationService } from "app/modules/authentication";
import { BreadcrumbHeaderService } from "app/modules/shared/breadcrumb-header/breadcrumb-header.service";

declare var $: any;

@Component({
    selector: 'ewo-problem-type-list',
    templateUrl: 'problem_type.component.html',
    styles: [`
        .problem-type-form-wrapper .control-label {
            text-align: left !important;
        }
    `]
})

export class ProblemTypeComponent implements OnInit {
    isShowingLoadingSpinner: boolean = true;
    // problemTypes: any[] = [];
    problemTypesList1: any[] = [];
    problemTypesList2: any[] = [];
    currentCompanyId = 1;
    isDeleted: boolean = false;

    problemTypeForm = new FormGroup({
        id: new FormControl(),
        company: new FormControl(config.api.base + 'company/' + this.currentCompanyId + '/'),
        problem_name: new FormControl('', Validators.required),
        tenant_view: new FormControl(false),
        active: new FormControl('true'),
        url: new FormControl()
    });

    searchControl = new FormControl('');

    constructor(
        private problemTypeService: ProblemTypeService,
        private authService: AuthenticationService,
        private breadcrumbHeaderService: BreadcrumbHeaderService) {
        this.authService.verifyToken().take(1).subscribe(data => {
            this.getAllProblemTypes(this.currentCompanyId);
        });
    }

    ngOnInit() {
        $('#modal-add-problem-type').on('hidden.bs.modal', () => {
            this.closeModal();
        });
        this.breadcrumbHeaderService.setBreadcrumbTitle('Problem Types');
    }

    getAllProblemTypes(company_id): void {
        this.isShowingLoadingSpinner = true;
        this.problemTypeService.getAllActiveProblemTypes(company_id).subscribe(
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

                this.isShowingLoadingSpinner = false;
            }
        );
    }

    editProblemType(problemType) {
        this.problemTypeForm.setValue(problemType);
    }

    removeProblemType(problemType) {
        problemType.active = false;
        this.problemTypeForm.setValue(problemType);
        this.isDeleted = true;
    }

    onSubmit() {
        if (this.problemTypeForm.value.id) {
            this.problemTypeService.update(this.problemTypeForm.value, this.isDeleted).subscribe((problemType: any) => {
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
        this.isDeleted = false;
        $('#modal-add-problem-type').modal('hide');
        $('#modal-remove-problem-type').modal('hide');
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

