import { Directive, OnInit, ElementRef, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ValidationService } from '../services/validation.service';


// - highlight "invalid" fields: mdl classes
// - set error message with custom prop: control.error
//
// usage example:
// <input [formControlValidator]="form.controls.field" formControlName="field" ... >
//
// ! set "novalidate" propetry for form tags (no turn browser validation off)
@Directive({
  selector: '[formControlValidator]'
})
export class FormControlValidator implements OnInit {
  @Input('formControlValidator') control: FormControl;

  private el: HTMLElement;
  private elForm: HTMLElement;

  constructor(el: ElementRef) {
    this.el = el.nativeElement;
    // this.elForm = <HTMLElement> this.el.closest('form');
  }

  ngOnInit() {
    this.elForm = this.el && <HTMLElement>this.el.closest('form');
    // validate on change
    this.control.statusChanges.subscribe(() => {
      this._set(this.control);
    });

    // validate on blur
    this.el && this.el.addEventListener('blur', (e) => {
      this.control.invalid ? this._setInvalid(this.el) : this._setValid(this.el);
    });

    // validate on submit
    this.elForm && this.elForm.addEventListener('submit', (e) => {
      this.control.markAsDirty(true);
      this._set(this.control);
    });
  }

  _set(control: FormControl) {
    if (control.valid) {
      this._setValid(this.el);
    } else if (control.dirty) {
      this._setInvalid(this.el);
    }
  }

  _setValid(el: HTMLElement) {
    delete this.control['error'];
    el['setCustomValidity']('');
    el.parentNode['classList'].remove('is-invalid');
  }

  _setInvalid(el: HTMLElement) {
    let key = Object.keys(this.control.errors)[0];
    // let message = this.control.errors[key].message || 'Invalid value';
    let message =  ValidationService.getValidatorErrorMessage(key, this.control.errors[key]);

    // hardfix error message(s)
    this.control.errors && this.control.errors['requred'] && (this.control.errors['required']['message'] = 'Required');

    this.control['error'] = message;
    el['setCustomValidity'](message); // @TODO: is it needed?
    el.parentNode['classList'].add('is-invalid');
  }
}
