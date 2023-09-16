import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faArrowUp, faUpLong } from '@fortawesome/free-solid-svg-icons';
import { Observable, lastValueFrom } from 'rxjs';
import { HomeService } from 'src/app/services/home/home.service';
import { ProjectService } from 'src/app/components/projects/project.service';
import { UploadService } from 'src/app/services/upload/upload.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  upIcon: any = faArrowUp;

  Projects$: Observable<any[]>;
  Projects: any[];

  ProjectLikes: { [key: string]: number } = {};
  ProjectIsLiked: { [key: string]: boolean } = {};

  searchValue: string = '';
  sortProperty: string = 'DateCreated';
  sortOrder: boolean | 'asc' | 'desc' = 'desc';

  SortDropdownLabel: string = "Date Created";

  constructor(
    private router: Router,
    private homeService: HomeService,
    private projectService: ProjectService,
    protected uploadService: UploadService,

  ) { }

  async ngOnInit() {
    await this.getProjects();

    for (const project of this.Projects) {
      this.ProjectLikes[project.Id] = await lastValueFrom<number>(this.projectService.GetProjectLikeCount(project.Id));
      this.ProjectIsLiked[project.Id] = await lastValueFrom<boolean>(this.projectService.GetProjectIsLiked(project.Id));
    }
  }

  private async getProjects() {
    this.Projects$ = this.homeService.GetProjects();
    this.Projects = await lastValueFrom(this.Projects$);

    console.log(this.Projects);
  }

  protected DetailsProject(id: string) {
    this.projectService.setIsEditing(false);
    this.router.navigate(['/project', id]);
  }

  protected async LikeProject(id: string) {
    const result = await lastValueFrom(this.projectService.LikeProject(id));
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
