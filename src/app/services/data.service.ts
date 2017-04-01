import { Injectable } from '@angular/core';
import { FormControl, FormGroup, FormArray, AbstractControl } from '@angular/forms';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { TObjectId } from '../interfaces/common.interface';
import { IEvent } from '../interfaces/event.interface';

import config from '../config';
// import { Storage} from './index';

import {
    EventService,
} from './index';

@Injectable()
export class DataService {

    protected _type = null; // should be assigned in child services

    protected _params = { // snakecase naming
        page: 1,
        page_size: 30,
    };

    protected _data: any = {
        list: null,
        view: null,
        edit: null,
    };

    protected _observables: any = {
        list: null, // Experimental
        view: null,
        edit: null,
    };

    public data = this._data;
    public observables = this._observables;

    constructor(
        protected events: EventService,
        // private storage: Storage
    ) {
        // init observers
        ['list', 'view', 'edit'].forEach(prop => {
            let observable = new ReplaySubject(1); // buffer last value
            this._observables[prop] = observable;
        });

        // init refresh
        this.events
            .filter(e => e.type == 'PROCESS_COMPLETED')
            .subscribe((event: IEvent) => this.refresh(event.data.targetId, event.data.target));

        // init reset
        this.events
            .filter(e => e.type == 'USER_SIGNOUT')
            .subscribe((event: IEvent) => this.reset(this._data));
    }

    private _cloneForm(abstractControl: AbstractControl): AbstractControl {
        // experimental and weird
        // supposed to be used to clone ControlArray elements
        let control: FormControl | FormGroup | FormArray;

        // ControlGroup
        if (abstractControl instanceof FormGroup) {
            let props = Object.keys(abstractControl.controls);
            control = <FormGroup>new FormGroup({}, abstractControl.validator, abstractControl.asyncValidator);

            for (let i = 0; i < props.length; ++i) {
                let abstractControlItem = abstractControl.controls[props[i]];
                control.addControl(props[i], this._cloneForm(abstractControlItem));
            }
        }

        // ControlArray
        if (abstractControl instanceof FormArray) {
            let length = abstractControl.controls.length;
            control = <FormArray>new FormArray([], abstractControl.validator, abstractControl.asyncValidator);

            for (let i = 0; i < length; ++i) {
                let abstractControlItem = abstractControl.controls[i];
                control.push(this._cloneForm(abstractControlItem));
            }
        }

        // Control
        if (abstractControl instanceof FormControl) {
            // how to set default values? :/
            control = new FormControl(null, abstractControl.validator, abstractControl.asyncValidator);
        }

        return control;
    }

    // TODO: how about to drop it to replace with FormGroup.patchValue
    private _editForm(abstractControl: AbstractControl, data: any): void {
        // set initial values for form controls (recursively)
        if (data === undefined) { return; }

        // ControlGroup
        if (abstractControl instanceof FormGroup) {

            data = data || {};
            let props = Object.keys(abstractControl.controls);

            for (let i = 0; i < props.length; ++i) {
                let abstractControlItem = abstractControl.controls[props[i]];
                this._editForm(abstractControlItem, data[props[i]]);
            }
        }

        // ControlArray
        if (abstractControl instanceof FormArray) {

            data = data || [];
            let length = Math.max(abstractControl.controls.length, data.length);

            for (let i = 0; i < length; ++i) {
                let abstractControlItem = abstractControl.controls[i] || this.__editFormExtendArray(abstractControl);
                this._editForm(abstractControlItem, data[i]);
            }
        }

        // Control
        if (abstractControl instanceof FormControl) {
            abstractControl.setValue(data, { emitEvent: false, emitModelToViewChange: false }); // do it silently (last param)
        }
    }

    private __editFormExtendArray(controlArray: FormArray): AbstractControl {
        // to extend control array (see _editForm)
        let prototypeControl = controlArray.controls[0] || new FormControl(); // could be even smarter
        let control: AbstractControl = this._cloneForm(prototypeControl);

        controlArray.push(control);
        return control;
    }

    view(item?: Object): void {
        const data = item ? Object.assign({}, item) : null;

        this._data.view = data;
        this._observables.view.next(data);
    }

    edit(item?: Object): void {
        item = item || this._data.view; // || {}
        const data = item ? Object.assign({}, item) : null;

        this._data.edit = data;
        this._observables.edit.next(data);
    }

    editForm(form: FormGroup, item?: Object): void {
        item = item || this._data.view || {};
        const data = Object.assign({}, item);

        this._editForm(form, data);

        this._data.edit = data;
        this._observables.edit.next(data);
    }

    trackBy(index: number, item): any {
        return item && item['id'];
    }

    // experimental
    reset(obj: Object) {
        Object.keys(obj).forEach(prop => { delete obj[prop]; });
    }

    // experimental
    refresh(id: TObjectId, type: string) {
        type = type || this._type;
        if (type != this._type) { return; }

        // update list
        let list = (this._data.list || []).map(item => item.id);
        list.length && list.indexOf(id) > -1 && this['list'] && this['list']();

        // update view
        this._data.view && this._data.view.id == id && this['retrive'] && this['retrive'](id);

        // update edit
        //this._data.edit && this._data.edit.id == id && this['retrive'] && this['retrive'](id);
    }

    // Few Common Methods used in different components
    buildName(firstName: string, lastName: string) {
        if (firstName != null && firstName.length > 0 && lastName != null && lastName.length > 0) {
            return firstName + ' ' + lastName;
        }
        if (firstName != null && firstName.length > 0)
            return firstName;
        if (lastName != null && lastName.length > 0)
            return lastName;
        return '';
    }

    buildAddressHtml(tenantContact: any, companyName: string) {
        var html = '<strong>' + companyName + '</strong><br />';
        if (tenantContact.unitNo != null && tenantContact.unitNo.length > 0)
            html += tenantContact.unitNo + '<br />';
        if (tenantContact.title != null && tenantContact.title.length > 0)
            html += tenantContact.title + '<br />';
        var extension = (tenantContact.extension != null && tenantContact.extension.length > 0) ? (' ext. ' + tenantContact.phone_extension) : '';
        if (tenantContact.phone != null && tenantContact.phone.length > 0)
            html += 'P: ' + tenantContact.phone + extension;

        return html;
    }

    buildVendorAddressHtml(contact: any, companyName: string) {
        var html = '<strong>' + this.buildName(contact.first_name, contact.last_name) + '</strong><br />';
            html += contact.address + '<br />';
            html += contact.city + ', '+ contact.state + ' '+ contact.postal_code+'<br />';
        var extension = (contact.phone_extension != null && contact.phone_extension.length > 0) ? (' ext. ' + contact.phone_extension) : '';
        if (contact.phone != null && contact.phone.length > 0)
            html += 'P: ' + contact.phone + extension;

        return html;
    }

    getPhotoUrl(photo: string) {
        if (photo != null && photo.length > 0)
            return photo;
        return 'assets/img/placeholders/avatars/avatar9.jpg';
    }

    stopPropagation(event) {
        event.stopPropagation()
    }

    mapToFormData(form:FormGroup, fileFieldKeys: string[]): FormData {
        let formData:FormData = new FormData();
        Object.keys(form.controls);
        for (let key of Object.keys(form.controls)) {
            if(fileFieldKeys.indexOf(key) < 0 ) {
                formData.append(key, form.get(key).value);
            }
        }
        return formData;
    }

}
