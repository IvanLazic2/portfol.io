import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(items: any[], propertes: string[], searchText: string): any[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLocaleLowerCase();

    return items.filter(function (val) {
      let result: boolean = false;

      propertes.forEach(property => {
        result ||= val[property].toLocaleLowerCase().includes(searchText);
      });
      
      return result;
    });
  }
}
