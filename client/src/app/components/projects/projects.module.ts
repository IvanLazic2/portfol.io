import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewProjectComponent } from './new-project/new-project.component';
import { ProjectsComponent } from './projects.component';
import { ProjectRoutingModule } from './projects-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SafeUrlPipe } from 'src/app/pipes/safeUrl/safe-url.pipe';
import { RouterModule } from '@angular/router';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { NgxDropzoneModule } from 'ngx-dropzone';


import { GalleryModule } from 'ng-gallery';
import { LightboxModule } from 'ng-gallery/lightbox';

//import { ImageViewerModule } from 'ngx-image-viewer';
import { ImageViewerModule } from '@devadri/ngx-imageviewer'

import { NgxMasonryModule } from 'ngx-masonry';

@NgModule({
  declarations: [
    ProjectsComponent,
    NewProjectComponent,
    ProjectDetailsComponent,

    SafeUrlPipe
  ],
  imports: [
    CommonModule,
    ProjectRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgxDropzoneModule,

    GalleryModule,
    LightboxModule,

    ImageViewerModule,
    NgxMasonryModule,
    
  ],
  exports: [
    ProjectsComponent
  ]
})
export class ProjectsModule { }
