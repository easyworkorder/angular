import { AbstractControl, FormGroup, Validators, FormControl } from '@angular/forms';

// copied from '@angular/common/src/forms/directives/validators';
interface Validation { [key: string]: any; }
interface ValidatorFn { (c: AbstractControl): Validation; }

export class AppValidators {

  static _regex = {
    number: /^\d+$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    url: /^https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,}$/,
    date: /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/, // YYYY-MM-DD,
    password: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\W\s]).{10,}$/,
  };

  // to match regex pattern
  static match (pattern: RegExp | string = /^.*$/): ValidatorFn {
    pattern = (typeof pattern == 'string') ? RegExp(<any>pattern) : pattern;

    return (control: AbstractControl): Validation => {
      const value = control.value ? '' + control.value : '';

      return value.match(<RegExp>pattern) ? null :
        { match: { error: 'Invalid value', actualValue: value, pattern: pattern } };
    };
  }

  static _validators = {
    number: AppValidators.match(AppValidators._regex.number),
    email: AppValidators.match(AppValidators._regex.email),
    url: AppValidators.match(AppValidators._regex.url),
    date: AppValidators.match(AppValidators._regex.date),
    password: AppValidators.match(AppValidators._regex.password),
  };

  static equal (equal: string): ValidatorFn {
    return (control: AbstractControl): Validation => {
      //@todo i guess it's might be other ways to determine wheater control has binded or not
      if (control['_onChange'].length) {
        let targetControl: AbstractControl = control.root.get(equal);

        return targetControl && targetControl.touched && targetControl.value == control.value ? null :
          { equal: { message: 'Not equal to test value', actualValue: control.value, requiredValue: targetControl.value } };
      }
    };
  }

  static number (control: AbstractControl): Validation {
    return !AppValidators._validators.number(control) ? null :
      { number: { message: 'Invalid number', actualValue: control.value, pattern: AppValidators._regex.number } };
  }

  static email (control: AbstractControl): Validation {
    return !AppValidators._validators.email(control) ? null :
      { email: { message: 'Invalid email', actualValue: control.value, pattern: AppValidators._regex.email } };
  }

  static url (control: AbstractControl): Validation {
    return !AppValidators._validators.url(control) ? null :
      { url: { message: 'Invalid url', actualValue: control.value, pattern: AppValidators._regex.url } };
  }

  static date (control: AbstractControl): Validation {
    return !AppValidators._validators.date(control) ? null :
      { date: { message: 'Invalid date', actualValue: control.value, pattern: AppValidators._regex.date } };
  }

  static password (control: AbstractControl): Validation {
    return !AppValidators._validators.password(control) ? null :
      { password: { message: 'Invalid password', actualValue: control.value, pattern: AppValidators._regex.password } };
  }

  static isTrue (control: AbstractControl): Validation {
    return control.value == true ? null :
      { isTrue: { message: 'Invalid', actualValue: control.value, requiredValue: true } };
  }

  static isFalse (control: AbstractControl): Validation {
    return control.value == false ? null :
      { isFalse: { message: 'Invalid', actualValue: control.value, requiredValue: false } };
  }

  // TODO: think about it... maybe we need to pass param with minimal length or something...
  //static array(control: AbstractControl): Validation {
  //  return (control.value && control.value.length) ? null : // TODO maybe Array.isArray()?
  //    { array: { valid: false } };
  //}

}

