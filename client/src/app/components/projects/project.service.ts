import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Observable, lastValueFrom } from 'rxjs';
import { ProjectPOST, ToastType } from 'src/app/types';
import { UserService } from '../user/user.service';
import { ToastService } from 'src/app/services/toast/toast.service';

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
    private toastService: ToastService,
  ) { }

  getIsEditing() {
    return this.isEditing;
  }

  setIsEditing(value: boolean) {
    if (!this.userService.LoggedInUser) {
      return;
    }
    else if (!this.userService.CurrentUser) {
      return;
    }

    if (this.userService.CurrentUser.Username === this.userService.LoggedInUser.Username) {
      this.isEditing = value;
    }

    //this.isEditing = value;
  }

  public CreateProject(project: ProjectPOST): Observable<any> {
    return this.http.post(this.projectsUrl, project, {
        "headers": AuthService.GetAuthHeaders(),
      });
  }

  public async GetProjects(username: string) {
    const getProjectResult$ = this.http.get<any[]>(this.getAllUserProjectsUrl + username, {
      "headers": AuthService.GetAuthHeaders(),
    });

    this.CurrentProjects = await lastValueFrom(getProjectResult$);
  }

  public GetProject(id: string): Observable<any> {
    return this.http.get(this.projectsUrl + id, {
      "headers": AuthService.GetAuthHeaders(),
    });
  }

  public EditProject(id: string, project: ProjectPOST) {
    return this.http.put(this.projectsUrl + id, project, {
      "headers": AuthService.GetAuthHeaders(),
    });
  }

  public DeleteProject(id: string): Observable<any> {
    return this.http.delete(this.projectsUrl + id, {
      "headers": AuthService.GetAuthHeaders(),
    });
  }

  public LikeProject(projectId: string): Observable<any> {
    return this.http.get(this.projectsUrl + 'like/' + projectId, {
      "headers": AuthService.GetAuthHeaders(), 
    });
  }

  public UnlikeProject(projectId: string): Observable<any> {
    return this.http.get(this.projectsUrl + 'unlike/' + projectId, {
      "headers": AuthService.GetAuthHeaders(), 
    });
  }

  public GetProjectLikeCount(projectId: string): Observable<number> {
    return this.http.get<number>(this.projectsUrl + 'likeCount/' + projectId);
  }

  public GetProjectIsLiked(projectId: string): Observable<boolean> {
    return this.http.get<boolean>(this.projectsUrl + 'isLiked/' + projectId, {
      "headers": AuthService.GetAuthHeaders(), 
    });
  }

  public HighlightUpload(uploadId: string): Observable<any> {
    return this.http.get(this.projectsUrl + 'highlightUpload/' + uploadId, {
      "headers": AuthService.GetAuthHeaders(),
    });
  }
  
  public async CheckAcheavement(response: any) {
    try {
      if (response.acheavement) {
        this.toastService.show("Acheavement", response.message, response.messageType);
      }
    } catch (error) {
      console.error(error); 
    }
  }
}
