import { Component, OnInit, Input, Output, OnDestroy } from '@angular/core';
import { VerifyEmailService } from "app/modules/shared/verify-email.service";
import { Subscription } from "rxjs/Subscription";

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
    emailDuplicateMsg: string = "Email already used!";
    subscription: Subscription;

    constructor(
        private verifyEmailService: VerifyEmailService
    ) {
    }

    ngOnInit () {
        this.subscription = this.verifyEmailService.emailVerifyInfo$.subscribe((data: any) => {
            this.isChecking = data.isChecking ? data.isChecking : false;
            this.isEmailDuplicate = data.isDuplicate ? data.isDuplicate : false;
        });
    }

    ngOnDestroy () {
        this.subscription.unsubscribe();
    }
}