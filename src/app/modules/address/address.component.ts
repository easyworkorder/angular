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

    getAll(): void {
        this.addressService.getAll().subscribe(
            data => {
                this.addresses = data.results;
            }
        );
    }

    ngOnInit() {
        // this.getAll();
    }

    onSubmit() {
        // let val = this.addressCreateForm.value;
        // this.addressService.create(this.addressCreateForm.value).subscribe((address: any) => {
        //     console.log('Address created', address);
        //     this.addresses.push(address);
        //     this.isSuccess = true;
        // });
        this.newOnSubmit();
    }

    fileChange(event) {
        let fileList: FileList = event.target.files;
        if(fileList.length > 0) {
            this.address2File = fileList[0];
        }
    }

    newOnSubmit() {
        console.log('Inside New On Submit');
        if(this.address2File) {
            let formData:FormData = this.dataService.mapToFormData(this.addressCreateForm, ['address2']);
            formData.append('address2', this.address2File, this.address2File.name);
            
            this.addressService.createWithFile(formData).subscribe((address: any) => {
                console.log('Address created with file', address);
                this.addresses.push(address);
                this.isSuccess = true;
            });
        } else {
            // Simple Object Posting should go here, and the address2 field needs to be removed 
            // It is obvious that the user hasn't selected any file
            if(this.addressCreateForm.contains('address2'))
                this.addressCreateForm.removeControl('address2');
            
            this.addressService.create(this.addressCreateForm.value).subscribe((address: any) => {
                console.log('Address created', address);
                this.addresses.push(address);
                this.isSuccess = true;
            });
        }

    }

    // mapToFormData(form:FormGroup, excludeKeys: string[]): FormData {
    //     let formData:FormData = new FormData();
    //     Object.keys(form.controls);
    //     for (let key of Object.keys(form.controls)) {
    //         if(excludeKeys.indexOf(key) < 0 ) {
    //             formData.append(key, form.get(key).value);
    //         }
    //     }
    //     return formData;
    // }
}
