// the view transition api
// https://www.bram.us/2023/05/09/rearrange-animate-css-grid-layouts-with-the-view-transition-api/ 
// https://developer.chrome.com/docs/web-platform/view-transitions/
// https://stackblitz.com/edit/angular-bp4pvy?file=src%2Futils.ts,src%2Fmain.ts
// https://konstantin-denerz.com/view-transitions-with-angular-spa/

// async route guards

import { Component, OnInit } from '@angular/core';
import { ChildrenOutletContexts, NavigationEnd, Router, Event as NavigationEvent, NavigationStart } from '@angular/router';
import { Location } from '@angular/common';
import { BehaviorSubject, filter, map, startWith } from 'rxjs';
import { File, Page } from './types';
import { animate, state, style, transition, trigger, query, group } from '@angular/animations';
import { AnimationService } from './services/animation/animation.service';
import { start } from '@popperjs/core';
import { IntersectionObserverService } from './services/IntersectionObserver/intersection-observer-service.service';


/* CONTENT LAYOUT
display: flex;
flex-direction: column;
height: 100vh;
*/

/* NAVBAR
flex: 0 0 auto;
*/

/* CONTENT
flex: 1 1 auto;
*/

/* FOOTER
flex: 0 0 auto;
*/


/*const navbar_contentLayout = {
  "display": "flex",
  "flex-direction": "column",
  "height": "100vh"
}
const sidebar_contentLayout = {
  "display": "grid",
  "grid-template-columns": "0.2fr 1fr",
  "grid-template-rows": "1fr",
  "height": "100vh"
}

const navbar_navbar = { 
  "background": "blue",
  "flex": "0 0 auto"
};
const sidebar_navbar = {
  "background": "red",
  "grid-column": "1",
  "grid-row-start": "1",
  "grid-row-end": "3",
  "height": "100%"
};

const navbar_content = {
  "flex": "1 1 auto"
}
const sidebar_content = {
  "grid-column": "2",
  "grid-row": "1"
}

const navbar_footer = {
  "background": "green",
  "flex": "0 0 auto"
}
const sidebar_footer = {
  "background": "yellow",
  "grid-column": "2",
  "grid-row": "2"
}*/

const navbar_contentLayout = {
};
const sidebar_contentLayout = {
};

const navbar_navbar = {
  "background-color": "white",
  "display": "block",
  "width": "100%",
  "min-height": "90px",
  "height": "0%",
  "padding": "0"
};
const sidebar_navbar = {
  "background-color": "#dedede",
  "display": "block",
  "width": "30%",
  "min-height": "0px",
  "height": "100%",
  "padding": "0",

  "position": "fixed",
};

const navbar_content = {
  "margin-left": "0%",
};
const sidebar_content = {
  "margin-left": "30%"
};

const navbar_footer = {
};
const sidebar_footer = {
};




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [IntersectionObserverService],
  animations: [
    trigger("navbarAnimationTrigger", [

      state("navbarAnimation", style(navbar_navbar)),
      state("sidebarAnimation", style(sidebar_navbar)),
      transition("navbarAnimation <=> sidebarAnimation", animate(`1s ease-out`))

    ]),
    trigger("contentAnimationTrigger", [

      state("navbarAnimation", style(navbar_content)),
      state("sidebarAnimation", style(sidebar_content)),
      transition("navbarAnimation <=> sidebarAnimation", animate(`1s ease-out`))

    ])
  ]
})
export class AppComponent {
  constructor(
    protected animationService: AnimationService,
    protected router: Router,
    protected location: Location
  ) {
    //this.router.navigate([{ outlets: { primary: ['signin'], sidebar: ['sidebar'] } }])
  }

  /*readonly showAbout2$ = this.router.events.pipe(
    filter((event: NavigationEnd) => event instanceof NavigationEnd),
    map((event: NavigationEnd) => this.canShowNewArt(event.urlAfterRedirects)),
    startWith(this.canShowNewArt(this.router.url))
  )*/

  title = 'client';

  getRouteAnimation() {
    return this.animationService.GetCurrentAnimation();
  }

  /*canShowNewArt(): boolean {
    return ["/user"].every((path) => this.location.path().startsWith(path));
  }*/
}
