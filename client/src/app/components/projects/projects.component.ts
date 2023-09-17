import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, firstValueFrom, lastValueFrom } from 'rxjs';
import { ProjectService } from 'src/app/components/projects/project.service';
import { GalleryItem, ImageItem, Gallery, ImageSize, ThumbnailsPosition, GalleryRef } from 'ng-gallery';
import { Lightbox } from "ng-gallery/lightbox";
import { NgxMasonryOptions } from 'ngx-masonry';
import { UploadService } from 'src/app/services/upload/upload.service';
import { UserService } from 'src/app/components/user/user.service';
import { faArrowUp, faEdit, faHeart, faPen, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  upIcon: any = faArrowUp;
  editIcon: any = faPen;
  deleteIcon: any = faTrash;
  solidHeartIcon: any = faHeart;
  regularHeartIcon: any = faHeartRegular;

  //@Input() Username: string;

  //Projects: any[];

  searchValue: string = '';
  sortProperty: string = 'DateCreated';
  sortOrder: boolean | 'asc' | 'desc' = 'desc';

  SortDropdownLabel: string = "Date Created";

  ProjectLikes: { [key: string]: number } = {};
  ProjectIsLiked: { [key: string]: boolean } = {};

  restArray: any[] = [];

  constructor(
    public gallery: Gallery,
    public lightbox: Lightbox,
    protected uploadService: UploadService,
    protected projectService: ProjectService,
    private router: Router,
    protected userService: UserService,
  ) { }

  async ngOnInit() {
    this.gallery.config.loadingStrategy = 'lazy';
    await this.getProjects();
    //this.galleriesInit();
    
  }

  private async getProjects() {
    /*if (this.Username && this.Username.length > 0) {
      this.Projects$ = this.projectService.GetProjects(this.Username);
      this.Projects = await lastValueFrom(this.Projects$);
    }*/

    //this.Projects = await lastValueFrom(this.projectService.GetProjects(this.userService.CurrentUser.Username));

    await this.projectService.GetProjects(this.userService.CurrentUser.Username);

    for (const project of this.projectService.CurrentProjects) {
      this.ProjectLikes[project.Id] = project.Likes;
      if (this.userService.GetIsLoggedIn()) {
        this.ProjectIsLiked[project.Id] = await lastValueFrom<boolean>(this.projectService.GetProjectIsLiked(project.Id));
      }
    }
  }

  getUploadIds(project: any) {
    let result = [];

    if (!project.HighlightedUploadId) {
      result = project.UploadIds.slice(1, 5);
    }
    else {
      result = project.UploadIds.filter((val : any) => { return val !== project.HighlightedUploadId }).slice(0, 5);
    }

    const restCount = 5 - result.length;

    this.restArray = Array.from({  length: restCount }, (_, i) => i);

    return result;
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

  onSearch(event: any) {
    this.searchValue = event.target.value;
  }

  toggleSortOrder() {
    if (this.sortOrder == 'asc') {
      this.sortOrder = 'desc';
    } else {
      this.sortOrder = 'asc';
    }
  }

  protected async LikeProject(id: string) {
    const result = await lastValueFrom(this.projectService.LikeProject(id));

    console.log(result)

    this.ProjectLikes[id] += 1;
    this.ProjectIsLiked[id] = true;
  }

  protected async UnlikeProject(id: string) {
    const result = await lastValueFrom(this.projectService.UnlikeProject(id));
    this.ProjectLikes[id] -= 1;
    this.ProjectIsLiked[id] = false;
  }

  protected async onClickLike(id: string) {
    if (this.ProjectIsLiked[id]) {
      await this.UnlikeProject(id);
    } 
    else {
      await this.LikeProject(id);
    }
  }
}


