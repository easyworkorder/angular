import { Component, OnInit } from '@angular/core';
import { BreadcrumbHeaderService } from "app/modules/shared/breadcrumb-header/breadcrumb-header.service";

@Component({
  selector: 'ewo-sla-policy',
  templateUrl: './sla-policy.component.html',
  styleUrls: ['./sla-policy.component.css']
})
export class SLAPolicyComponent implements OnInit {

  constructor( private breadcrumbHeaderService: BreadcrumbHeaderService) { }

  ngOnInit() {
    this.breadcrumbHeaderService.setBreadcrumbTitle('SLA Policies');
  }

}
