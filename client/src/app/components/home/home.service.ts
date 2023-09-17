import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private homeUrl = '/api/home/';

  public CurrentProjects: any[];

  constructor(
    private http: HttpClient,
  ) { }

  public async GetProjects() {
    const getProjectsResult$ = this.http.get<any[]>(this.homeUrl);
    this.CurrentProjects = await lastValueFrom(getProjectsResult$);
  }
}
