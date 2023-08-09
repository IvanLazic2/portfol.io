import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewProjectComponent } from './new-project/new-project.component';
import { ProjectComponent } from './project.component';
import { ProjectRoutingModule } from './project-routing.module';



@NgModule({
  declarations: [
    ProjectComponent,
    NewProjectComponent
  ],
  imports: [
    CommonModule,
    ProjectRoutingModule
  ]
})
export class ProjectModule { }
