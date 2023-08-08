import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { faUser, faSignOut } from '@fortawesome/free-solid-svg-icons';
import { BehaviorSubject, filter, map, observable, Observable, startWith } from 'rxjs';
import { UserService } from 'src/app/services/user/user.service';
import { Page, User, AuthType } from '../../types';
import { NavigationEnd, Router, Event as NavigationEvent } from '@angular/router';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
  
})
export class NavComponent {
  AuthType: any = AuthType;
  User$: BehaviorSubject<User | null>;

  userIcon = faUser;
  signoutIcon = faSignOut;

  isMenuCollapsed = true;

  
  

  constructor(
    protected userService: UserService
    ) { }

  
}
