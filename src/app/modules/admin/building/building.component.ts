import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import config from '../../../config';
import { EmployeeService } from './../employee/employee.service';
import { BuildingService } from './building.service';
import { ValidationService } from "../../../services/validation.service";
import { AuthenticationService } from "app/modules/authentication";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import { BreadcrumbHeaderService } from "app/modules/shared/breadcrumb-header/breadcrumb-header.service";
declare var $: any;

export class TabVisibility {
  isBuildingTabVisible = true;
  isContactTabVisible = false;
  selectedTabNo = 1;
}

@Component({
  selector: 'ewo-building',
  templateUrl: './building.component.html',
  styleUrls: ['./building.component.css']
})
export class BuildingComponent implements OnInit {
  isShowingLoadingSpinner:boolean = true;
  buildings: any[] = [];
  employees: any[] = [];
  primarycontact_id: any = [];
  _submitted: boolean = false;
  tabs = new TabVisibility();
  currentCompanyId = 1;
  date_added = new Date().toJSON().slice(0, 10);

  buildingForm = new FormGroup({
    id: new FormControl(),
    name: new FormControl(''),
    company: new FormControl(config.api.base + 'company/' + this.currentCompanyId + '/'),
    // sqfootage: new FormControl('', [Validators.required, ValidationService.numericValidator]),
    sqfootage: new FormControl('', [Validators.required]),
    address: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    postal_code: new FormControl('', Validators.required),
    // mgt_fee_percent: new FormControl('', [Validators.required, ValidationService.percentValidator]),
    mgt_fee_percent: new FormControl('', [Validators.required]),
    site_url: new FormControl(''),
    reg_date: new FormControl(null),
    renew_date: new FormControl(null),
    date_added: new FormControl(this.date_added),
    added_by: new FormControl('1'),
    remit_company: new FormControl('', Validators.required),
    remit_addr: new FormControl('', Validators.required),
    remit_city: new FormControl('', Validators.required),
    remit_state: new FormControl('', Validators.required),
    remit_postal_code: new FormControl('', Validators.required),
    primarycontact_id: new FormControl(null),
    billing_module: new FormControl('true'),
    url: new FormControl(),
    active: new FormControl(true)
  });

  constructor(private buildingService: BuildingService,
    private employeeService: EmployeeService,
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private breadcrumbHeaderService: BreadcrumbHeaderService) {
    this.authService.verifyToken().take(1).subscribe(data => {
      this.getAllBuildings();
      this.getAllEmployees(this.currentCompanyId);
    });
  }

  getAllBuildings(): void {
    this.isShowingLoadingSpinner = true;
    this.buildingService.getAllBuildings(this.currentCompanyId).subscribe(
      data => {
        this.buildings = data;
        this.isShowingLoadingSpinner = false;
      }
    );
  }

  getAllEmployees(company_id): void {
    this.employeeService.getAllEmployees(company_id).subscribe(
      data => {
        let _employee: any[] = data.results.map(item => {
          return { id: item.id, text: (item.last_name + ' ' + item.first_name) };
        });
        this.employees = _employee;
      }
    );
  }

  ngOnInit() {
    $('#modal-add-building').on('hidden.bs.modal', () => {
      this.closeModal();
    });
    this.breadcrumbHeaderService.setBreadcrumbTitle('Buildings');
  }

  switchTab(tabId: number) {
    if (tabId < 1) // First tabs back button click
      tabId = 1;
    else if (tabId > 2) //This is the last tab's next button click
      tabId = 2;
    this.tabs.isBuildingTabVisible = tabId == 1 ? true : false;
    this.tabs.isContactTabVisible = tabId == 2 ? true : false;
    this.tabs.selectedTabNo = tabId;
  }

  editBuilding(building) {
    this.router.navigate(['/admin', 'building', building.id]);
  }

  onSubmit() {
    this._submitted = true;
    this.validationCheck();
    if (!this.buildingForm.valid) return;
    if (this.primarycontact_id.length) {
      this.buildingForm.get('primarycontact_id').setValue(this.primarycontact_id[0].id);
    }
    else {
      return;
    }

    // if (this.buildingForm.value.id) {
    //   this.buildingService.update(this.buildingForm.value).subscribe((building: any) => {
    //     this.getAllBuildings();
    //     this.closeModal();
    //   });
    //   return;
    // }

    this.buildingService.create(this.buildingForm.value).subscribe((building: any) => {
      this.getAllBuildings();
      this.closeModal();
    });
  }

  public selectedPrimaryContact(value: any): void {
    this.primarycontact_id = [value];
  }

  public removedPrimaryContact(value: any): void {
    this.primarycontact_id = value;
  }

  closeModal() {
    this.resetForm();
    this.primarycontact_id = [];
    this.switchTab(1);
    $('#modal-add-building').modal('hide');
  }

  resetForm() {
    this._submitted = false;

    this.buildingForm.reset({
      company: config.api.base + 'company/' + this.currentCompanyId + '/',
      billing_module: 'true',
      added_by: 1,
      active: true
    });
  }

  validationCheck() {
     if (!this.buildingInfoValidationCheck()) {
      this.switchTab(1);
    } else if (!this.remitInfoValidationCheck()) {
      this.switchTab(2);
    }
  }

  remitInfoValidationCheck() {
    return this.buildingForm.get('remit_company').valid &&
      this.buildingForm.get('remit_addr').valid &&
      this.buildingForm.get('remit_city').valid &&
      this.buildingForm.get('remit_state').valid &&
      this.buildingForm.get('remit_postal_code').valid
  }

  buildingInfoValidationCheck() {
    return this.buildingForm.get('sqfootage').valid &&
      this.buildingForm.get('address').valid &&
      this.buildingForm.get('city').valid &&
      this.buildingForm.get('state').valid &&
      this.buildingForm.get('postal_code').valid &&
      this.buildingForm.get('mgt_fee_percent').valid
  }
}
