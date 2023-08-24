import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user/user.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-user-sidebar',
  templateUrl: './user-sidebar.component.html',
  styleUrls: ['./user-sidebar.component.scss']
})
export class UserSidebarComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    protected location: Location,
    protected userService: UserService,
  ) {
    this.form = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      bio: ['', [Validators.pattern(/^[a-zA-Z0-9]+$/)]]
    });
  }

  get User() {
    return this.userService.User;
  }

  get fullName() {
    return this.form.get('fullName') as FormControl;
  }

  get bio() {
    return this.form.get('bio') as FormControl;
  }

  setForm() {
    this.fullName.setValue(this.User.FullName);
    this.bio.setValue(this.User.Bio);
  }

  protected Edit() {
    this.setForm();
    this.userService.setIsEditing(true);
  }

  async onSubmit() {
    await lastValueFrom(this.userService.EditUser({ FullName: this.fullName.value, Bio: this.bio.value }));

    await this.userService.GetUser();
    this.userService.setIsEditing(false);
  }

  /*canShowNewProject(): boolean {
    return ["/user"].every((path) => this.location.path().startsWith(path));
  }*/
}
