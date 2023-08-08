import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, filter, map, Observable, tap, last, endWith } from 'rxjs';

import { AuthType, ToastType, User } from "../../types";
import { Router } from '@angular/router';
import { ToastService } from '../toast/toast.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  _loggedIn = new BehaviorSubject<boolean>(localStorage.getItem("token") != null);

  User: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);

  constructor(protected router: Router, protected http: HttpClient, protected toastService: ToastService) {
    this.GetUser();
  }

  GetUser() {


    if (!this.GetIsLoggedIn())
      return;

    const token = window.localStorage.getItem("token");
    const headers = new HttpHeaders({ "authorization": token ?? "" });

    this.http.get<any>("/api/user", { "headers": headers })
      .subscribe((res) => {
        this.User.next(res.user);
      });
  }

  GetLoggedIn() {
    return this._loggedIn.asObservable();
  }

  GetIsLoggedIn() {
    let isLoggedIn = false;
    this._loggedIn.asObservable().pipe().subscribe(val => isLoggedIn = val);
    return isLoggedIn;
  }

  SignUp(username: string, email: string, password: string) {
    this.http.post("/api/signup", { username, email, password })
      .subscribe({
        next: (res: any) => {
          this._loggedIn.next(true);
          this.SetUser(res.user);
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
          this._loggedIn.next(true);
          this.SetUser(res.user);
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
    this._loggedIn.next(false);

    this.router.navigate(["/signin"]);
    this.toastService.show("", "Successfully logged out.", ToastType.Success);
  }

  SetUser(user: any) {
    localStorage.setItem("token", user.Token);
    this.User.next({ Username: user.Username });
  }
}
