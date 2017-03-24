import { Component, OnInit } from '@angular/core';
import { FormControl} from '@angular/forms';

import { EmployeeService } from './../../admin/employee/employee.service';
import { AuthenticationService } from "app/modules/authentication";
declare var $: any;

@Component({
  selector: 'ewo-employee-list',
  templateUrl: 'employee-list.component.html',
})

export class EmployeeListComponent implements OnInit {

  employees: any[] = [];
  currentCompanyId = 1;


  employeeSearchControl = new FormControl('');

  constructor(private employeeService: EmployeeService,
    private authService: AuthenticationService) {
    this.authService.verifyToken().take(1).subscribe(data => {
      this.getAllActiveEmployees();
    });
  }

  ngOnInit() {
  }

  getAllActiveEmployees(): void {
    this.employeeService.getAllActiveEmployees(this.currentCompanyId).subscribe(
      data => {
        this.employees = data.results;
      }
    );
  }

  onSubmit() {

  }
}

