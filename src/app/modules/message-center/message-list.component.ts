import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Subject } from "rxjs/Subject";
import { MessageService } from "app/modules/message-center/message.service";
import { ActivatedRoute } from "@angular/router";
import { PagerService } from "app/services/pager.service";

@Component({
    selector: 'ewo-message-list',
    templateUrl: './message-list.component.html',
    styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit {

    status: any;

    messages: string[] = [];

    pageItems: Subject<any> = new BehaviorSubject([]);

    constructor(
        private messageService: MessageService,
        private route: ActivatedRoute,
        private pagerService: PagerService
    ) { }

    ngOnInit () {
        this.route.params.subscribe(param => {
            this.status = param.status;
            this.getAllMessages(this.status);
        });

        this.pagerService.items.subscribe(data => {
            this.messages = data;
        })
    }

    getAllMessages (status) {
        this.messageService.getMessages(status)
            .map(respose => respose.results)
            .subscribe((data) => {
                // this.messages = data;
                this.pageItems.next(data);
                // this.pagerService.setPage(1, data);
                let _page = this.pagerService.pager && this.pagerService.pager.currentPage ? this.pagerService.pager.currentPage : 1;
                this.pagerService.setPage(_page, data);
            })
    }

}
