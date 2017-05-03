import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthenticationService } from "app/modules/authentication";
import config from './../../config';
import { Storage } from './../../services/index';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AppHttp } from "app/services/http.service";
import { ValidationService } from "app/services/validation.service";
import { Observable } from "rxjs/Observable";

declare var App: any;
declare var ReadyDashboard: any;
declare var $:any;

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

    constructor(
        private authService: AuthenticationService,
        private storage: Storage,
        private http: AppHttp) {
        //  this.authService.verifyToken();
     }

    userInfo: any;
    
    userProfileForm = new FormGroup({
        rel_id: new FormControl(''),
        url: new FormControl(''),
        first_name: new FormControl('', [Validators.required]),
        last_name: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, ValidationService.emailValidator]),
        phone: new FormControl(''),
        fax: new FormControl(''),
        mobile: new FormControl(''),
        password: new FormControl(''),
        confirm_password: new FormControl('')
    });

    employee: any = null;
    tenant_contact: any = null;
    vendor_contact: any = null;

    ngOnInit() {
        App.init();
        ReadyDashboard.init();
        $(document).ready(function () {
            App.init();
            ReadyDashboard.init();
        });
        $(window).on("load", function () {
            App.init();
            ReadyDashboard.init();
        });
        this.userInfo = this.storage.getUserInfo();

        // Get user profile information
        this.http.get('userprofile/', null, null).subscribe(userProfile => {
            this.userProfileForm.reset(userProfile);
        });
    }

    onSubmit() {
        // FIXME: Validation needs to be corrected
        // if (! this.userInfoForm.valid) return;
        let data = this.userProfileForm.value;
        data.password = data.password || null;
        delete data.confirm_password;
        this.http.post(data.url, data).subscribe(userProfile => {
            console.log('Userinfo patched successfully', userProfile);
            this.userProfileForm.reset(userProfile);
            App.sidebar('close-sidebar-alt');
        });
    }

    ngAfterViewInit() {
        App.init();
        ReadyDashboard.init();
    }

}
