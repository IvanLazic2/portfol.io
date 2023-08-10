import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewProjectComponent } from './new-project/new-project.component';
import { ProjectComponent } from './project.component';
import { ProjectRoutingModule } from './project-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SafeUrlPipe } from 'src/app/pipes/safeUrl/safe-url.pipe';



@NgModule({
  declarations: [
    ProjectComponent,
    NewProjectComponent,

    SafeUrlPipe
  ],
  imports: [
    CommonModule,
    ProjectRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ProjectModule { }
