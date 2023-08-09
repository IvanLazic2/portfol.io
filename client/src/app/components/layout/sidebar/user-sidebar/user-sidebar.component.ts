import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-user-sidebar',
  templateUrl: './user-sidebar.component.html',
  styleUrls: ['./user-sidebar.component.scss']
})
export class UserSidebarComponent {
  constructor(
    protected location: Location,
    protected userService: UserService,
  ) {}

  canShowNewProject(): boolean {
    return ["/user"].every((path) => this.location.path().startsWith(path));
  }
}
