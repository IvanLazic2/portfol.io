import { HttpEventType, HttpEvent } from '@angular/common/http';
import { Component, ElementRef, Inject, OnDestroy, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, take } from 'rxjs';
import { FilesService } from 'src/app/services/files/files.service';
import { ProjectService } from 'src/app/services/project/project.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { UserService } from 'src/app/services/user/user.service';
import { ProjectPOST, ToastType } from 'src/app/types';
import { Observable, lastValueFrom, firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.scss']
})
export class NewProjectComponent implements OnDestroy {
  form: FormGroup;
  //uploadProgress: number = 0;
  uploadProgresses: { [key: string]: number } = {};
  uploadSubscriptions: Subscription[] = [];

  //@ViewChild('fileInput') fileInput: ElementRef;

  constructor(
    private fb: FormBuilder,
    private filesService: FilesService,
    private projectService: ProjectService,

    protected userService: UserService,
    private router: Router,
    private toastService: ToastService,
  ) {
    this.form = this.fb.group({
      projectName: ['', [Validators.required, Validators.minLength(3)]],
      projectConcept: ['', [Validators.pattern(/^[a-zA-Z0-9]+$/)]],
      //files: this.fb.array([], [Validators.required])
    });
  }
  files: File[] = [];

  get projectName() {
    return this.form.get('projectName') as FormControl;
  }

  get projectConcept() {
    return this.form.get('projectConcept') as FormControl;
  }

  onSelect(event: any) {
    console.log(event);
    this.files.push(...event.addedFiles);
    console.log(this.files);
  }

  onRemove(event: any) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
    console.log(this.files);
  }

  async onSubmit() {
    if (!this.form.valid) {
      alert("Form not valid");
      return;
    }

    const projectName = this.form.value.projectName;
    const projectConcept = this.form.value.projectConcept;
    //console.log(projectName, projectConcept, files);

    const project: ProjectPOST = {
      Name: projectName,
      Concept: projectConcept
    };

    try {

      const createResponse = await firstValueFrom(this.projectService.CreateProject(project));

      if (!createResponse.projectId)
        console.error("projectId undefined");

      let uploadResponses$ = this.filesService.UploadProjectFiles(createResponse.projectId, this.files);

      const uploadPromises = uploadResponses$.map(([fileName, response$]) => {
        return new Promise<void>((resolve, reject) => {
          const uploadSubscription = response$.subscribe({
            next: (event: any) => {
              if (event.type === HttpEventType.UploadProgress && event.total !== undefined) {
                this.uploadProgresses[fileName] = Math.round((100 * event.loaded) / event.total);
              } else if (event.type === HttpEventType.Response) {
                delete this.uploadProgresses[fileName];
                console.log(fileName, event.body);
                resolve();
              }
            },
            error: (error: any) => {
              reject(error);
            }
          });

          this.uploadSubscriptions.push(uploadSubscription);
        });
      });

      await Promise.all(uploadPromises);
      
    } catch (error) {
      console.error(error);
    }

    for (const subscription of this.uploadSubscriptions) {
      subscription.unsubscribe();
    }

  }

  ngOnDestroy(): void {
    this.uploadSubscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
