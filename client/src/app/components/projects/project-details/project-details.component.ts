import { Component, OnInit } from '@angular/core';
import { HttpEventType, HttpEvent } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, lastValueFrom, firstValueFrom, Subscription } from 'rxjs';
import { FilesService } from 'src/app/services/files/files.service';
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
  ProjectId: string;
  Project$: Observable<any>;
  Thumbnails: any;

  filesToAdd: File[] = [];
  uploadProgresses: { [key: string]: number } = {};
  uploadSubscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    protected editProjectSevice: EditProjectService,
    protected filesService: FilesService,
    private router: Router,
  ) {
    this.form = this.fb.group({
      projectName: ['', [Validators.required, Validators.minLength(3)]],
      projectConcept: ['', [Validators.pattern(/^[a-zA-Z0-9]+$/)]]
    });
  }

  get projectName() {
    return this.form.get('projectName') as FormControl;
  }

  get projectConcept() {
    return this.form.get('projectConcept') as FormControl;
  }


  async ngOnInit(): Promise<void> {
    this.ProjectId = await this.getId();
    await this.getProject();

    this.Thumbnails = await lastValueFrom(this.filesService.GetThumbnails(this.ProjectId));

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
    this.Project$ = this.projectService.GetProject(this.ProjectId);
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

  protected async onSubmit() {
    const projectName = this.form.value.projectName;
    const projectConcept = this.form.value.projectConcept;

    const project: ProjectPOST = {
      Name: projectName,
      Concept: projectConcept
    };

    try {

      const editResponse = await firstValueFrom(this.projectService.EditProject(this.ProjectId, project));

      let uploadResponses$ = this.filesService.UploadProjectFiles(this.ProjectId, this.filesToAdd);

      uploadResponses$.forEach(([fileName, response$]) => {
        const uploadSubscription = response$.subscribe({
          next: event => {
            if (event.type === HttpEventType.UploadProgress) {
              if (event.total !== undefined) {
                this.uploadProgresses[fileName] = Math.round((100 * event.loaded) / event.total);
              }
            }
            else if (event.type === HttpEventType.Response) {
              delete this.uploadProgresses[fileName];
              console.log(fileName, event.body);
            }
          },
          error: (error: any) => {

          },
          complete: () => {

          }
        });

        this.uploadSubscriptions.push(uploadSubscription);
      });

    } catch (error) {
      console.error(error);
    }




    await this.getProject();

    this.editProjectSevice.setIsEditing(false);
  }

  onSelect(event: any) {
    this.filesToAdd.push(...event.addedFiles);
  }

  async onRemove(event: any) {
    this.filesToAdd.splice(this.filesToAdd.indexOf(event), 1);
  }

  protected async Delete() {
    const result = await firstValueFrom(this.projectService.DeleteProject(this.ProjectId));
    this.router.navigate(['/']); // TEMP!!!
  }

  protected async DeleteUpload(uploadId: string) {
    const deleteResponse = await lastValueFrom(this.filesService.DeleteUpload(uploadId));
    console.log("DELETE: ", deleteResponse);
  }
}
