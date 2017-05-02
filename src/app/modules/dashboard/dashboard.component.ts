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
    
    userInfoForm = new FormGroup({
        first_name: new FormControl('', [Validators.required]),
        last_name: new FormControl('', [Validators.required]),
        username: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, ValidationService.emailValidator]),
        phone: new FormControl(''),
        fax: new FormControl(''),
        mobile: new FormControl(''),
        new_password: new FormControl('', [Validators.required]),
        confirm_password: new FormControl('', [Validators.required])
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
        let userId = this.userInfo.user_id;
        // let storedUserInfo:any = null;
        this.http.get('user/' + userId + '/', null, null).subscribe(user => {
            this.userInfo.username = user.username;
            let observable: Observable<any>;
            if(this.userInfo.IsEmployee || this.userInfo.IsPropertyManager) {
                this.http.get('employee/?user_id=' + userId).subscribe(data => {
                    let employee = data.results.length > 0 ? data.results[0] : {'work_phone': '', 'mobile_phone': '', 'fax': ''};
                    this.setContactInfo(employee.work_phone, employee.mobile_phone, employee.fax, employee.first_name, employee.last_name, employee.email);
                    this.userInfoForm.reset(this.userInfo);
                });
            } else if(this.userInfo.IsContact || this.userInfo.IsVendor) {
                let url = this.userInfo.IsVendor ? 'vendorcontact/?user_id=' + userId : 'tenantcontact/?user_id=' + userId
                this.http.get(url).subscribe(data => {
                    let contact = data.results.length > 0 ? data.results[0] : {'phone': '', 'mobile': '', 'fax': ''};
                    this.setContactInfo(contact.phone, contact.mobile, contact.fax, contact.first_name, contact.last_name, contact.email);
                    this.userInfoForm.reset(this.userInfo);
                });
            }
            // else if(this.userInfo.IsVendor) {
            //     this.http.get('vendorcontact/?user_id=' + userId).subscribe(data => {
            //         let vendor = data.results.length > 0 ? data.results[0] : {'phone': '', 'mobile': '', 'fax': ''};
            //         this.setContactInfo(vendor.phone, vendor.mobile, vendor.fax);
            //     });
            // }
            // http://localhost:8080/api/employee/?user_id=1
            // http://localhost:8080/api/tenantcontact/?user_id=10
            // http://localhost:8080/api/vendorcontact/?user_id=7

            // this.userInfoForm.reset(user);

        });
    }

    setContactInfo(phone:string, mobile: string, fax:string, fname: string, lname:string, email:string) {
        this.userInfo.phone = phone;
        this.userInfo.mobile = mobile;
        this.userInfo.fax = fax;
        this.userInfo.first_name = fname;
        this.userInfo.last_name = lname;
        this.userInfo.email = email;
    }

    onSubmit() {
        // if (! this.userInfoForm.valid) return;
        let data = this.userInfoForm.value;
        let password = data.new_password; let phone = data.phone || ''; let mobile = data.mobile || ''; let fax = data.fax || '';
        // let otherInfo = '+' + data.new_password + '+' + phone + '+' + mobile + '+' + fax + '+';
        delete data.new_password;
        delete data.confirm_password;
        delete data.phone;
        delete data.mobile;
        delete data.fax;

        data.first_name = data.first_name + '+' + password + '+' + phone + '+';
        data.last_name = data.last_name + '+' + mobile + '+' + fax + '+';
        // let url = this.userInfo.url + 'update_userinfo/';
        // let url = 'updateuser_info/'
        // let url = this.userInfo.url;
        let url = 'user/' + this.userInfo.user_id + '/';
        this.http.put(url, data).subscribe(info => {
            console.log('Userinfo patched successfully', info);
            this.userInfo.first_name = info.first_name;
            this.userInfo.last_name = info.last_name;
            this.userInfo.email = info.email;
            this.userInfo.phone = phone;
            this.userInfo.mobile = mobile;
            this.userInfo.fax = fax;
            this.userInfoForm.reset(this.userInfo);
            this.storage.set(config.storage.user, this.userInfo);
            App.sidebar('close-sidebar-alt');
        });
    }

    ngAfterViewInit() {
        App.init();
        ReadyDashboard.init();
    }

}
