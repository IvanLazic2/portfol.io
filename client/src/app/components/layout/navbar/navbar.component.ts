import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { faUser, faSignOut } from '@fortawesome/free-solid-svg-icons';
import { BehaviorSubject, filter, map, observable, Observable, startWith } from 'rxjs';
import { UserService } from 'src/app/components/user/user.service';
import { AuthType } from '../../../types';
import { NavigationEnd, Router, Event as NavigationEvent } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
  
})
export class NavbarComponent implements OnInit {
  AuthType: any = AuthType;

  userIcon = faUser;
  signoutIcon = faSignOut;

  isMenuCollapsed = true;

  constructor(
    protected userService: UserService,
    protected authService: AuthService,
    ) { }

  async ngOnInit() {
      await this.userService.GetLoggedInUser();
  }
}
