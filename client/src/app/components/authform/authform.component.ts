import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { last } from 'rxjs';
import { ToastService } from 'src/app/services/toast/toast.service';
import { UserService } from 'src/app/components/user/user.service';
import { AuthType, ToastType } from 'src/app/types';

@Component({
  selector: 'app-authform',
  templateUrl: './authform.component.html',
  styleUrls: ['./authform.component.scss']
})
export class AuthformComponent implements OnInit {
  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl('')
  });

  AuthType: any = AuthType;
  _authType: AuthType;

  constructor(protected router: Router, protected userService: UserService, protected toastService: ToastService) { }

  ngOnInit(): void {
    if (this.router.url == "/signin")
      this._authType = AuthType.Signin;
    else if (this.router.url == "/signup")
      this._authType = AuthType.Signup
  }

  Submit() {
    if (this._authType == AuthType.Signup)
      this.SignUp();
    else
      this.SignIn();
  }

  SignUp() {
    this.userService.SignUp(
      this.form.value.username,
      this.form.value.email,
      this.form.value.password);
  }

  SignIn() {
    this.userService.SignIn(
      this.form.value.username,
      this.form.value.password);
  }
}
