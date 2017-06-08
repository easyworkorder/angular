import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, Params, PRIMARY_OUTLET, NavigationStart } from "@angular/router";
import { BreadcrumbHeaderService } from "app/modules/shared/breadcrumb-header/breadcrumb-header.service";

@Component({
    selector: 'ewo-breadcrumb-header',
    templateUrl: './breadcrumb-header.component.html'
})
export class BreadcrumbHeaderComponent implements OnInit {

    routingTitle;
    showBreadCrumb: boolean = true;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private breadcrumbHeaderService: BreadcrumbHeaderService) {

        this.breadcrumbHeaderService.breadcrumbHeaderTitle$.subscribe(data => {
            this.routingTitle = data
        });
        // activatedRoute.data.subscribe((d => {
        //     console.log('data', d);
        // }));

    }

    ngOnInit () {
        // this.routingTitle = this.activatedRoute.snapshot.data['breadcrumb'];
        this.breadcrumbHeaderService.showBreadCrumb$.subscribe(value => {
            this.showBreadCrumb = value;
        })
    }
}
