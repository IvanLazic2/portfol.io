import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, filter, map, Observable, tap, last, endWith, lastValueFrom } from 'rxjs';

import { AuthType, ToastType, User } from "../../types";
import { Router } from '@angular/router';
import { ToastService } from '../toast/toast.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userUrl = '/api/users/';

  isLoggedIn = new BehaviorSubject<boolean>(localStorage.getItem("token") != null);

  User: any;

  private isEditing = false;

  constructor(
    protected router: Router,
    protected http: HttpClient,
    protected toastService: ToastService,
    private authService: AuthService) {

  }

  getIsEditing() {
    return this.isEditing;
  }

  setIsEditing(value: boolean) {
    this.isEditing = value;
  }

  async GetUser() {
    if (!this.GetIsLoggedIn())
      return;

    const getUserResponse$ = this.http.get(this.userUrl, {
      "headers": this.authService.GetAuthHeaders(),
    });

    this.User = await lastValueFrom(getUserResponse$);
  }

  GetIsLoggedInObservable() {
    return this.isLoggedIn.asObservable();
  }

  async GetIsLoggedIn() {
    return await lastValueFrom(this.isLoggedIn);
  }

  GetUserProfilePicture() {
    return "";
  }

  EditUser(user: any) {
    return this.http.put(this.userUrl, user, {
      "headers": this.authService.GetAuthHeaders(),
    });
  }

  ChangeUsername(username: string) {
    return this.http.put(this.userUrl + 'changeUsername/', { Username: username}, {
      "headers": this.authService.GetAuthHeaders(),
    });
  }

  ChangeEmail(email: string) {
    return this.http.put(this.userUrl + 'changeEmail/', { Email: email}, {
      "headers": this.authService.GetAuthHeaders(),
    });
  }

  SignUp(username: string, email: string, password: string) {
    this.http.post("/api/signup", { username, email, password })
      .subscribe({
        next: (res: any) => {
          this.isLoggedIn.next(true);
          this.SetToken(res.user);
          this.GetUser();

          this.router.navigate(["/"]);
          this.toastService.show("", res.message, ToastType.Success);

        }, error: (err) => {
          this.toastService.show("", err.error.message, ToastType.Warning);
        }
      });
  }

  SignIn(username: string, password: string) {
    this.http.post("/api/signin", { username, password })
      .subscribe({
        next: (res: any) => {
          this.isLoggedIn.next(true);
          this.SetToken(res.user);
          this.GetUser();


          this.router.navigate(["/"]);
          this.toastService.show("", res.message, ToastType.Success);

        }, error: (err) => {
          this.toastService.show("", err.error.message, ToastType.Warning);
        }
      });
  }

  LogOut() {
    localStorage.removeItem("token");
    this.isLoggedIn.next(false);

    this.router.navigate(["/signin"]);
    this.toastService.show("", "Successfully logged out.", ToastType.Success);
  }

  SetToken(user: any) {
    localStorage.setItem("token", user.Token);
    //this.User.next({ Username: user.Username });
  }
}
