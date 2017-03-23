import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AddressService } from './address.service';
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

  constructor(private addressService: AddressService) {
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
    let val = this.addressCreateForm.value;
    this.addressService.create(this.addressCreateForm.value).subscribe((address: any) => {
      console.log('Address created', address);
      this.addresses.push(address);
      this.isSuccess = true;
    });

    // this.http.post('http://localhost:8080/api/address/', item);
  }
}
