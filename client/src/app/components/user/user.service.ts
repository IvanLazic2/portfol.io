import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, filter, map, Observable, tap, last, endWith, lastValueFrom, firstValueFrom } from 'rxjs';

import { AuthType, ToastType } from "../../types";
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast/toast.service';
import { AuthService } from '../../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public readonly UserUrl = '/api/user/';
  public readonly ProfilePictureUrl = '/api/profilePicture/';

  CurrentUser: any;

  isLoggedIn = new BehaviorSubject<boolean>(localStorage.getItem("token") != null);
  LoggedInUser: any;
  ProfilePictureSrcUrl: string;

  private isEditing = false;

  constructor(
    protected router: Router,
    protected http: HttpClient,
    protected toastService: ToastService,
    ) {

  }

  getIsEditing() {
    return this.isEditing;
  }

  setIsEditing(value: boolean) {
    if (!this.LoggedInUser) {
      return;
    }

    if (this.CurrentUser.Username === this.LoggedInUser.Username) {
      this.isEditing = value;
    }
  }

  async GetCurrentUser(username: string) {
    const getUserResponse$ = this.http.get(this.UserUrl + username);
    this.CurrentUser = await lastValueFrom(getUserResponse$);
  }

  async GetCurrentUserById(id: string) {
    const getUserResponse$ = this.http.get(this.UserUrl + 'id/' + id);
    this.CurrentUser = await lastValueFrom(getUserResponse$);
  }

  async GetLoggedInUser() {
    const username = localStorage.getItem("username");

    if (!username) {
      return;
    }

    const getUserResponse$ = this.http.get(this.UserUrl + username);

    this.LoggedInUser = await lastValueFrom(getUserResponse$);
  }

  GetCurrentUserProfilePictureUrl(): string {
    if (!this.CurrentUser) {
      return '';
    }

    if (!this.CurrentUser.ProfilePictureId) {
      return '';
    }

    return this.ProfilePictureUrl + this.CurrentUser.ProfilePictureId;
  }

  GetLoggedInUserProfilePictureUrl(): string {
    if (!this.LoggedInUser) {
      return '';
    }

    if (!this.LoggedInUser.ProfilePictureId) {
      return '';
    }

    return this.ProfilePictureUrl + this.LoggedInUser.ProfilePictureId;
  }

  GetProfilePictureByUploadId(uploadId: string) {
    return this.ProfilePictureUrl + uploadId;
  }


  GetIsLoggedInObservable() {
    return this.isLoggedIn.asObservable();
  }

  GetIsLoggedIn() {
    return localStorage.getItem("token") != null;
  }

  EditUser(user: any) {
    return this.http.put(this.UserUrl, user, {
      "headers": AuthService.GetAuthHeaders(),
    });
  }

  ChangeUsername(username: string) {
    return this.http.put(this.UserUrl + 'changeUsername/', { Username: username }, {
      "headers": AuthService.GetAuthHeaders(),
    });
  }

  ChangeEmail(email: string) {
    return this.http.put(this.UserUrl + 'changeEmail/', { Email: email }, {
      "headers": AuthService.GetAuthHeaders(),
    });
  }

  ChangeProfilePicture(profilePicture: File) {
    const formData = new FormData();
    formData.append('profilePicture', profilePicture, profilePicture.name);

    return this.http.post(this.ProfilePictureUrl, formData, {
      "headers": AuthService.GetAuthHeaders(),
    });
  }

  ClearProfilePicture() {
    this.ProfilePictureSrcUrl = "";
  }

  DeleteProfilePicture() {
    return this.http.delete(this.ProfilePictureUrl, {
      "headers": AuthService.GetAuthHeaders(),
    });
  }

  async UsernameExists(username: string): Promise<boolean> {
    const result = this.http.get<boolean>(this.UserUrl + 'usernameExists/' + username);
    return await lastValueFrom(result);
  }

  async EmailExists(email: string): Promise<boolean> {
    const result = this.http.get<boolean>(this.UserUrl + 'emailExists/' + email);
    return await lastValueFrom(result);
  }

  DeleteAccount() {
    return this.http.delete(this.UserUrl, {
      "headers": AuthService.GetAuthHeaders(),
    });
  }
}
