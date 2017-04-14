import { Component, OnInit, Input, Output } from '@angular/core';
import { VerifyEmailService } from "app/modules/shared/verify-email.service";

@Component({
    selector: 'verify-email',
    template: `
   <span *ngIf="isChecking">checking...</span>
   <span *ngIf="isEmailDuplicate" class="validation-error">{{emailDuplicateMsg}}</span>
  `
})
export class VerifyEmailComponent {
    isChecking: boolean = false;
    isEmailDuplicate: boolean = false;
    emailDuplicateMsg: string = "Email aready used!!!";

    constructor(
        private verifyEmailService: VerifyEmailService
    ) {
    }

    ngOnInit () {
        this.verifyEmailService.emailVerifyInfo$.subscribe((data: any) => {
            this.isChecking = data.isChecking ? data.isChecking : false;
            this.isEmailDuplicate = data.isDuplicate ? data.isDuplicate : false;
        });
    }
}