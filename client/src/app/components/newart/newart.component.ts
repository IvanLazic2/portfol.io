import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FilesService } from 'src/app/services/files/files.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { UserService } from 'src/app/services/user/user.service';
import { ToastType } from 'src/app/types';

@Component({
  selector: 'app-newart',
  templateUrl: './newart.component.html',
  styleUrls: ['./newart.component.scss']
})
export class NewartComponent {
  constructor (
    protected userService: UserService,
    protected router: Router,
    protected toastService: ToastService,
    protected filesService: FilesService
  ) {}

  Action: string = '';

  form: FormGroup = new FormGroup({
    file: new FormControl("file.txt", [Validators.required])
  });

  @ViewChild("fileinput") fi: ElementRef = new ElementRef<any>(null);
  submit() {
    this.Action = "submit";

    this.filesService
      .Upload(this.form.value, this.progressHandler.bind(this))
      .subscribe((res: any) => {
        this.fi.nativeElement.value = "";
      });
  }

  onFileChange(event: Event) {
    const file = (event.target as any).files[0];

    if (file != undefined) {
      document.getElementById("submitButton")?.classList.remove("disabled");
    }
    else {
      document.getElementById("submitButton")?.classList.add("disabled");
    }

    this.form.patchValue({ file });
  }

  percentage: number = 0;
  progressHandler(percentage: number, done: boolean) {
    if (!isNaN(percentage))
      this.percentage = percentage;

    if (done) {
      this.filesService.RefreshFiles();

      console.log("Successfully uploaded");
      this.form.reset();


      setTimeout(() => {
        this.percentage = 0;
        this.router.navigate(["/files"]);

        let message = this.filesService.ResultMessage;
        if (message != "") {
          this.toastService.show("", message, ToastType.Success);
        }
      }, 1000);
    }
  }

}
