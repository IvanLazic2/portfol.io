import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, firstValueFrom, lastValueFrom } from 'rxjs';
import { ProjectService } from 'src/app/services/project/project.service';
import { GalleryItem, ImageItem, Gallery, ImageSize, ThumbnailsPosition, GalleryRef } from 'ng-gallery';
import { Lightbox } from "ng-gallery/lightbox";
import { NgxMasonryOptions } from 'ngx-masonry';
import { UploadService } from 'src/app/services/upload/upload.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  Projects$: Observable<any[]>;
  Projects: any[];

  constructor(
    public gallery: Gallery,
    public lightbox: Lightbox,
    protected uploadService: UploadService,
    private projectService: ProjectService,
    private router: Router,
    protected userService: UserService,
  ) { }

  async ngOnInit() {
    this.gallery.config.loadingStrategy = 'lazy';
    await this.getProjects();
    //this.galleriesInit();
  }

  private async getProjects() {
    this.Projects$ = this.projectService.GetProjects();
    this.Projects = await lastValueFrom(this.Projects$);
  }

  /*galleriesInit() {
    for (const project of this.Projects) {
      const gallery = this.gallery.ref('gallery_' + project.Id);

      this.addImages(project, gallery);
    }

    this.lightbox.setConfig({
      panelClass: undefined,
    });
  }

  private addImages(project: any, gallery: GalleryRef) {
    const galleryItems = project.UploadIds.map((uploadId: any) => {
      const item = new ImageItem({ src: this.uploadService.UploadUrl + uploadId, thumb: this.uploadService.ThumbnailUrl + uploadId })
      //const item = new ImageItem({ src: '/api/upload/' + thumbnail.UploadId, thumb: '/api/thumbnail/' + thumbnail.UploadId })
      return item;
    });

    gallery.load(galleryItems);
  }*/

  protected DetailsProject(id: string) {
    this.projectService.setIsEditing(false);
    this.router.navigate(['/project', id]);
  }

  protected EditProject(id: string) {
    this.projectService.setIsEditing(true);
    this.router.navigate(['/project', id]);
  }

  protected async DeleteProject(id: string) {
    const result = await firstValueFrom(this.projectService.DeleteProject(id));
    await this.getProjects();
  }
}
