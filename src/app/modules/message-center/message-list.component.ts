import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Subject } from "rxjs/Subject";
import { MessageService } from "app/modules/message-center/message.service";

@Component({
    selector: 'ewo-message-list',
    templateUrl: './message-list.component.html',
    styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit {

    @Input()
    status: Subject<string>;

    messages: string[] = [];

    constructor(private messageService: MessageService) { }

    ngOnInit () {
        this.status.subscribe(status => {
            this.getAllMessages(status);
        })
    }

    getAllMessages (status) {
        this.messageService.getMessages(status)
            .map(respose => respose.results)
            .subscribe((data) => {
                console.log('data', data);

                this.messages = data;
            })
    }

}
