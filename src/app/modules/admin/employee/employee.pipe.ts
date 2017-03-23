import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterStartWith'
})
export class EmployeeStartWithPipe implements PipeTransform {

  transform(items: any, filter: any): any {
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
  name: 'filterMultipleStartWith'
})
export class EmployeeMultipleStartWithPipe implements PipeTransform {
  transform(items: any[], args: string[]): any[] {
    if (typeof items === 'object') {
      var resultArray = [];
      if (args.length === 0) {
        resultArray = items;
      } else {
        for (let item of items) {
          if ((item.first_name != null && item.first_name.match(new RegExp('^' + args, 'i'))) ||
            (item.title != null && item.title.match(new RegExp('^' + args, 'i')))) {
            resultArray.push(item);
          }
        }
      }
      return resultArray;
    }
    else {
      return null;
    }
  }
}