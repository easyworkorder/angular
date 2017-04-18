import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppHttp } from './../../services/http.service';
import { Observable } from 'rxjs/Observable';
import { Http, Headers, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AddressService } from './address.service';
import config from '../../config';
import { DataService } from "app/services";
// import { Feed } from '../../interfaces/feed.interface';
// import { Address } from '../../interfaces/address.interface';


@Component({
    selector: 'ewo-address',
    templateUrl: './address.component.html',
    styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {

    isSuccess: boolean = false;
    addresses: any[] = [];
    address2File: File;

    addressCreateForm = new FormGroup({
        address1: new FormControl(''),
        address2: new FormControl(''),
        city: new FormControl(1),
        fax: new FormControl(''),
        postal_code: new FormControl(''),
        state: new FormControl(''),
        country: new FormControl(''),
        type: new FormControl('A'),
    })

    constructor(
        private addressService: AddressService,
        private http: AppHttp,
        private myHttp: Http,
        private dataService: DataService

    ) {
        this.getAll();
    }

    getAll (): void {
        this.addressService.getAll().subscribe(
            data => {
                this.addresses = data.results;
            }
        );
    }

    ngOnInit () {
        // this.getAll();
    }

    onSubmit () {
        // let val = this.addressCreateForm.value;
        // this.addressService.create(this.addressCreateForm.value).subscribe((address: any) => {
        //     this.addresses.push(address);
        //     this.isSuccess = true;
        // });
        // this.newOnSubmit();
        this.AwsS3Submit();
    }

    fileChange (event) {
        let fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            this.address2File = fileList[0];
        }
    }

    newOnSubmit () {
        if (this.address2File) {
            let formData: FormData = this.dataService.mapToFormData(this.addressCreateForm, ['address2']);
            formData.append('address2', this.address2File, this.address2File.name);

            this.addressService.createWithFile(formData).subscribe((address: any) => {
                this.addresses.push(address);
                this.isSuccess = true;
            });
        } else {
            // Simple Object Posting should go here, and the address2 field needs to be removed
            // It is obvious that the user hasn't selected any file
            if (this.addressCreateForm.contains('address2'))
                this.addressCreateForm.removeControl('address2');

            this.addressService.create(this.addressCreateForm.value).subscribe((address: any) => {
                this.addresses.push(address);
                this.isSuccess = true;
            });
        }

    }

    AwsS3Submit () {
        this.http.get('sign-s3/?name=' + this.address2File.name + '&type=' + this.address2File.type).subscribe(s3Data => {
            // Now we need to upload the file to S3
            this.uploadToAws(this.address2File, s3Data.data, s3Data.url);

        })
        // this.myHttp.post();
    }

    uploadToAws (file: File, s3Data: any, url: string) {
        var postData = new FormData();
        for (let key in s3Data.fields) {
            postData.append(key, s3Data.fields[key]);
        }
        postData.append('file', this.address2File);
        this.myHttp.post(s3Data.url, postData).subscribe(data => {
        })
    }
}
