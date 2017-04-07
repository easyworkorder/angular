import { Directive, OnInit, ElementRef, Input, HostListener, NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

/**
 * Only number input allowed
 */
@Directive({
    selector: '[onlyNumber]'
})
export class OnlyNumberDirective {
    @HostListener('keypress', ['$event'])
    public onKeyPress(event) {
        if (checkZero(event)) {
            return false;
        }

        return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57;
    }
}

/**
 * Decimal number input allowed
 */
@Directive({
    selector: '[decimalNumber]'
})
export class DecimalNumberDirective {
    @HostListener('keypress', ['$event'])
    public onKeyPress(event) {
        if (checkZero(event)) {
            return false;
        }

        return (event.charCode == 8 || event.charCode == 0) ? null :
            ((event.charCode >= 48 && event.charCode <= 57) || (event.charCode == 46 && event.target.value.toString().indexOf('.') == -1));
    }
}

/**
 * Postal code input allowed with the postal code length
 * If postal code length not supplied it will take 5 length by default (USA postal code)
 */
@Directive({
    selector: '[postalCode]'
})
export class PostalCodeDirective {
    @Input('postalCode') postalCodeLength: number;

    @HostListener('keypress', ['$event'])
    public onKeyPress(event) {
        this.postalCodeLength = this.postalCodeLength || 5;
        return (event.charCode == 8 || event.charCode == 0) ? null :
            event.charCode >= 48 && event.charCode <= 57 && event.target.value.length < this.postalCodeLength;
    }
}

/**
 * Only allowed 0-100 input number
 */
@Directive({
    selector: '[percentage]'
})
export class PercentageDirective {
    maxLength: number = 3;
    inputVal: string;

    @HostListener('keypress', ['$event'])
    public onKeyPress(event) {
        // event.target.contentEditable = true;

        if (document.getSelection().toString() == event.target.value) {
            event.target.value = '';
        }
        // console.log('Test', document.getSelection.toString() === event.target.value);

        this.maxLength = this.maxLength || 3;
        this.inputVal = event.target.value + event.key;
        // if (this.inputVal.indexOf('0') == 0 && this.inputVal.lastIndexOf('0') == 1) return false;

        if (checkZero(event)) {
            return false;
        }

        return (event.charCode == 8 || event.charCode == 0) ? null : (event.charCode >= 48 && event.charCode <= 57 &&
            (/^[0-9]{1,2}$|^100$/.test(this.inputVal)) &&
            event.target.value.length < this.maxLength
        );
    }
}

@Directive({
    selector: '[phoneNumber]'
})
export class PhoneNumberDirective {
    @Input('phoneNumber') phoneNumberLength: number;

    @HostListener('keypress', ['$event'])
    public onKeyPress(event) {
        this.phoneNumberLength = this.phoneNumberLength || 10;
        if (document.getSelection().toString() == event.target.value) {
            event.target.value = '';
        }
        return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57 &&
        event.target.value.length < this.phoneNumberLength;
    }
}


function checkZero(event) {
    let inputVal = event.target.value + event.key;
    // if (this.inputVal.indexOf('0') == 0 && this.inputVal.lastIndexOf('0') == 1) return false;
    return (inputVal.indexOf('0') == 0 && inputVal.lastIndexOf('0') == 1);
}

const INPUT_DIRECTIVES = [
    OnlyNumberDirective,
    DecimalNumberDirective,
    PostalCodeDirective,
    PercentageDirective,
    PhoneNumberDirective
]

@NgModule({
    imports: [CommonModule],
    exports: [INPUT_DIRECTIVES],
    declarations: [INPUT_DIRECTIVES]
})
export class InputValueRestrictionModule { }