import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SortByPipe } from './sortBy/sort-by.pipe';
import { FilterPipe } from './filter/filter.pipe';



@NgModule({
  declarations: [
    SortByPipe,
    FilterPipe,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SortByPipe,
    FilterPipe,
  ]
})
export class CommonPipesModule { }
