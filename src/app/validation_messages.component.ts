import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ValidationService } from './services/validation.service';

@Component({
  selector: 'validation-messages',
  template: `<div class="" *ngIf="hasError">{{error}}</div>`
})
export class ValidationMessagesComponent {
  @Input() control: FormControl;
  @Input() el: HTMLElement;
  private elForm: HTMLElement;
  error: any;
  hasError = false;

  constructor() { }

  ngOnInit() {
    if(!this.el) return;

    this.el = <HTMLElement>this.el;
    this.elForm = this.el && <HTMLElement>this.el.closest('form');

    this.control.statusChanges.subscribe(() => {
      this.control.touched && this.errorMessage();
    });

    // validate on blur
    this.el.addEventListener('blur', (e) => {
      this.errorMessage();

    });

    // validate on submit
    this.elForm && this.elForm.addEventListener('submit', (e) => {
      this.control.markAsDirty(true);
      this.errorMessage();
    });
  }


  errorMessage() {
    for (let propertyName in this.control.errors) {
      if (this.control.errors.hasOwnProperty(propertyName)) {
        // return ValidationService.getValidatorErrorMessage(propertyName, this.control.errors[propertyName]);
        this.error = ValidationService.getValidatorErrorMessage(propertyName, this.control.errors[propertyName]);
        this.hasError = true;
        return true;
      }
    }

    this.error = null;
    this.hasError = false;
    // return null;
  }
}