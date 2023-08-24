import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from "@angular/router";
import { AuthformComponent } from './components/authform/authform.component';
import { HomeComponent } from './components/home/home.component';
import { UserComponent } from './components/user/user.component';
import { AccountComponent } from './components/account/account.component';

const routes: Route[] =
  [
    { 
      path: '', 
      component: HomeComponent, 
      data: { animation: "navbarAnimation" },
    },
    { 
      path: 'user/:username', 
      component: UserComponent, 
      data: { animation: "sidebarAnimation" },
    },
    { 
      path: 'signup', 
      component: AuthformComponent, 
      data: { animation: "navbarAnimation" } 
    },
    {
      path: 'signin', 
      component: AuthformComponent, 
      data: { animation: "navbarAnimation" } 
    },
    {
      path: 'project',
      loadChildren: () => import('./components/projects/projects.module').then(m => m.ProjectsModule),
      data: { animation: "sidebarAnimation" }
    },
    {
      path: 'account',
      component: AccountComponent,
      data: { animation: "sidebarAnimation" }
    }
  ]

@NgModule({
  declarations: [],
  imports: [
      RouterModule.forRoot(routes/*, { enableTracing: true }*/)
    ],
  exports: [
      RouterModule
    ]
})
export class RoutingModule { }
