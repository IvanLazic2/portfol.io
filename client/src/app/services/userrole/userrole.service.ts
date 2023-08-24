import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserroleService {
  private userRoles = new BehaviorSubject<Array<string>>(["Artist"]);

  constructor() { }

  public GetUserRoles() {
    return this.userRoles;
  }
}
