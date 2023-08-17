import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpParams, HttpRequest, HttpHeaders, HttpEvent } from '@angular/common/http';
import { BehaviorSubject, filter, map, Observable, tap, last, endWith } from 'rxjs';


import { Page, Category, SortOrder, ToastType } from "../../types"
import { ToastService } from '../toast/toast.service';
import { UserService } from '../user/user.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class FilesService {
  private readonly filesUrl = "/api/files/";

  Files: Observable<any[]> = new Observable<any[]>();
  CurrentPage: Page;
  ResultMessage: string = "";
  SortOrder: SortOrder = SortOrder.Default;


  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private toastService: ToastService,
    private userService: UserService,
  ) {

    this.RefreshFiles();
  }

  GetImage(_id: string) {
    if (!this.userService.GetIsLoggedIn())
      return;

    const token = window.localStorage.getItem("token");
    const headers = new HttpHeaders({ "authorization": token ?? "" });

    return this.http.get<any>("/api/getImage/" + _id, { "headers": headers, responseType: "blob" as "json" });
  }

  RefreshFiles() {
    if (!this.userService.GetIsLoggedIn())
      return;

    const token = window.localStorage.getItem("token");
    const headers = new HttpHeaders({ "authorization": token ?? "" });

    this.Files = this.http.get<any[]>(this.filesUrl, { "headers": headers });

    this.SortFiles();
  }

  SortFiles() {
    switch (this.SortOrder) {
      case SortOrder.Default:
        this.Files = this.Files.pipe(
          map(files => files?.sort((a, b) => (a.UploadDate > b.UploadDate) ? 1 : -1))
        )
        break;
      case SortOrder.NameAToZ:
        this.Files = this.Files.pipe(
          map(files => files?.sort((a, b) => (a.Name > b.Name) ? 1 : -1))
        )
        break;
      case SortOrder.NameZToA:
        this.Files = this.Files.pipe(
          map(files => files?.sort((a, b) => (a.Name < b.Name) ? 1 : -1))
        )
        break;

      default:
        break;
    }
  }

  /*ShouldShow(file?: File)
  {
    if (this.CurrentPage == Page.Trash)
    {
      return file?.Categories.includes(Page.Trash.toString() as Category);
    }
    else if (this.CurrentPage == Page.Files)
    {
      return !file?.Categories.includes(Page.Trash.toString() as Category);
    }
    else
    {
      return file?.Categories.includes(this.CurrentPage!.toString() as Category);
    }
  }*/

  UploadStatus(event: any): { percentage: number, done: boolean } {
    if (event.body) {
      this.ResultMessage = event.body.message;
    }

    let percentage = Math.round(100 * event.loaded / event.total);
    let done = HttpEventType.Response == event.type;
    return { percentage, done };
  }

  Upload(data: { file: any }, handler: (percentage: number, done: boolean) => void): Observable<any> {
    let formData: FormData = new FormData();
    formData.append("file", data.file, data.file.name);

    const token = window.localStorage.getItem("token");
    const headers = new HttpHeaders({ "authorization": token ?? "" });

    const req = new HttpRequest("POST", this.filesUrl, formData, { "headers": headers, reportProgress: true });

    return this.http.request(req)
      .pipe
      (
        map(event => this.UploadStatus(event)),
        tap((status: { percentage: number, done: boolean }) => {
          handler(status.percentage, status.done);
        }),
        last()
      );
  }






  private readonly uploadUrl = "/api/upload/";
  private readonly thumbnailUrl = "/api/thumbnail/";

  public GetThumbnails(projectId: string): Observable<any[]> {
    return this.http.get<any[]>(this.thumbnailUrl + projectId);
  }
  

  public UploadFile(file: File): Observable<HttpEvent<any>> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    const req = new HttpRequest('POST', '/api/upload/', formData, {
      "headers": this.authService.GetAuthHeaders(),
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

      const response = this.http.post(this.uploadUrl, formData, {
        "headers": this.authService.GetAuthHeaders(),
        reportProgress: true,
        observe: 'events'
      });

      responses.push([file.name, response]);
    });

    return responses;

    /*const formData = new FormData();
    for (let file of files) {
      formData.append('files', file, file.name);
    }
    formData.append('upload', files[0]);
    formData.append('projectId', projectId);

    const req = new HttpRequest('POST', '/api/upload/', formData, {
      "headers": this.authService.GetAuthHeaders(),
      reportProgress: true,
    });

    return this.http.request(req);*/
  }

  DeleteUpload(uploadId: string): Observable<any> {
    return this.http.delete(this.uploadUrl + uploadId, {
      "headers": this.authService.GetAuthHeaders(),
    });
  }








  Download(_id: string) {
    const token = window.localStorage.getItem("token");
    const headers = new HttpHeaders({ "authorization": token ?? "" });

    this.http.get("/api/files/download/" + _id, { "headers": headers, responseType: "blob", observe: "response" })
      .subscribe((res) => {
        let fileName = res.headers.get("content-disposition")?.split(";")[1].split("=")[1].slice(1, -1);
        let blob = res.body as Blob;
        let a = document.createElement("a");
        a.download = fileName!;
        a.href = window.URL.createObjectURL(blob);
        a.click();
      });
  }

  Delete(_id: string) {
    const token = window.localStorage.getItem("token");
    const headers = new HttpHeaders({ "authorization": token ?? "" });

    this.http.delete(this.filesUrl + _id, { "headers": headers })
      .subscribe((res) => {
        this.RefreshFiles();
        this.toastService.show("", (res as { message: string }).message, ToastType.Success);
      });
  }

}
