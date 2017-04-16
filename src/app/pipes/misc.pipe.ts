import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DatePipe } from "@angular/common";

@Pipe({ name: 'truncate' })
export class TruncatePipe implements PipeTransform {

  /**
   *
   * @param value
   * @param args
   *  arg[0] - limitTo value
   *  arg[1] - suffix
   * @returns {string}
   */
  transform (value: string, ...args: string[]): string {
    // TODO: should we use suffix when we don't truncate?
    // TODO: should we use 0 value? now 0 value cause default
    let limitTo = parseInt(args[0]) || 15;
    let suffix = args[1] || '...';

    value += '';
    return value.length <= limitTo ? value : value.substring(0, limitTo) + suffix;
  }
}

@Pipe({ name: 'pluralize' })
export class PluralizePipe implements PipeTransform {
  /**
   *
   * @param value
   * @param label
   * @param plural
   * There are 3 variants of usage:
   *  with label like 'item' -> returns 'item' for 1 and 'items' for other
   *  with label like 'child' and plural like 'children' -> returns 'child' for 1 and 'children' for other
   *  with label like complex object { '0': 'No items', '1': 'Just one', 'other': '{} items' }
   *    -> returns 'No items' for 0
   *    -> returns 'Just one' for 1 (and you can specify any other specific count)
   *    -> returns '8 items' for 8 and etc
   * @returns {any}
   */
  transform (value: number, label: string | Object, plural?: string): string {
    // TODO: some util func for this isObject checking?
    if (typeof label == 'object') {
      let pattern = label[value] ? label[value] : label['other'];
      return (pattern.indexOf('{}') !== -1) ? pattern.replace('{}', value) : pattern;
    }

    // TODO: is it normal that we use plural for 0 count?
    return value == 1 ? <string>label : (plural ? plural : <string>label + 's');
  }
}

@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {
    this.sanitizer = sanitizer;
  }

  transform (value: any) {
    return this.sanitizer.bypassSecurityTrustStyle(value);
  }
}

@Pipe({
  name: 'filterWithStartLetter'
})
export class FilterWithStartLetterPipe implements PipeTransform {

  transform (items: any, filter: any): any {
    if (filter && Array.isArray(items)) {
      let filterKeys = Object.keys(filter);
      return items.filter(item =>
        filterKeys.reduce((memo, keyName) =>
          (memo && new RegExp('^' + filter[keyName], 'i').test(item[keyName])) || filter[keyName] === "", true));
    } else {
      return items;
    }
  }
}

@Pipe({
  name: 'phone'
})
export class PhonePipe implements PipeTransform {
  transform (val) {
    if (!val) return;
    let viewVal = val.trim().replace(/^\+/, '');
    viewVal = viewVal.replace(/[^0-9]/g, '').slice(0, 10);
    let area, number;

    switch (viewVal.length) {
      case 1:
      case 2:
      case 3:
        area = viewVal;
        break;
      default:
        area = viewVal.slice(0, 3);
        number = viewVal.slice(3);
    }

    if (number) {
      if (number.length > 3) {
        number = number.slice(0, 3) + '-' + number.slice(3, 7);
      } else {
        number = number;
      }
      return ('(' + area + ') ' + number).trim().slice(0, 13);
    } else {
      return '(' + area + ')';
    }
  }
}

@Pipe({ name: 'dateFormat' })
export class DateFormatPipe implements PipeTransform {
  datePipe = new DatePipe('en-US');
  transform (value: any) {
    return this.datePipe.transform(value, 'MM/dd/yyyy');
  }
}

@Pipe({ name: 'ticketListdateFormat' })
export class TicketListDateFormatPipe implements PipeTransform {
  datePipe = new DatePipe('en-US');
  transform (value: any) {
    return this.datePipe.transform(value, 'hh:mm, MM/dd/yyyy');
  }
}