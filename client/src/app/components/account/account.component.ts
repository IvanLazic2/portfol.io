import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { lastValueFrom } from 'rxjs';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  usernameForm: FormGroup;
  emailForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    protected userService: UserService,
    private modalService: NgbModal
  ) {
    this.usernameForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
    });

    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get User() {
    return this.userService.User;
  }

  get username() {
    return this.usernameForm.get('username') as FormControl;
  }

  get email() {
    return this.emailForm.get('email') as FormControl;
  }

  async ngOnInit() {
      await this.userService.GetUser();
      this.setForms();
  }

  setForms() {
    this.username.setValue(this.User.Username);
    this.email.setValue(this.User.Email);
  }

  openModal(content: any) {
    this.modalService.open(content).result;
  }

  async onUsernameSubmit() {
    await lastValueFrom(this.userService.ChangeUsername(this.username.value));
    await this.userService.GetUser();
    this.modalService.dismissAll();
  }

  async onEmailSubmit() {
    await lastValueFrom(this.userService.ChangeEmail(this.email.value));
    await this.userService.GetUser();
    this.modalService.dismissAll();
  }
}
