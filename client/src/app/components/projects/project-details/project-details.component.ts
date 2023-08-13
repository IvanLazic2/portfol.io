import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, lastValueFrom, firstValueFrom } from 'rxjs';
import { ProjectService } from 'src/app/services/project/project.service';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit {
  Project$: Observable<any>;

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
  ) { }

  async ngOnInit(): Promise<void> {
    const id = await this.getId();
    console.log(id);
    this.Project$ = this.projectService.GetProject(id);
  }

  private async getId() {
    let id = ""

    try {
      const params = await firstValueFrom(this.route.paramMap);
      id = params.get('id') ?? "";

    } catch (error) {
      console.error(error);
    }

    return id;
  }

  protected Edit() {

  }

  protected Delete() {

  }
}
