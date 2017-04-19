import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TenantService } from './../../admin/tenant/tenant.service';
import { BuildingService } from './../../admin/building/building.service';
import { AuthenticationService } from "app/modules/authentication";
import { DataService } from "app/services";
import { HeaderService } from "app/modules/shared/header/header.service";
import { BreadcrumbHeaderService } from "app/modules/shared/breadcrumb-header/breadcrumb-header.service";

@Component({
  selector: 'ewo-tenant-list',
  templateUrl: './tenant-list.component.html',
})
export class TenantListComponent implements OnInit {
  isShowingLoadingSpinner: boolean = true;
  currentBuildingId = 0;
  currentCompanyId = 1;
  buildings: any[] = [];
  tenants: any[] = [];

  searchControl: FormControl = new FormControl('');

  constructor(
    private tenantService: TenantService,
    private buildingService: BuildingService,
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private headerService: HeaderService,
    private breadcrumbHeaderService: BreadcrumbHeaderService,
    private dataService: DataService) {
    this.authService.verifyToken().take(1).subscribe(data => {
      this.getAllActiveBuildings();
      this.getAllTenantsByBuilding(this.currentBuildingId);
    });
  }

  getAllActiveBuildings (): void {
    this.isShowingLoadingSpinner = true;
    this.buildingService.getAllActiveBuildings(this.currentCompanyId).subscribe(
      data => {
        this.buildings = data.results;
        this.isShowingLoadingSpinner = false;

        if (this.buildings.length > 0) {
          this.getAllTenantsByBuilding(this.buildings[0].id);
        }
      }
    );
  }

  getAllTenantsByBuilding (building_id): void {
    this.isShowingLoadingSpinner = true;
    this.currentBuildingId = building_id;
    // this.selectedBuilding =
    this.tenantService.getAllTenantsByBuilding(building_id).subscribe(
      data => {
        this.tenants = data.length > 0 && data.filter(d => d.contact_id !== null) || [];
        this.isShowingLoadingSpinner = false;
      }
    );
  }

  ngOnInit () {
    this.headerService.setDashBoardTitle({ title: 'TICKETS', link: ['/'] });
    this.breadcrumbHeaderService.setBreadcrumbTitle('Tenants');
  }


  onSubmit () {

  }

  buildAddressHtml (tenant: any) {
    return this.dataService.buildAddressHtml(tenant, tenant.tenant_company_name);
  }

  getPhotoUrl (tenant) {
    return this.dataService.getPhotoUrl(tenant.photo);
  }

  stopPropagation (event) {
    event.stopPropagation()
  }

}

