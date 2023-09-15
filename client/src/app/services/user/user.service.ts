import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, filter, map, Observable, tap, last, endWith, lastValueFrom, firstValueFrom } from 'rxjs';

import { AuthType, ToastType, User } from "../../types";
import { Router } from '@angular/router';
import { ToastService } from '../toast/toast.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public readonly UserUrl = '/api/users/';
  public readonly ProfilePictureUrl = '/api/profilePictures/';

  isLoggedIn = new BehaviorSubject<boolean>(localStorage.getItem("token") != null);

  User: any;
  ProfilePictureSrcUrl: string;

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

  async GetUser(username: string = localStorage.getItem("username") ?? "") {
    const getUserResponse$ = this.http.get(this.UserUrl + username);

    this.User = await lastValueFrom(getUserResponse$);

    if (this.User.ProfilePictureId)
      this.ProfilePictureSrcUrl = this.ProfilePictureUrl + this.User.ProfilePictureId;
    else
      this.ProfilePictureSrcUrl = "";
  }

  GetIsLoggedInObservable() {
    return this.isLoggedIn.asObservable();
  }

  async GetIsLoggedIn() {
    return await lastValueFrom(this.isLoggedIn);
  }  

  EditUser(user: any) {
    return this.http.put(this.UserUrl, user, {
      "headers": this.authService.GetAuthHeaders(),
    });
  }

  ChangeUsername(username: string) {
    return this.http.put(this.UserUrl + 'changeUsername/', { Username: username}, {
      "headers": this.authService.GetAuthHeaders(),
    });
  }

  ChangeEmail(email: string) {
    return this.http.put(this.UserUrl + 'changeEmail/', { Email: email}, {
      "headers": this.authService.GetAuthHeaders(),
    });
  }

  ChangeProfilePicture(profilePicture: File) {
    const formData = new FormData();
    formData.append('profilePicture', profilePicture, profilePicture.name);

    return this.http.post(this.ProfilePictureUrl, formData, {
      "headers": this.authService.GetAuthHeaders(),
    });
  }

  ClearProfilePicture() {
    this.ProfilePictureSrcUrl = "";
  }

  DeleteProfilePicture() {
    return this.http.delete(this.ProfilePictureUrl, {
      "headers": this.authService.GetAuthHeaders(),
    });
  }

  SignUp(username: string, email: string, password: string) {
    this.http.post("/api/signup", { username, email, password })
      .subscribe({
        next: (res: any) => {
          this.isLoggedIn.next(true);
          this.SetToken(res.user);
          this.SetUsername(username);
          this.GetUser(username);

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
          this.SetUsername(username);
          this.GetUser(username);


          this.router.navigate(["/"]);
          this.toastService.show("", res.message, ToastType.Success);

        }, error: (err) => {
          this.toastService.show("", err.error.message, ToastType.Warning);
        }
      });
  }

  LogOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    this.isLoggedIn.next(false);

    this.router.navigate(["/signin"]);
    this.toastService.show("", "Successfully logged out.", ToastType.Success);
  }

  SetToken(user: any) {
    localStorage.setItem("token", user.Token);
    //this.User.next({ Username: user.Username });
  }

  SetUsername(username: string) {
    localStorage.setItem("username", username);
  }
}
