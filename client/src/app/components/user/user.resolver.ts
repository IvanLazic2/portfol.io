import { ResolveFn } from '@angular/router';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/components/user/user.service';
import { ProjectService } from '../projects/project.service';

@Injectable({
  providedIn: 'root',
})
export class UserResolver {
  constructor(
    private userService: UserService,
    private projectService: ProjectService) { }

  async resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    const username = route.paramMap.get('username');
    await this.userService.GetCurrentUser(username!);
    await this.projectService.GetProjects(username!);
  }
}
