import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Subject } from "rxjs/Subject";
import { MessageService } from "app/modules/message-center/message.service";
import { ActivatedRoute } from "@angular/router";
import { PagerService } from "app/services/pager.service";
import { ToasterService } from "angular2-toaster/angular2-toaster";

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
        private pagerService: PagerService,
        private toasterService: ToasterService
    ) { }

    ngOnInit () {
        this.route.params.subscribe(param => {
            this.status = param.status;
            this.getAllMessages(this.status);
        });

        this.pagerService.items.subscribe(data => {
            // this.messages = data;

            let _msgs = (data || []).map(item => Object.assign({}, item, { checked: false }));
            // this.messages = data;
            this.messages = _msgs;
            // console.log('msgs', this.messages);
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
                if (data && data.length == 0) {
                    _page = this.pagerService.pager && this.pagerService.pager.currentPage ? this.pagerService.pager.currentPage - 1 : 1;
                }
                this.pagerService.setPage(_page, data);
            })
    }

    onDeleteMessages (event) {
        // console.log('msgss checked', this.messages);

        let checkedOne = this.messages.some((item: any) => item.checked);
        if (!checkedOne) {
            this.toasterService.pop('info', 'Delete?', `No message selected for Delete`);
            return;
        }

        const checkedMsgList: any[] = this.messages.filter((item: any) => item.checked);

        let counter = 0;
        checkedMsgList && checkedMsgList.forEach(msg => {
            msg.status = 'trash';
            this.messageService.update(msg).subscribe(() => {
                if (++counter == checkedMsgList.length) {
                    this.getAllMessages(this.status);
                    this.toasterService.pop('success', 'Delete?', `${checkedMsgList.length} Message has been deleted successfully`);
                }
            }, error => {
                this.toasterService.pop('error', 'Delete?', `Message${checkedMsgList.length == 1 ? '' : '\'s'} are not deleted`);
            });
        })
    }

}
