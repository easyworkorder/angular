import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { EmployeeService } from './../../admin/employee/employee.service';
import { AuthenticationService } from "app/modules/authentication";
import { BreadcrumbHeaderService } from "app/modules/shared/breadcrumb-header/breadcrumb-header.service";
import { DataService } from "app/services";
declare var $: any;

@Component({
  selector: 'ewo-employee-list',
  templateUrl: 'employee-list.component.html',
})

export class EmployeeListComponent implements OnInit {
  isShowingLoadingSpinner: boolean = true;
  employees: any[] = [];
  currentCompanyId = 1;


  searchControl = new FormControl('');

  constructor(private employeeService: EmployeeService,
    private authService: AuthenticationService,
    private breadcrumbHeaderService: BreadcrumbHeaderService,
    private dataService: DataService) {
    this.authService.verifyToken().take(1).subscribe(data => {
      this.getAllActiveEmployees();
    });
  }

  ngOnInit() {
    this.breadcrumbHeaderService.setBreadcrumbTitle('Employees');
  }

  getAllActiveEmployees(): void {
    this.isShowingLoadingSpinner = true;
    this.employeeService.getAllActiveEmployees(this.currentCompanyId).subscribe(
      data => {
        this.employees = data.results;
        this.isShowingLoadingSpinner = false;
      }
    );
  }

  buildAddressHtml(employee: any) {
    return this.dataService.buildEmployeedAddressHtml(employee);
  }

  getPhotoUrl(employee) {
    if (employee.photo != null && employee.photo.length > 0)
      return employee.photo;
    return 'assets/img/placeholders/avatars/avatar9.jpg';
  }

  onSubmit() {

  }
}

