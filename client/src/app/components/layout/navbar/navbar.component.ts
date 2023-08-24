import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { faUser, faSignOut } from '@fortawesome/free-solid-svg-icons';
import { BehaviorSubject, filter, map, observable, Observable, startWith } from 'rxjs';
import { UserService } from 'src/app/services/user/user.service';
import { Page, User, AuthType } from '../../../types';
import { NavigationEnd, Router, Event as NavigationEvent } from '@angular/router';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
  
})
export class NavbarComponent implements OnInit {
  AuthType: any = AuthType;
  User$: BehaviorSubject<User | null>;

  userIcon = faUser;
  signoutIcon = faSignOut;

  isMenuCollapsed = true;

  
  

  constructor(
    protected userService: UserService
    ) { }

  async ngOnInit() {
      await this.userService.GetUser();
  }
}
