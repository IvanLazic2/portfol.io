import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  constructor(
    protected location: Location,
  ) { }

  currentRouteBeginning() {
    const path = this.location.path();
    const segments = path.split('/');
    return segments[1];
  }

  firstNRoutes(n: number, condition: string) {
    const path = this.location.path();
    const segments = path.split('/');
    const firstNRoutes = segments.slice(1, n + 1).join('/');
    return (firstNRoutes == condition)
  }
}
