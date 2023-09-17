import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { faExclamation, faSave, faTrash, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { lastValueFrom } from 'rxjs';
import { UserService } from 'src/app/components/user/user.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  exclamationIcon: any = faTriangleExclamation;
  saveIcon: any = faSave;
  deleteIcon: any = faTrash;

  usernameForm: FormGroup;
  usernameFormSubmitted = false;
  usernameExists = false;

  emailForm: FormGroup;
  emailFormSubmitted = false;
  emailExists = false;

  constructor(
    private fb: FormBuilder,
    protected userService: UserService,
    private authService: AuthService,
    private modalService: NgbModal,
    private toastService: ToastService,
  ) {
    this.usernameForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
    });

    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get username() {
    return this.usernameForm.get('username') as FormControl;
  }

  get email() {
    return this.emailForm.get('email') as FormControl;
  }

  async ngOnInit() {
      await this.userService.GetLoggedInUser();
      this.setForms();
  }

  setForms() {
    this.usernameFormSubmitted = false;
    this.usernameExists = false;
    this.emailFormSubmitted = false;
    this.emailExists = false;

    this.username.setValue(this.userService.LoggedInUser.Username);
    this.email.setValue(this.userService.LoggedInUser.Email);
  }

  openModal(content: any) {
    this.setForms();
    this.modalService.open(content).result;
  }

  async onUsernameSubmit() {
    this.usernameFormSubmitted = true;

    if (!this.usernameForm.valid) {
      return;
    }

    this.usernameExists = await this.userService.UsernameExists(this.username.value)
    console.log(this.usernameExists)

    if (this.usernameExists) {
      return;
    }

    await lastValueFrom(this.userService.ChangeUsername(this.username.value));
    this.authService.SetUsername(this.username.value);
    await this.userService.GetLoggedInUser();
    this.modalService.dismissAll();
  }

  async onEmailSubmit() {
    this.emailFormSubmitted = true;

    if (!this.emailForm.valid) {
      return;
    }

    this.emailExists = await this.userService.EmailExists(this.email.value);

    if (this.emailExists) {
      return;
    }

    await lastValueFrom(this.userService.ChangeEmail(this.email.value));
    await this.userService.GetLoggedInUser();
    this.modalService.dismissAll();
  }

  async DeleteAccount() {
    const deleteAccountResponse$ = this.userService.DeleteAccount();
    const deleteAccountResponse = await lastValueFrom<any>(deleteAccountResponse$);

    this.toastService.showFromMessageType(deleteAccountResponse.messageType, deleteAccountResponse.message);

    this.authService.LogOut();
  }
}
