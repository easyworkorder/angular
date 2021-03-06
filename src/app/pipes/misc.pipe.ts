import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DatePipe } from "@angular/common";

import * as moment from 'moment';

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
    if (!val) return '';
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
      return ('(' + area + ') ' + number).trim().slice(0, 14);
    } else {
      return '(' + area + ')';
    }
  }
}

@Pipe({ name: 'dateFormat' })
export class DateFormatPipe implements PipeTransform {
  datePipe = new DatePipe('en-US');
  transform (value: any) {
    // return this.datePipe.transform(value, 'MM/dd/yyyy');
    return moment(value).format('MM/DD/YYYY');
  }
}

@Pipe({ name: 'ticketListdateFormat' })
export class TicketListDateFormatPipe implements PipeTransform {
  datePipe = new DatePipe('en-US');
  transform (value: any) {
    // return this.datePipe.transform(value, 'hh:mm a, MM/dd/yyyy');
    return moment(value).format('hh:mm A, MM/DD/YYYY');
  }
}

@Pipe({ name: 'ticketDetailsdateFormat' })
export class TicketDetailsDateFormatPipe implements PipeTransform {
  datePipe = new DatePipe('en-US');
  transform (value: any) {
    // return this.datePipe.transform(value, 'MM/dd/yyyy, hh:mm a');
    return moment(value).format('MM/DD/YYYY, hh:mm A');
  }
}


@Pipe({ name: 'messageDateFormat' })
export class MessageDateFormatPipe implements PipeTransform {
  datePipe = new DatePipe('en-US');
  transform (value: any) {
    // return this.datePipe.transform(value, 'MM/dd/yyyy, hh:mm a');
    return moment(value).format('MM/DD/YYYY, hh:mm A');
  }
}

@Pipe({ name: 'orderBy', pure: false })
export class OrderByPipe implements PipeTransform {

  static _orderByComparator (a: any, b: any): number {

    if ((isNaN(parseFloat(a)) || !isFinite(a)) || (isNaN(parseFloat(b)) || !isFinite(b))) {
      //Isn't a number so lowercase the string to properly compare
      if (a.toLowerCase() < b.toLowerCase()) return -1;
      if (a.toLowerCase() > b.toLowerCase()) return 1;
    }
    else {
      //Parse strings as numbers to compare properly
      if (parseFloat(a) < parseFloat(b)) return -1;
      if (parseFloat(a) > parseFloat(b)) return 1;
    }

    return 0; //equal each other
  }

  transform (input: any, [config = '+']): any {

    if (!Array.isArray(input)) return input;

    if (!Array.isArray(config) || (Array.isArray(config) && config.length == 1)) {
      var propertyToCheck: string = !Array.isArray(config) ? config : config[0];
      var desc = propertyToCheck.substr(0, 1) == '-';

      //Basic array
      if (!propertyToCheck || propertyToCheck == '-' || propertyToCheck == '+') {
        return !desc ? input.sort() : input.sort().reverse();
      }
      else {
        var property: string = propertyToCheck.substr(0, 1) == '+' || propertyToCheck.substr(0, 1) == '-'
          ? propertyToCheck.substr(1)
          : propertyToCheck;

        return input.sort(function (a: any, b: any) {
          return !desc
            ? OrderByPipe._orderByComparator(a[property], b[property])
            : -OrderByPipe._orderByComparator(a[property], b[property]);
        });
      }
    }
    else {
      //Loop over property of the array in order and sort
      return input.sort(function (a: any, b: any) {
        for (var i: number = 0; i < config.length; i++) {
          var desc = config[i].substr(0, 1) == '-';
          var property = config[i].substr(0, 1) == '+' || config[i].substr(0, 1) == '-'
            ? config[i].substr(1)
            : config[i];

          var comparison = !desc
            ? OrderByPipe._orderByComparator(a[property], b[property])
            : -OrderByPipe._orderByComparator(a[property], b[property]);

          //Don't return 0 yet in case of needing to sort by next property
          if (comparison != 0) return comparison;
        }

        return 0; //equal each other
      });
    }
  }
}


@Pipe({ name: 'fileSize' })
export class FileSizePipe implements PipeTransform {
  private units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

  transform (bytes: number = 0, precision: number = 2): string {
    if (isNaN(parseFloat(String(bytes))) || !isFinite(bytes)) return '?';
    let unit = 0;
    while (bytes >= 1024) {
      bytes /= 1024;
      unit++;
    }
    return bytes.toFixed(+ precision) + ' ' + this.units[unit];
  }
}