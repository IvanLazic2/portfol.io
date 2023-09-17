// the view transition api
// https://www.bram.us/2023/05/09/rearrange-animate-css-grid-layouts-with-the-view-transition-api/ 
// https://developer.chrome.com/docs/web-platform/view-transitions/
// https://stackblitz.com/edit/angular-bp4pvy?file=src%2Futils.ts,src%2Fmain.ts
// https://konstantin-denerz.com/view-transitions-with-angular-spa/

// async route guards

/* package versions:
   https://stackoverflow.com/questions/16073603/how-to-update-each-dependency-in-package-json-to-the-latest-version */

import { Component, OnInit } from '@angular/core';
import { ChildrenOutletContexts, NavigationEnd, Router, Event as NavigationEvent, NavigationStart } from '@angular/router';
import { Location } from '@angular/common';
import { BehaviorSubject, filter, map, startWith } from 'rxjs';
import { ToastType } from './types';
import { animate, state, style, transition, trigger, query, group } from '@angular/animations';
import { AnimationService } from './services/animation/animation.service';
import { start } from '@popperjs/core';
import { IntersectionObserverService } from './services/IntersectionObserver/intersection-observer-service.service';
import { ToastService } from './services/toast/toast.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [IntersectionObserverService],
})
export class AppComponent {
  title = 'client';

  constructor(
    protected animationService: AnimationService,
    protected router: Router,
    protected location: Location,
    private toastService: ToastService,
  ) 
  { }
}
