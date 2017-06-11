import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ValidationService } from "app/services/validation.service";
import { BuildingService } from "app/modules/admin/building/building.service";

import { Observable } from "rxjs/Observable";
import { ToasterService } from "angular2-toaster/angular2-toaster";

import {
    Storage
} from './../../services/index';
import config from '../../config';
import { AuthenticationService } from "app/modules/authentication";
import { TenantService } from "app/modules/admin/tenant/tenant.service";
declare var $: any;

@Component({
    selector: 'ewo-compose-message',
    templateUrl: './compose-message.component.html',
    styleUrls: ['./compose-message.component.css']
})
export class ComposeMessageComponent implements OnInit {
    currentCompanyId = 1;
    buildingList: any[] = [];
    tenantList: any[] = [];
    selectedBuildings: any[] = [];
    selectedTenants: any[] = [];
    // selectedBuildings: any[] = [{ id: -1, text: 'All' }];
    // selectedTenants: any[] = [{ id: -1, text: 'All' }];
    userInfo: any;

    isBuildingsValid: boolean = true;
    isTenantsValid: boolean = true;
    disabledTenant: boolean = true;


    composeMessageForm = new FormGroup({
        id: new FormControl(),
        company: new FormControl(config.api.base + 'company/' + this.currentCompanyId + '/'),
        subject: new FormControl('', Validators.required),
        details: new FormControl('', Validators.required),
        building_list: new FormControl('', Validators.required),
        tenant_list: new FormControl('', Validators.required),
        status: new FormControl('sent'),
        datetime: new FormControl(new Date()),
        sender_id: new FormControl(null),
        url: new FormControl(),
    });

    constructor(
        private authService: AuthenticationService,
        private buildingService: BuildingService,
        private storage: Storage,
        private tenantService: TenantService,
    ) {
        this.userInfo = this.storage.getUserInfo();
    }

    ngOnInit () {
        $('#modal-compose').on('hidden.bs.modal', () => {
            this.closeModal();
        });

        if (this.userInfo.IsPropertyManager) {
            this.getAllBuildings(this.currentCompanyId);
        } else {
            this.getEmployeeBuildings(this.userInfo.employee_id)
        }

        this.setBuildingList();
        this.setTenantList();
    }

    getAllBuildings (company_id): void {
        this.buildingService.getAllBuildings(company_id).subscribe(
            data => {
                this.populateBuildingList(data);
            }
        );
    }

    getEmployeeBuildings (empId) {
        this.buildingService.getEmployeeBuildings(empId).subscribe(
            data => {
                this.populateBuildingList(data);
            }
        );
    }

    populateBuildingList (data) {
        // this.buildings = data.results;
        let _building: any[] = data.map(item => {
            return { id: item.id, text: item.name };
        })
        // _building.push({ id: -1, text: 'All' });
        _building.splice(0, 0, { id: -1, text: 'All' });
        this.buildingList = _building;
    }

    populateTenantsByBuilding () {
        this.tenantList = [];
        this.disabledTenant = true;
        this.tenantList.splice(0, 0, { id: -1, text: 'All' });

        if (this.selectedBuildings.length == 0) {
            this.selectedTenants = [];
            return;
        }
        this.selectedBuildings.forEach(building => {
            this.getActiveTenantsByBuilding(building.id);
        })

        // if (this.tenantList.length > 0) {
        //     this.tenantList.splice(0, 0, { id: -1, text: 'All' });
        //     this.disabledTenant = false;
        // }

    }
    getActiveTenantsByBuilding (building_id): void {
        this.tenantService.getActiveTenantsByBuilding(building_id).subscribe(
            data => {
                this.populateTenantList(data);
            }
        );
    }
    populateTenantList (data) {
        let _tenants: any[] = data.results.map(item => {
            return { id: item.id, text: (item.unitno + ' ' + item.tenant_company_name) };
        })
        // _tenants.splice(0, 0, { id: -1, text: 'All' });

        this.tenantList = this.tenantList.concat(_tenants);
        if (this.tenantList.length > 1) {
            this.disabledTenant = false;
        } else {
            this.tenantList = [];
        }
    }

    setBuildingList () {
        let buildingList = this.itemsToString(this.selectedBuildings);
        buildingList = buildingList.split(',').filter(item => item != '-1').join(',');
        this.composeMessageForm.get('building_list').setValue(buildingList == "" ? "-1" : buildingList);
    }

    setTenantList () {
        let TenantList = this.itemsToString(this.selectedTenants);
        TenantList = TenantList.split(',').filter(item => item != '-1').join(',');
        this.composeMessageForm.get('tenant_list').setValue(TenantList == "" ? "-1" : TenantList);
    }

    public selectedBuildingHandler (value: any): void {
        // if (value.id == -1) {
        //   return;
        // }

        if (this.selectedBuildings.length >= 1 && value.id == -1) {
            this.removedBuildingHandler(value);
            return;
        }
        if (this.selectedBuildings.some(val => val.id == -1)) {
            this.removedBuildingHandler({ id: -1, text: 'All' });
        }

        this.selectedBuildings.push(value);
        this.populateTenantsByBuilding();
        this.setBuildingList();

    }

    public removedBuildingHandler (value: any): void {

        let sel = [];
        this.selectedBuildings.forEach(item => {
            if (item.id != value.id) {
                sel.push(item);
            }
        });
        this.selectedBuildings = sel;
        this.populateTenantsByBuilding();
        this.setBuildingList();
    }

    // public refreshBuildingValue(value: any): void {
    //   this.selectedBuildings = value;
    // }

    public selectedTenantHandler (value: any): void {
        // if (value.id == -1) return;

        // if (this.selectedProblemTypes.length >= 1 && value.id == -1) { return; }
        if (this.selectedTenants.length >= 1 && value.id == -1) {
            this.removedTenantHandler(value);
            return;
        }
        if (this.selectedTenants.some(val => val.id == -1)) {
            this.removedTenantHandler({ id: -1, text: 'All' });
        }

        this.selectedTenants.push(value);
        this.setTenantList();
    }

    public removedTenantHandler (value: any): void {
        let sel = [];
        this.selectedTenants.forEach(item => {
            if (item.id != value.id) {
                sel.push(item);
            }
        });
        this.selectedTenants = sel;
        this.setTenantList();
    }

    public itemsToString (value: Array<any> = []): string {
        return value
            .map((item: any) => {
                return item.id;
            }).join(',');
    }

    closeModal () {
        this.composeMessageForm.reset({
            company: config.api.base + 'company/' + this.currentCompanyId + '/',
            status: 'sent',
            datetime: new Date(),
        });

        // this.selectedBuildings = [{ id: -1, text: 'All' }];
        // this.selectedTenants = [{ id: -1, text: 'All' }];
        this.disabledTenant = true;
        // this.buildingList = [];
        this.selectedBuildings = [];
        this.tenantList = [];
        this.selectedTenants = [];
        this.setBuildingList();
        this.setTenantList();

        $('#modal-compose').modal('hide');
    }
}
