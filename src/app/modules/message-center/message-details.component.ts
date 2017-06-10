import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "app/modules/message-center/message.service";
import { ToasterService } from "angular2-toaster/angular2-toaster";
declare var $: any;

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
    private router: Router,
    private messageService: MessageService,
    private toasterService: ToasterService,
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
      // console.log('message', data);
      this.messageDetails = data;
    });
  }

  onDeleteModalOkButtonClick (event) {
    if (!this.messageDetails) return;

    const editMsg = this.messageDetails;
    editMsg.status = 'trash';

    this.messageService.update(editMsg).subscribe(data => {
      this.router.navigate(['/', 'messages', this.status]);
      // $('#modal-confirm-delete-message').modal('hide');
      this.toasterService.pop('success', 'DELETE', 'Message has been delete successfully');
    },
      error => {
        this.toasterService.pop('error', 'DELETE', 'Message not delete due to API error!!!');
      })

  }
}
