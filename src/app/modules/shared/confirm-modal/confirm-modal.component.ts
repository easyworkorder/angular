import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ewo-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css']
})
export class ConfirmModalComponent implements OnInit {
  // @Input() id: 'modal-confirmation'
  // @Input() config: any = {
  //   message: 'At least one request must be selected.',
  //   delete: true,
  //   deleteLabel: 'Delete',
  //   cancel: true,
  //   cancelLabel: 'Cancel',
  // }
  @Input() message: string = 'Are you sure?';
  @Input() delete: boolean;
  @Input() deleteLabel: string = 'Delete';
  @Input() cancel: boolean = true;
  @Input() cancelLabel: string = 'Cancel';
  showDelete: boolean;
  showCancel: boolean;
  constructor() { }

  ngOnInit () {
    // this.showDelete = this.delete;
    // this.showCancel = this.cancel;
  }
}
