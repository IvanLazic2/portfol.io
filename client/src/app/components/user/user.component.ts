import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IntersectionObserverService } from 'src/app/services/IntersectionObserver/intersection-observer-service.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  providers: [IntersectionObserverService]
})
export class UserComponent {
  SortDropdownLabel: string = "Default";


  constructor(
    private router: Router,
    protected userService: UserService)
  { }

  ngOnInit(): void {
  }

}
