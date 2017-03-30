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
        // this.http.post('http://localhost:8080/api/address/', item);
    }

    // saveTask() {
    //     this.taskForm.value.file = this.file;
    //     console.log(this.taskForm.value);
    //     this.taskService.addTask(this.file).subscribe(
    //     (data) => {
    //         console.log(data)
    //     },
    //     (error) => {
    //         console.log(error)
    //     }
    //     );
    // }


    // onChange(event) {
    //     let files = event.target.files;
    //     console.log(files);
    //     let formData: FormData = new FormData();
    //     formData.append('photo', files[0], files[0].name);
    //     //if (files.length > 0) {
    //     //  let formData: FormData = new FormData();
    //     //  for (let file of files) {
    //     //    formData.append('files', file, file.name);
    //     //  }
    //     console.log(formData);
    //     // this.file = formData
        
    // }

    fileChange(event) {
        let fileList: FileList = event.target.files;
        if(fileList.length > 0) {
            let file: File = fileList[0];
            let formData:FormData = new FormData();
            formData.append('address2', file, file.name);
            let headers = new Headers();
            // headers.append('Content-Type', 'multipart/form-data');
            // headers.append('Content-Type', 'undefined');
            headers.append('Accept', 'application/json');
            headers.append(config.api.tokenLabel, this.http.getToken());
            // let options: RequestOptionsArgs;
            let options = {};
            options['headers'] = headers;
            // let options = new RequestOptions({ headers: headers });
            // let options.
            this.myHttp.post('http://localhost:8080/api/address/', formData, options)
                .map(res => res.json())
                .catch(error => Observable.throw(error))
                .subscribe(
                    data => console.log('success'),
                    error => console.log(error)
                )
        }
    }

    newOnSubmit() {

    }


    // addTask(model:any): Observable<TaskId> {
    //     let headers = new Headers();
    //     headers.set('Accept', 'application/json');
    //     // headers.set('Authorization', 'JWT ' + localStorage.getItem('id_token'));
    //     // headers.set('Content-Type', 'multipart/form-data' );
    //     // headers.set('Content-Type', 'application/json' );
    //     headers.set('Content-Type', '*/*' );
    //     let options = new RequestOptions({ headers: headers });
        
    //     return this.myHttp.post('address', model, options).map((response: Response) => response.json());
    // }
}
