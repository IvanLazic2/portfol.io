import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  public GetAuthHeaders() {
    const token = window.localStorage.getItem("token");
    return new HttpHeaders({ "authorization": token ?? "" });
  }
}
