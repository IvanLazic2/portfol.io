import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, lastValueFrom, firstValueFrom } from 'rxjs';
import { EditProjectService } from 'src/app/services/project/edit-project.service';
import { ProjectService } from 'src/app/services/project/project.service';
import { ProjectPOST } from 'src/app/types';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit {
  form: FormGroup;
  Project$: Observable<any>;

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    protected editProjectSevice: EditProjectService
  ) {
    this.form = this.fb.group({
      projectName: ['', [Validators.required, Validators.minLength(3)]],
      projectConcept: ['', [Validators.pattern(/^[a-zA-Z0-9]+$/)]],
      files: this.fb.array([], [Validators.required])
    });
  }

  get projectName() {
    return this.form.get('projectName') as FormControl;
  }

  get projectConcept() {
    return this.form.get('projectConcept') as FormControl;
  }


  async ngOnInit(): Promise<void> {
    await this.getProject();
    this.setFormFromObservable();
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

  private async getProject() {
    const id = await this.getId();
    this.Project$ = this.projectService.GetProject(id);
  }

  private async setFormFromObservable() {
    const project = await firstValueFrom(this.Project$);
    this.form.controls['projectName'].setValue(project.Name);
    this.form.controls['projectConcept'].setValue(project.Concept);
  }

  protected async Edit() {
    this.setFormFromObservable();
    this.editProjectSevice.setIsEditing(true);
  }

  protected async Save() {
    const projectName = this.form.value.projectName;
    const projectConcept = this.form.value.projectConcept;

    const project: ProjectPOST = {
      Name: projectName,
      Concept: projectConcept
    };

    const response = await firstValueFrom(this.projectService.EditProject(await this.getId(), project));

    console.log(response);

    await this.getProject();

    this.editProjectSevice.setIsEditing(false);
  }

  protected Delete() {

  }
}
