import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Observable, lastValueFrom } from 'rxjs';
import { ProjectPOST } from 'src/app/types';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projectsUrl = '/api/projects/';
  private isEditing = false;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) { }

  getIsEditing() {
    return this.isEditing;
  }

  setIsEditing(value: boolean) {
    this.isEditing = value;
  }

  public CreateProject(project: ProjectPOST): Observable<any> {
    return this.http.post(this.projectsUrl, project, {
        "headers": this.authService.GetAuthHeaders(),
      });
  }

  public GetProjects() {
    return this.http.get<any[]>(this.projectsUrl, {
      "headers": this.authService.GetAuthHeaders(),
    });
  }

  public GetProject(id: string): Observable<any> {
    return this.http.get(this.projectsUrl + id, {
      "headers": this.authService.GetAuthHeaders(),
    })
  }

  public EditProject(id: string, project: ProjectPOST) {
    return this.http.put(this.projectsUrl + id, project, {
      "headers": this.authService.GetAuthHeaders(),
    });
  }

  public DeleteProject(id: string): Observable<any> {
    return this.http.delete(this.projectsUrl + id, {
      "headers": this.authService.GetAuthHeaders(),
    })
  }

  public HighlightUpload(uploadId: string): Observable<any> {
    return this.http.get(this.projectsUrl + 'highlightUpload/' + uploadId, {
      "headers": this.authService.GetAuthHeaders(),
    })
  }
}
