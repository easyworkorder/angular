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

  problemTypes: any[] = [];
  currentCompanyId = 1;

  problemTypeForm = new FormGroup({
    id: new FormControl(),
    company: new FormControl(config.api.base + 'company/' + this.currentCompanyId + '/'),
    problem_name: new FormControl('', Validators.required),
    tenant_view: new FormControl(''),
    url: new FormControl()
  });

  constructor(
    private problemTypeService: ProblemTypeService,
    private authService: AuthenticationService) {
    this.authService.verifyToken().take(1).subscribe(data => {
      this.getAllProblemTypes(this.currentCompanyId);
    });
  }

  ngOnInit() {
  }

  getAllProblemTypes(company_id): void {
    this.problemTypeService.getAllProblemTypes(company_id).subscribe(
      data => {
        this.problemTypes = data.results;
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
  }

  closeModal() {
    this.resetForm();
    $('#modal-add-problem-type').modal('hide');
  }

  resetForm() {
    this.problemTypeForm.reset({ company: config.api.base + 'company/' + this.currentCompanyId + '/' });
  }
}

