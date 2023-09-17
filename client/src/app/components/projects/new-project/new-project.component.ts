import { HttpEventType, HttpEvent } from '@angular/common/http';
import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, take } from 'rxjs';
import { UploadService } from 'src/app/services/upload/upload.service';
import { ProjectService } from 'src/app/components/projects/project.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { UserService } from 'src/app/components/user/user.service';
import { ProjectPOST, ToastType } from 'src/app/types';
import { Observable, lastValueFrom, firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.scss']
})
export class NewProjectComponent implements OnInit, OnDestroy {
  form: FormGroup;
  formSubmitted: boolean = false;
  filesEmpty: boolean = false;
  //uploadProgress: number = 0;
  uploadProgresses: { [key: string]: number } = {};
  uploadSubscriptions: Subscription[] = [];

  //@ViewChild('fileInput') fileInput: ElementRef;

  constructor(
    private fb: FormBuilder,
    private uploadService: UploadService,
    private projectService: ProjectService,

    protected userService: UserService,
    protected router: Router,
    private toastService: ToastService,
  ) {
    this.form = this.fb.group({
      projectName: ['', [Validators.required, Validators.minLength(3)]],
      projectConcept: ['', /*[Validators.pattern(/^[a-zA-Z0-9,. \t\n;()-_+=*^%$#@!&|\\/]*$/)]*/],
      projectMaterial: [''],
      projectWidth: [''],
      projectHeight: [''],
      projectDepth: [''],
    });
  }
  files: File[] = [];

  get projectName() {
    return this.form.get('projectName') as FormControl;
  }

  get projectConcept() {
    return this.form.get('projectConcept') as FormControl;
  }

  get projectMaterial() {
    return this.form.get('projectMaterial') as FormControl;
  }

  get projectWidth() {
    return this.form.get('projectWidth') as FormControl;
  }

  get projectHeight() {
    return this.form.get('projectHeight') as FormControl;
  }

  get projectDepth() {
    return this.form.get('projectDepth') as FormControl;
  }

  ngOnInit(): void {
    this.formSubmitted = false;
    this.filesEmpty = false;
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
    this.formSubmitted = true;

    if (this.files.length === 0) {
      this.filesEmpty = true;
    }

    if (!this.form.valid || this.files.length === 0) {
      return;
    }

    const project: ProjectPOST = {
      Name: this.form.value.projectName,
      Concept: this.form.value.projectConcept,
      Material: this.form.value.projectMaterial,
      Width: this.form.value.projectWidth,
      Height: this.form.value.projectHeight,
      Depth: this.form.value.projectDepth,
    };

    try {


      const createResponse = await firstValueFrom(this.projectService.CreateProject(project));

      if (!createResponse.projectId)
        console.error("projectId undefined");

      let uploadResponses$ = this.uploadService.UploadProjectFiles(createResponse.projectId, this.files);

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

    this.router.navigate(['/user', this.userService.CurrentUser.Username]);

  }

  ngOnDestroy(): void {
    this.uploadSubscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
