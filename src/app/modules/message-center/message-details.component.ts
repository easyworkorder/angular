import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { MessageService } from "app/modules/message-center/message.service";

@Component({
  selector: 'ewo-message-details',
  templateUrl: './message-details.component.html',
  styleUrls: ['./message-details.component.css']
})
export class MessageDetailsComponent implements OnInit {
  status: any;
  id: any;

  // messageDetails: any = {
  //   building_list: "2",
  //   datetime : "2017-06-30T13:00:00Z",
  //   details: "Msg Details 2",
  //   id: 2,
  //   sender_id: 1,
  //   status:"",
  //   subject: "",
  //   tenant_list:"",
  //   url : ""
  // }

  messageDetails: any = {};

  constructor(
    private route: ActivatedRoute,
    private messageService: MessageService
  ) { }

  ngOnInit () {
    this.route.params.subscribe(param => {
      this.id = param.id;
      this.getMessage(this.id);
    })

    this.route.parent.params.subscribe(param => {
      this.status = param.status;
    })
  }

  getMessage (id) {
    this.messageService.getMessage(id).subscribe(data => {
      console.log('message', data);
      this.messageDetails = data;
    });
  }

}
