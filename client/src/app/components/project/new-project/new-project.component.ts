import { HttpEventType } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { FilesService } from 'src/app/services/files/files.service';
import { ProjectService } from 'src/app/services/project/project.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { UserService } from 'src/app/services/user/user.service';
import { ProjectPOST, ToastType } from 'src/app/types';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.scss']
})
export class NewProjectComponent {
  form: FormGroup;
  progress: number = 0;

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
      files: this.fb.array([], [Validators.required])
    });
  }

  get projectName() {
    return this.form.get('projectName') as FormControl;
  }

  get projectConcept() {
    return this.form.get('projectConcept') as FormControl;
  }

  get files() {
    return this.form.get('files') as FormArray;
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();

    const files = event.dataTransfer?.files;

    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        this.files.setControl(this.files.length, this.fb.control(files[i]));
      }
    }
  }

  onFileChange(event: Event) {
    const files = (event.target as HTMLInputElement).files;

    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        this.files.setControl(this.files.length, this.fb.control(files[i]));
      }
    }
  }

  onSubmit() {
    if (!this.form.valid) {
      alert("Form not valid");
      return;
    }

    const projectName = this.form.value.projectName;
    const projectConcept = this.form.value.projectConcept;
    const files = this.form.value.files;

    console.log(projectName, projectConcept, files);

    const project: ProjectPOST = {
      Name: projectName,
      Concept: projectConcept
    };

    this.projectService.CreateProject(project).subscribe({
      next: response => {
        console.log(response);
        //alert("project create success");

        const projectId = "" // getaj projectid sa servera

        this.filesService.UploadProjectFiles(projectId, files).subscribe({
          next: event => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round(100 * event.loaded / (event?.total ?? 0));
            }
            else if (event.type === HttpEventType.Response) {
              console.log(event.body);
              alert('file upload success');
              this.files.clear();
              this.form.reset();
              this.progress = 0;
            }
          },
          error: error => {
            console.error(error);
            alert('file upload error');
            this.progress = 0;
          }
        });

      },
      error: error => {
        console.error(error);
        alert("project create error");
      }
    });

  }

  onClick() {
    const input = document.getElementById("fileInput") as HTMLInputElement;

    input.click();
  }

  onRemove(index: number) {
    const fileControl = this.files.at(index);

    this.files.removeAt(index);

    const reader = new FileReader();

    reader.onload = () => {
      const url = reader.result as string;
      URL.revokeObjectURL(url);
    }

    reader.readAsDataURL(fileControl.value);

  }

}
