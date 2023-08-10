import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';
import { ProjectPOST } from 'src/app/types';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projectUrl = '/api/project/'

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) { }

  public CreateProject(project: ProjectPOST): Observable<any> {
    return this.http.post(this.projectUrl, project, {
        "headers": this.authService.GetAuthHeaders()
      });
  }
}
