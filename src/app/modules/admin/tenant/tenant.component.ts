import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TenantService } from './tenant.service';
import { BuildingService } from './../building/building.service';
import { ValidationService } from './../../../services/validation.service';
import { AuthenticationService } from "app/modules/authentication";
import { ActivatedRoute } from "@angular/router";

export class TabVisibility {
  isBasicTabVisible = true;
  isContactTabVisible = false;
  selectedTabNo = 1;
}

@Component({
  selector: 'ewo-tenant',
  templateUrl: './tenant.component.html',
})
export class TenantComponent implements OnInit {

  currentBuildingId = 0;
  currentCompanyId = 1;
  isSuccess: boolean = false;
  viewInvoicesList = [{ value: true, display: 'Yes, they are authorized (default)' }, { value: false, display: 'No, they are not authorized' }];
  buildings: any[] = [];
  tenants: any[] = [];
  selectedBuilding: any;
  private _buildingId: any;

  tabs = new TabVisibility();

  // tenantForm: FormGroup;

  constructor(
    private tenantService: TenantService,
    private buildingService: BuildingService,
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private route: ActivatedRoute) {
    // this.authService.verifyToken().take(1).subscribe(data => {
    //   this.getAllBuildings();
    //   this.getAllTenantsByBuilding(this.currentBuildingId);
    // });
  }

  ngOnInit() {
    this._buildingId = this.route.snapshot.params['id'];

    this.authService.verifyToken().take(1).subscribe(data => {
      // this.getAllBuildings();
      this.getAllTenantsByBuilding(this._buildingId);
    });
  }

  tenantForm = this.formBuilder.group({
    // building: new FormControl('http://localhost:8080/api/building/6/'),
    building: new FormControl(''),
    tenant_company_name: new FormControl('', Validators.required),
    inscertdate: new FormControl(null),
    mgtfeepercent: new FormControl('', [Validators.required]),
    gl_notify: new FormControl(true),
    unitno: new FormControl(''),
    isactive: new FormControl(true),
    tenant_contacts: this.formBuilder.array(
      [this.buildBlankContact('', '', '', true, '', '', '', '', '', '', true, null, '')],
      null
      // ItemsValidator.minQuantitySum(300)
    )
  })

  buildBlankContact(firstName: string, lastName: string, title: string, viewinvoices: boolean,
    phone: string, extension: string, mobile: string, emergencyPhone: string, fax: string,
    email: string, isPrimaryContact: boolean, tenantID: number, notes: string) {
    return new FormGroup({
      title: new FormControl(title),
      notes: new FormControl(notes),
      viewinvoices: new FormControl(viewinvoices),
      first_name: new FormControl(firstName, Validators.required),
      last_name: new FormControl(lastName, Validators.required),
      phone: new FormControl(phone),
      extension: new FormControl(extension),
      mobile: new FormControl(mobile),
      emergency_phone: new FormControl(emergencyPhone),
      fax: new FormControl(fax),
      email: new FormControl(email),
      isprimary_contact: new FormControl(isPrimaryContact),
      tenant: new FormControl(tenantID),
      active: new FormControl(true)
    });
  }


  getAllBuildings(): void {
    this.buildingService.getAllBuildings(this.currentCompanyId).subscribe(
      data => {
        this.buildings = data;
        if (this.buildings.length > 0) {
          this.selectedBuilding = this.buildings[0];
          this.getAllTenantsByBuilding(this.buildings[0].id);
        }
      }
    );
  }

  getAllTenantsByBuilding(building_id): void {
    // this.currentBuildingId = building_id;
    // this._buildingId = building_id;

    // this.selectedBuilding =
    this.tenantService.getAllTenantsByBuilding(building_id).subscribe(
      data => {
        this.tenants = data;
      }
    );
  }






  onSubmit() {
    // this.tenantForm.get('mgtfeepercent').valid = false;
    if(!this.tenantForm.valid) {return;}

    let val = this.tenantForm.value;
    this.tenantService.create(this.tenantForm.value).subscribe((tenant: any) => {
      console.log('Tenant created', tenant);
      this.isSuccess = true;
    });
  }

  switchTab(tabId: number) {
    if (tabId < 1) // First tabs back button click
      tabId = 1;
    else if (tabId > 3) //This is the last tab's next button click
      tabId = 3;
    this.tabs.isBasicTabVisible = tabId == 1 ? true : false;
    this.tabs.isContactTabVisible = tabId == 2 ? true : false;
    this.tabs.selectedTabNo = tabId;
  }

  buildName(firstName: string, lastName: string) {
    if (firstName != null && firstName.length > 0 && lastName != null && lastName.length > 0) {
      return lastName + ' ' + firstName;
    }
    if (firstName != null && firstName.length > 0)
      return firstName;
    if (lastName != null && lastName.length > 0)
      return lastName;
    return '';
  }

  buildAddressHtml(tenant: any) {
    var html = '<strong>' + tenant.tenant_company_name + '</strong><br />';
    if (tenant.unitNo != null && tenant.unitNo.length > 0)
      html += tenant.unitNo + '<br />';
    if (tenant.title != null && tenant.title.length > 0)
      html += tenant.title + '<br />';
    var extension = (tenant.extension != null && tenant.extension.length > 0) ? '(' + tenant.extension + ')' : '';
    if (tenant.phone != null && tenant.phone.length > 0)
      html += 'P: ' + extension + tenant.phone;

    return html;
  }

  getPhotoUrl(tenant) {
    if (tenant.photo != null && tenant.photo.length > 0)
      return tenant.photo;
    return 'assets/img/placeholders/avatars/avatar9.jpg';
  }

  stopPropagation(event) {
    event.stopPropagation()
  }

}

