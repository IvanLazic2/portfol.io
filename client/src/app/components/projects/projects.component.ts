import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, firstValueFrom } from 'rxjs';
import { EditProjectService } from 'src/app/services/project/edit-project.service';
import { ProjectService } from 'src/app/services/project/project.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit{
  Projects$: Observable<any[]>;

  constructor(
    private projectService: ProjectService,
    private editProjectSevice: EditProjectService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.GetProjects();
  }

  protected GetProjects() {
    this.Projects$ = this.projectService.GetProjects();
  }

  protected DetailsProject(id: string) {
    this.editProjectSevice.setIsEditing(false);
    this.router.navigate(['/project', id]);
  }

  protected EditProject(id: string) {
    this.editProjectSevice.setIsEditing(true);
    this.router.navigate(['/project', id]);
  }

  protected async DeleteProject(id: string) {
    const result = await firstValueFrom(this.projectService.DeleteProject(id));
    console.log(result);
    this.GetProjects();
  }
}
