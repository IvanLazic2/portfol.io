import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faArrowUp, faHeart, faUpLong } from '@fortawesome/free-solid-svg-icons';
import { Observable, lastValueFrom } from 'rxjs';
import { HomeService } from 'src/app/components/home/home.service';
import { ProjectService } from 'src/app/components/projects/project.service';
import { UploadService } from 'src/app/services/upload/upload.service';
import { UserService } from '../user/user.service';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  upIcon: any = faArrowUp;
  solidHeartIcon: any = faHeart;
  regularHeartIcon: any = faHeartRegular;

  Projects$: Observable<any[]>;
  Projects: any[];

  ProjectDictionary: { [key: string]: any } = {};
  ProjectIsLiked: { [key: string]: boolean } = {};

  searchValue: string = '';
  sortProperty: string = 'DateCreated';
  sortOrder: boolean | 'asc' | 'desc' = 'desc';

  SortDropdownLabel: string = "Date Created";

  constructor(
    protected router: Router,
    protected homeService: HomeService,
    protected projectService: ProjectService,
    protected uploadService: UploadService,
    protected userService: UserService,

  ) { }

  async ngOnInit() {
    await this.getProjects();
  }

  private async getProjects() {
    await this.homeService.GetProjects();

    for (const project of this.homeService.CurrentProjects) {
      this.ProjectDictionary[project.Id] = project;
      if (this.userService.GetIsLoggedIn()) {
        this.ProjectIsLiked[project.Id] = await lastValueFrom<boolean>(this.projectService.GetProjectIsLiked(project.Id));
      }
    }
  }

  protected DetailsProject(id: string) {
    this.projectService.setIsEditing(false);
    this.router.navigate(['/project', id]);
  }

  protected async LikeProject(id: string) {
    const result = await lastValueFrom(this.projectService.LikeProject(id));
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
}
