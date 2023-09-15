import { Pipe, PipeTransform } from '@angular/core';
import { orderBy } from 'lodash';

@Pipe({
  name: 'sortBy'
})
export class SortByPipe implements PipeTransform {

  transform(value: any[], order: boolean | 'asc' | 'desc' = 'desc', property: string = ''): any[] {
    if (!value || !order) { return value; }
    if (value.length <= 1) { return value; }
    if (!property || property === '') { 
      if(order==='asc'){return value.sort()}
      else{return value.sort().reverse();}
    }
    return orderBy(value, [property], [order]);
  }
}
