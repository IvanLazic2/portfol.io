import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { last } from 'rxjs';
import { ToastService } from 'src/app/services/toast/toast.service';
import { UserService } from 'src/app/components/user/user.service';
import { AuthType, ToastType } from 'src/app/types';
import { faAt, faEnvelope, faEyeSlash, faEye, faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { PasswordValidators } from 'src/app/validators/password-validators';

@Component({
  selector: 'app-authform',
  templateUrl: './authform.component.html',
  styleUrls: ['./authform.component.scss']
})
export class AuthformComponent implements OnInit {
  usernameIcon: any = faAt;
  emailIcon: any = faEnvelope;
  hiddenPasswordIcon: any = faEyeSlash;
  visiblePasswordIcon: any = faEye;
  submitIcon: any = faRightToBracket;

  AuthType: any = AuthType;
  _authType: AuthType;

  passwordFieldTextType: boolean = false;
  confirmPasswordFieldTextType: boolean = false;

  usernameExists: boolean = false;
  emailExists: boolean = false;

  form: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    confirmPassword: ['', [Validators.required]],
  },
    {
      validators: PasswordValidators.MatchValidator
    }
  );



  constructor(
    protected router: Router,
    protected userService: UserService,
    protected toastService: ToastService,
    private fb: FormBuilder,
  ) { }

  get username() {
    return this.form.get('username') as FormControl;
  }

  get email() {
    return this.form.get('email') as FormControl;
  }

  get password() {
    return this.form.get('password') as FormControl;
  }

  get confirmPassword() {
    return this.form.get('confirmPassword') as FormControl;
  }

  ngOnInit(): void {
    if (this.router.url == "/login")
      this._authType = AuthType.Login;
    else if (this.router.url == "/register")
      this._authType = AuthType.Register;
  }

  onSubmit() {
    if (this._authType == AuthType.Register)
      this.Register();
    else
      this.Login();
  }

  async Register() {
    if (!this.form.valid) {
      return;
    }

    this.usernameExists = await this.userService.UsernameExists(this.form.value.username);
    this.emailExists = await this.userService.EmailExists(this.form.value.email);

    if (this.usernameExists || this.emailExists) {
      return;
    }

    this.userService.Register(
      this.form.value.username,
      this.form.value.email,
      this.form.value.password);
  }

  Login() {
    this.userService.Login(
      this.form.value.username,
      this.form.value.password);
  }
}
