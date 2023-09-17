import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastService } from '../toast/toast.service';
import { UserService } from 'src/app/components/user/user.service';
import { Router } from '@angular/router';
import { ToastType } from 'src/app/types';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authUrl = "/api/auth/";

  constructor(
    private router: Router,
    private http: HttpClient,
    private toastService: ToastService,
    private userService: UserService,
  ) { }

  public static GetAuthHeaders() {
    const token = window.localStorage.getItem("token");
    return new HttpHeaders({ "authorization": token ?? "" });
  }

  public async Register(username: string, email: string, password: string) {
    try {

      const result$ = this.http.post<any>(this.authUrl + "register", { username, email, password });
      const result = await lastValueFrom(result$);

      this.userService.isLoggedIn.next(true);
      this.SetToken(result.user.token);
      this.SetUsername(username);
      this.userService.GetLoggedInUser();

      this.router.navigate(["/"]);
      this.toastService.showFromMessageType(result.messageType, result.message);

    } catch (error) {
      this.toastService.show(ToastType.Error, "Something went wrong.", ToastType.Error);
      console.error(error);
    }
  }

  public async Login(username: string, password: string) {
    try {

      const result$ = this.http.post<any>(this.authUrl + "login", { username, password });
      const result = await lastValueFrom(result$);

      this.userService.isLoggedIn.next(true);
      this.SetToken(result.user.token);
      this.SetUsername(username);
      this.userService.GetLoggedInUser();

      this.router.navigate(["/"]);
      this.toastService.showFromMessageType(result.messageType, result.message);
    } catch (error: any) {
      this.toastService.showFromCode(error.status, error.error.message);
      console.error(error);
    }
  }

  public LogOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    this.userService.isLoggedIn.next(false);

    this.router.navigate(["/login"]);
  }

  public SetToken(token: string) {
    localStorage.setItem("token", token);
  }

  public SetUsername(username: string) {
    localStorage.setItem("username", username);
  }
}
