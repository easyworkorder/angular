import { Component, AfterViewInit } from '@angular/core';

import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import config from './../../config';
import { AuthenticationService } from './authentication.service';
declare var App: any;
declare var ReadyLogin: any;

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})

export class SigninComponent {

  signinForm: FormGroup;

  constructor(private router: Router, private authentication: AuthenticationService) {
    this.signinForm = new FormGroup({
      username: new FormControl('admin', Validators.required), // or username?
      password: new FormControl('pass1234', Validators.required),
      //remember: new FormControl(),
    });
  }

  ngAfterViewInit() {
    App.init();
    ReadyLogin.init();
  }

  onSubmit() {
    // TEMP TEMP TEMP
    this.authentication.signin(this.signinForm.value).subscribe(() => {
      //  let redirect = this.authentication.redirectUrl ? this.authentication.redirectUrl : config.routes.signinRedirect;
      this.router.navigate([config.routes.signinRedirect]);
    },
      (error) => {
        this.router.navigate([config.routes.signin]);
      }
    );
  }
}
