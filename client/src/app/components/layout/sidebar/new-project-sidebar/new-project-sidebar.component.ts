import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-new-project-sidebar',
  templateUrl: './new-project-sidebar.component.html',
  styleUrls: ['./new-project-sidebar.component.scss']
})
export class NewProjectSidebarComponent {
  constructor(
    protected userService: UserService
  )
  {}
}
