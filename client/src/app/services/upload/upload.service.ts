import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpParams, HttpRequest, HttpHeaders, HttpEvent } from '@angular/common/http';
import { BehaviorSubject, filter, map, Observable, tap, last, endWith } from 'rxjs';


import { ToastType } from "../../types"
import { ToastService } from '../toast/toast.service';
import { UserService } from '../../components/user/user.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  public readonly UploadUrl = "/api/upload/";
  public readonly ThumbnailUrl = "/api/thumbnail/";

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private toastService: ToastService,
    private userService: UserService,
  ) { }

  


  public UploadFile(file: File): Observable<HttpEvent<any>> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    const req = new HttpRequest('POST', this.UploadUrl, formData, {
      "headers": AuthService.GetAuthHeaders(),
      reportProgress: true,
    });

    return this.http.request(req);
  }

  public UploadProjectFiles(projectId: string, files: File[]): [string, Observable<HttpEvent<any>>][] {
    const responses: [string, Observable<any>][] = [];

    files.forEach(file => {
      const formData = new FormData();
      formData.append('upload', file);
      formData.append('projectId', projectId);

      const response = this.http.post(this.UploadUrl, formData, {
        "headers": AuthService.GetAuthHeaders(),
        reportProgress: true,
        observe: 'events'
      });

      responses.push([file.name, response]);
    });

    return responses;

  }

  DeleteUpload(uploadId: string): Observable<any> {
    return this.http.delete(this.UploadUrl + uploadId, {
      "headers": AuthService.GetAuthHeaders(),
    });
  }


  Download(id: string) {
    const token = window.localStorage.getItem("token");
    const headers = new HttpHeaders({ "authorization": token ?? "" });

    this.http.get(this.UploadUrl + "download/" + id, { "headers": headers, responseType: "blob", observe: "response" })
      .subscribe((res) => {
        let fileName = res.headers.get("content-disposition")?.split(";")[1].split("=")[1].slice(1, -1);
        let blob = res.body as Blob;
        let a = document.createElement("a");
        a.download = fileName!;
        a.href = window.URL.createObjectURL(blob);
        a.click();
      });
  }

}
