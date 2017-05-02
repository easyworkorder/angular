import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthenticationService } from "app/modules/authentication";
import config from './../../config';
import { Storage } from './../../services/index';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AppHttp } from "app/services/http.service";

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
    
    userInfoForm = new FormGroup({
        id: new FormControl(),
        url: new FormControl(''),
        first_name: new FormControl('', [Validators.required]),
        last_name: new FormControl('', [Validators.required]),
        username: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required]),
        new_password: new FormControl('', [Validators.required]),
        confirm_password: new FormControl('', [Validators.required])
    });

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
        // let storedUserInfo:any = null;
        this.http.get('user/' + this.userInfo.user_id + '/', null, null).subscribe(data => {
            // this.userInfo = data;
            // this.userInfoForm.get('first_name').setValue(this.userInfo.first_name);
            // this.userInfoForm.get('last_name').setValue(this.userInfo.last_name);
            // this.userInfoForm.get('username').setValue(this.userInfo.username);
            // this.userInfoForm.get('email').setValue(this.userInfo.email);
            // this.userInfoForm.reset(this.userInfo);
            this.userInfoForm.reset(data);
        });
    }

    onSubmit() {
        if (! this.userInfoForm.valid) return;
        let data = this.userInfoForm.value;
        let password = data.new_password;
        delete data.new_password;
        delete data.confirm_password;
        // data.username = data.username + '+' + password;
        data.first_name = data.first_name + '+' + password;
        // let url = this.userInfo.url + 'update_userinfo/';
        // let url = 'updateuser_info/'
        // let url = this.userInfo.url;
        let url = data.url;
        this.http.put(url, data).subscribe(info => {
        // this.http.post(url, data).subscribe(info => {
            console.log('Userinfo patched successfully', info);
            this.userInfo.first_name = info.first_name;
            this.userInfo.last_name = info.last_name;
            this.userInfo.email = info.email.
            this.userInfoForm.reset(info);
            this.storage.set(config.storage.user, this.userInfo);
            App.sidebar('close-sidebar-alt');
        });
    }

    ngAfterViewInit() {
        App.init();
        ReadyDashboard.init();
    }

}
