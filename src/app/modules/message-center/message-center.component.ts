import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreadcrumbHeaderService } from "app/modules/shared/breadcrumb-header/breadcrumb-header.service";
import { Subject } from "rxjs/Subject";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";

@Component({
    selector: 'ewo-message-center',
    templateUrl: './message-center.component.html',
    styleUrls: ['./message-center.component.css']
})
export class MessageCenterComponent implements OnInit {
    activeSent: boolean = true;
    activeDraft: boolean = false;
    activeTrash: boolean = false;

    // status: Subject<string> = new BehaviorSubject('sent');
    status: any;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private breadcrumbHeaderService: BreadcrumbHeaderService,
    ) { }

    ngOnInit () {
        this.breadcrumbHeaderService.setShowBreadCrumb(false);

        this.route.params.subscribe(param => {
            this.status = param.status;
            this.setSelectedItem(this.status);
        })
    }

    ngOnDestroy () {
        this.breadcrumbHeaderService.setShowBreadCrumb(true);
    }

    setActiveItem (item) {
        // if ((this.activeSent && item == 'sent') || (this.activeDraft && item == 'draft') || (this.activeTrash && item == 'trash')) return;

        // this.activeSent = item == 'sent';
        // this.activeDraft = item == 'draft';
        // this.activeTrash = item == 'trash';
        // this.status.next(item);

        // let navigationExtras: NavigationExtras = {

        //     preserveQueryParams: true,
        //     fragment: 'anchor'
        // };
        // this.router.navigate(['/messages'], { queryParams: { status: item } });
        this.setSelectedItem(item);
        this.router.navigate(['/', 'messages', item]);
    }

    setSelectedItem (item) {
        if ((this.activeSent && item == 'sent') || (this.activeDraft && item == 'draft') || (this.activeTrash && item == 'trash')) return;

        this.activeSent = item == 'sent';
        this.activeDraft = item == 'draft';
        this.activeTrash = item == 'trash';
    }

}
