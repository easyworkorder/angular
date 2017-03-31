import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppHttp } from './../../services/http.service';
import { Observable } from 'rxjs/Observable';
import { Http, Headers, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AddressService } from './address.service';
import config from '../../config';
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
        private myHttp: Http

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
            let formData:FormData = this.mapToFormData(this.addressCreateForm);
            // let headers = new Headers();
            // headers.append('Content-Type', 'multipart/form-data');
            // headers.append('Accept', 'application/json');
            // // Following line is very important, if there is any 'Content-Type' set 
            // // the API backend will not recognize the request, and will ignore it.
            // // Browser explicitly sets the contencttype for a file upload form
            // // API backend understands that
            // headers.delete('Content-Type');
            // headers.append(config.api.tokenLabel, this.http.getToken());
            // let options = {};
            // options['headers'] = headers;
            // this.myHttp.post('http://localhost:8080/api/address/', formData, options)
            //     .map(res => res.json())
            //     .catch(error => Observable.throw(error))
            //     .subscribe(
            //         data => console.log('success'),
            //         error => console.log(error));
            this.addressService.createWithFile(formData).subscribe((address: any) => {
                console.log('Address created with file', address);
                this.addresses.push(address);
                this.isSuccess = true;
            });
        } else {
            // Simple Object Posting should go here, and the address2 field needs to be removed 
            // If there is not any address2 file selected by the user
            
            // let val = this.addressCreateForm.value;
            if(this.addressCreateForm.contains('address2')) {
                this.addressCreateForm.removeControl('address2');
                console.log('Address2 Removed');
            }
            
            this.addressService.create(this.addressCreateForm.value).subscribe((address: any) => {
                console.log('Address created', address);
                this.addresses.push(address);
                this.isSuccess = true;
            });
        }

    }

    mapToFormData(form:FormGroup): FormData {
        let formData:FormData = new FormData();
        formData.append('address2', this.address2File, this.address2File.name);
        formData.append('address1', form.get('address1').value);
        // formData.append('city', form.get('city').value);
        // formData.append('fax', form.get('fax').value);
        formData.append('postal_code', form.get('postal_code').value);
        // formData.append('state', form.get('state').value);
        // formData.append('country', form.get('country').value);
        // formData.append('type', form.get('type').value);
        
        return formData;
    }
}
