import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private homeUrl = '/api/home/';

  constructor(
    private http: HttpClient,
  ) { }

  public GetProjects(): Observable<any> {
    return this.http.get(this.homeUrl);
  }

}
