import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from "@angular/router";
import { AuthformComponent } from './components/authform/authform.component';
import { HomeComponent } from './components/home/home.component';
import { UserComponent } from './components/user/user.component';

const routes: Route[] =
  [
    //{ path: "", component: FilesComponent }, //HomeComponent
    { path: "", component: HomeComponent, data: { animation: "navbarAnimation" } },
    { path: "user/:username", component: UserComponent, data: { animation: "sidebarAnimation" } },
    { path: "signup", component: AuthformComponent, data: { animation: "navbarAnimation" } },
    { path: "signin", component: AuthformComponent, data: { animation: "navbarAnimation" } },

    /*{ path: "shared", component: FilesComponent },
    { path: "pinned", component: FilesComponent },
    { path: "trash", component: FilesComponent },
    { path: "**", redirectTo: "files" }*/
  ]

@NgModule({
  declarations: [],
  imports:
    [
      RouterModule.forRoot(routes)
    ],
  exports:
    [
      RouterModule
    ]
})
export class RoutingModule { }
