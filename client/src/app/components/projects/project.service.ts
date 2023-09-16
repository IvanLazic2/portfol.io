import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Observable, lastValueFrom } from 'rxjs';
import { ProjectPOST, RatingDELETE, RatingPOST } from 'src/app/types';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projectsUrl = '/api/project/';
  private getAllUserProjectsUrl = this.projectsUrl + 'user/';
  private isEditing = false;

  public CurrentProjects: any[];

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private userService: UserService,
  ) { }

  getIsEditing() {
    return this.isEditing;
  }

  setIsEditing(value: boolean) {
    if (!this.userService.LoggedInUser) {
      return;
    }
    
    if (this.userService.CurrentUser.Username === this.userService.LoggedInUser.Username) {
      this.isEditing = value;
    }

    this.isEditing = value;
  }

  public CreateProject(project: ProjectPOST): Observable<any> {
    return this.http.post(this.projectsUrl, project, {
        "headers": this.authService.GetAuthHeaders(),
      });
  }

  public async GetProjects(username: string) {
    /*return this.http.get<any[]>(this.getAllUserProjectsUrl + username, {
      "headers": this.authService.GetAuthHeaders(),
    });*/

    const getProjectResult$ = this.http.get<any[]>(this.getAllUserProjectsUrl + username, {
      "headers": this.authService.GetAuthHeaders(),
    });

    this.CurrentProjects = await lastValueFrom(getProjectResult$);
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

  public LikeProject(projectId: string): Observable<any> {
    return this.http.get(this.projectsUrl + 'like/' + projectId, {
      "headers": this.authService.GetAuthHeaders(), 
    })
  }

  public UnlikeProject(projectId: string): Observable<any> {
    return this.http.get(this.projectsUrl + 'unlike/' + projectId, {
      "headers": this.authService.GetAuthHeaders(), 
    })
  }

  public GetProjectLikeCount(projectId: string): Observable<number> {
    return this.http.get<number>(this.projectsUrl + 'likeCount/' + projectId);
  }

  public GetProjectIsLiked(projectId: string): Observable<boolean> {
    return this.http.get<boolean>(this.projectsUrl + 'isLiked/' + projectId, {
      "headers": this.authService.GetAuthHeaders(), 
    })
  }

  public HighlightUpload(uploadId: string): Observable<any> {
    return this.http.get(this.projectsUrl + 'highlightUpload/' + uploadId, {
      "headers": this.authService.GetAuthHeaders(),
    })
  }
  
}
