import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Subject } from "rxjs/Subject";
import { MessageService } from "app/modules/message-center/message.service";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: 'ewo-message-list',
    templateUrl: './message-list.component.html',
    styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit {

    status: any;

    messages: string[] = [];

    constructor(
        private messageService: MessageService,
        private route: ActivatedRoute,
    ) { }

    ngOnInit () {
        this.route.params.subscribe(param => {
            this.status = param.status;
            this.getAllMessages(this.status);
        });
    }

    getAllMessages (status) {
        this.messageService.getMessages(status)
            .map(respose => respose.results)
            .subscribe((data) => {
                this.messages = data;
            })
    }

}
