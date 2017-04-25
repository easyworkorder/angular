import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

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
  @Input() OkButton: boolean = true;
  @Input() okButtonLabel: string = 'Delete';
  @Input() cancelButton: boolean = true;
  @Input() cancelButtonLabel: string = 'Cancel';
  @Input() showDangerIcon: boolean = false;
  @Output('okButtonClick') okButtonClicked: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit () {
    // this.showDelete = this.delete;
    // this.showCancel = this.cancel;
  }
  btnOkClick (event) {
    this.okButtonClicked.emit(event);
  }
}
