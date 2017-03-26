import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TenantService } from './../../admin/tenant/tenant.service';
import { BuildingService } from './../../admin/building/building.service';
import { AuthenticationService } from "app/modules/authentication";
import { DataService } from "app/services";

@Component({
  selector: 'ewo-tenant-list',
  templateUrl: './tenant-list.component.html',
})
export class TenantListComponent implements OnInit {

  currentBuildingId = 0;
  currentCompanyId = 1;
  buildings: any[] = [];
  tenants: any[] = [];

  tenantSearchControl = new FormControl('');

  constructor(
    private tenantService: TenantService,
    private buildingService: BuildingService,
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private dataService: DataService) {
    this.authService.verifyToken().take(1).subscribe(data => {
      this.getAllActiveBuildings();
      this.getAllTenantsByBuilding(this.currentBuildingId);
    });
  }

  getAllActiveBuildings(): void {
    this.buildingService.getAllActiveBuildings(this.currentCompanyId).subscribe(
      data => {
        this.buildings = data.results;
        if (this.buildings.length > 0) {
          this.getAllTenantsByBuilding(this.buildings[0].id);
        }
      }
    );
  }

  getAllTenantsByBuilding(building_id): void {
    this.currentBuildingId = building_id;
    // this.selectedBuilding =
    this.tenantService.getAllTenantsByBuilding(building_id).subscribe(
      data => {
        this.tenants = data.length > 0 && data.filter(d => d.contact_id !== null)  || [];
      }
    );
  }

  ngOnInit() {
  }


  onSubmit() {

  }

  buildAddressHtml(tenant: any) {
   return this.dataService.buildAddressHtml(tenant, tenant.tenant_company_name);
    // var html = '<strong>' + tenant.tenant_company_name + '</strong><br />';
    // if (tenant.unitNo != null && tenant.unitNo.length > 0)
    //   html += tenant.unitNo + '<br />';
    // if (tenant.title != null && tenant.title.length > 0)
    //   html += tenant.title + '<br />';
    // var extension = (tenant.extension != null && tenant.extension.length > 0) ? '(' + tenant.extension + ')' : '';
    // if (tenant.phone != null && tenant.phone.length > 0)
    //   html += 'P: ' + extension + tenant.phone;

    // return html;
  }

  getPhotoUrl(tenant) {
    // if (tenant.photo != null && tenant.photo.length > 0)
    //   return tenant.photo;
    // return 'assets/img/placeholders/avatars/avatar9.jpg';
    return this.dataService.getPhotoUrl(tenant.photo);
  }

  stopPropagation(event) {
    event.stopPropagation()
  }

}

