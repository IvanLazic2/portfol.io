import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IfrolesDirective } from './ifroles/ifroles.directive';



@NgModule({
  declarations: [
    IfrolesDirective,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    IfrolesDirective
  ]
})
export class CommonDirectivesModule { }
