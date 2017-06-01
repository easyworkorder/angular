import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService, AppHttp } from 'app/services';
import { ToasterService } from 'angular2-toaster';
import { VendorService } from 'app/modules/admin/vendor/vendor.service';
import { VendorContact } from 'app/modules/admin/contact-profile-card/vendor-contact';
import { ProblemTypeService } from "app/modules/admin/problem_type/problem_type.service";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
declare var $: any;

@Component({
    selector: 'ewo-vendor-contact-profile-card',
    templateUrl: './vendor-contact-profile-card.component.html'
})
export class VendorContactProfileCardComponent implements OnInit {
    @Input() vendor: any;
    @Input() contactInfo: VendorContact;
    @Output('update') change: EventEmitter<any> = new EventEmitter<any>();
    @Input() isAdmin: boolean = false;
    editClicked: Subject<any> = new Subject<any>();

    contact: VendorContact;
    address: any;
    fullName: string;
    photo: string;
    vendorInfo: any;
    constructor(private vendorService: VendorService,
        protected http: AppHttp,
        private toasterService: ToasterService,
        private dataService: DataService,
        private route: ActivatedRoute) {
    }

    ngOnInit () {
        this.contactInfo = new VendorContact('', '', '', '', '', '', '', '', '', '', '', '');
    }

    ngOnChanges (changes) {
        if (changes['contactInfo']) {
            if (changes['contactInfo'].currentValue) {
                this.contact = changes['contactInfo'].currentValue;
                this.fullName = this.dataService.buildName(this.contact.first_name, this.contact.last_name);
                this.address = this.dataService.buildVendorAddressHtml(this.contact, true);
                this.photo = this.dataService.getPhotoUrl(this.contact.photo);
            }
        }

        if (changes['vendor']) {
            if (changes['vendor'].currentValue) {
                this.vendorInfo = changes['vendor'].currentValue;
            }
        }
    }

    onModalOkButtonClick (event) {
        const observable = this.http.get('sendpassword/' + this.contact.id + '/?type=vendor');
        observable.subscribe(data => {
            this.toasterService.pop('success', 'SEND', 'Password has been send successfully');
        },
            error => {
                this.toasterService.pop('error', 'SEND', 'Password not send due to API error!!!');
            });
        $('#modal-send-password-confirm').modal('hide');
    }

    editVendor (contact) {
        this.editClicked.next(this.vendor);
        $('#edit-vendor-modal').modal({
            modal: 'show',
            backdrop: 'static'
        });
    }
    updateVendor (tenant) {
        this.change.emit(tenant);
    }
}
