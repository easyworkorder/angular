import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreadcrumbHeaderService } from "app/modules/shared/breadcrumb-header/breadcrumb-header.service";
import { Subject } from "rxjs/Subject";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

@Component({
    selector: 'ewo-message-center',
    templateUrl: './message-center.component.html',
    styleUrls: ['./message-center.component.css']
})
export class MessageCenterComponent implements OnInit {
    activeSent: boolean = true;
    activeDraft: boolean = false;
    activeTrash: boolean = false;

    status: Subject<string> = new BehaviorSubject('sent');

    constructor(private breadcrumbHeaderService: BreadcrumbHeaderService) { }

    ngOnInit () {
        this.breadcrumbHeaderService.setShowBreadCrumb(false);
    }

    ngOnDestroy () {
        this.breadcrumbHeaderService.setShowBreadCrumb(true);
    }

    setActiveItem (item) {
        if ((this.activeSent && item == 'sent') || (this.activeDraft && item == 'draft') || (this.activeTrash && item == 'trash')) return;

        this.activeSent = item == 'sent';
        this.activeDraft = item == 'draft';
        this.activeTrash = item == 'trash';
        this.status.next(item);
    }

}
