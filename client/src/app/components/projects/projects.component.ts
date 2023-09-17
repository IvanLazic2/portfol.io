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
import { ToastService } from 'src/app/services/toast/toast.service';

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

  searchValue: string = '';
  sortProperty: string = 'DateCreated';
  sortOrder: boolean | 'asc' | 'desc' = 'desc';

  SortDropdownLabel: string = "Date Created";

  ProjectDictionary: { [key: string]: any } = {};
  ProjectIsLiked: { [key: string]: boolean } = {};

  restArray: any[] = [];

  constructor(
    public gallery: Gallery,
    public lightbox: Lightbox,
    protected uploadService: UploadService,
    protected projectService: ProjectService,
    private router: Router,
    protected userService: UserService,
    private toastService: ToastService,
  ) { }

  async ngOnInit() {
    this.gallery.config.loadingStrategy = 'lazy';
    await this.getProjects();
    
  }

  private async getProjects() {
    await this.projectService.GetProjects(this.userService.CurrentUser.Username);

    for (const project of this.projectService.CurrentProjects) {
      this.ProjectDictionary[project.Id] = project;
      if (this.userService.GetIsLoggedIn()) {
        this.ProjectIsLiked[project.Id] = await lastValueFrom<boolean>(this.projectService.GetProjectIsLiked(project.Id));
      }
    }
  }

  getUploadIds(project: any) {
    let result = [];

    if (!project.HighlightedUploadId) {
      result = project.UploadIds.slice(1, 6);
    }
    else {
      result = project.UploadIds.filter((val : any) => { return val !== project.HighlightedUploadId }).slice(0, 5);
    }

    const restCount = 5 - result.length;

    this.restArray = Array.from({  length: restCount }, (_, i) => i);

    return result;
  }

  protected DetailsProject(id: string) {
    this.projectService.setIsEditing(false);
    this.router.navigate(['/project', id]);
  }

  protected EditProject(id: string) {
    this.projectService.setIsEditing(true);
    this.router.navigate(['/project', id]);
  }

  protected async DeleteProject(id: string) {
    const deleteProjectResponse = await firstValueFrom(this.projectService.DeleteProject(id));
    this.toastService.showFromMessageType(deleteProjectResponse.messageType, deleteProjectResponse.message);

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
    const likeProjectResponse$ = this.projectService.LikeProject(id);
    const likeProjectResponse = await lastValueFrom(likeProjectResponse$);
    
    this.projectService.CheckAcheavement(likeProjectResponse);

    this.ProjectDictionary[id].Likes += 1;
    this.ProjectIsLiked[id] = true;
  }

  protected async UnlikeProject(id: string) {
    const result = await lastValueFrom(this.projectService.UnlikeProject(id));
    this.ProjectDictionary[id].Likes -= 1;
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


