import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewProjectComponent } from '../../project/new-project/new-project.component';
import { UserSidebarComponent } from './user-sidebar/user-sidebar.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RoutingModule } from 'src/app/routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SidebarComponent } from './sidebar.component';
import { NewProjectSidebarComponent } from './new-project-sidebar/new-project-sidebar.component';
import { IfrolesDirective } from 'src/app/directives/ifroles/ifroles.directive';
import { CommonDirectivesModule } from 'src/app/directives/common-directives.module';



@NgModule({
  declarations: [
    NavbarComponent,
    SidebarComponent,
    UserSidebarComponent,
    NewProjectSidebarComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    RoutingModule,
    FontAwesomeModule,
    CommonDirectivesModule
  ],
  exports: [
    SidebarComponent
  ]
})
export class SidebarModule { }
