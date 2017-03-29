import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { VendorService } from './../../admin/vendor/vendor.service';
import { AuthenticationService } from "app/modules/authentication";
import { DataService } from "app/services";

@Component({
  selector: 'ewo-vendor-list',
  templateUrl: './vendor-list.component.html',
})
export class VendorListComponent implements OnInit {

  currentCompanyId = 1;
  vendors: any[] = [];

  searchControl: FormControl = new FormControl('');

  constructor(
    private vendorService: VendorService,
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private dataService: DataService) {
    this.authService.verifyToken().take(1).subscribe(data => {
      this.getAllActiveVendors();
    });
  }

  getAllActiveVendors(): void {
    // this.selectedBuilding =
    this.vendorService.getAllActiveVendors(this.currentCompanyId).subscribe(
      data => {
        this.vendors = data.length > 0 && data.filter(d => d.contact_id !== null)  || [];
      }
    );
  }

  ngOnInit() {
  }


  onSubmit() {

  }

  buildName(firstName: string, lastName: string) {
        return this.dataService.buildName(firstName, lastName);
  }

  buildAddressHtml(vendor: any) {
   return this.dataService.buildVendorAddressHtml(vendor, vendor.company_name);
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
