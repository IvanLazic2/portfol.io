import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from "@angular/router";
import { AuthformComponent } from './components/authform/authform.component';
import { HomeComponent } from './components/home/home.component';
import { UserComponent } from './components/user/user.component';
import { AccountComponent } from './components/account/account.component';
import { UserResolver } from './components/user/user.resolver';

const routes: Route[] =
  [
    { 
      path: '', 
      component: HomeComponent,
    },
    { 
      path: 'user/:username', 
      component: UserComponent, 
      resolve: {
        user: UserResolver,
      },
    },
    { 
      path: 'register', 
      component: AuthformComponent, 
    },
    {
      path: 'login', 
      component: AuthformComponent,
    },
    {
      path: 'project',
      loadChildren: () => import('./components/projects/projects.module').then(m => m.ProjectsModule),
    },
    {
      path: 'account',
      component: AccountComponent,
    }
  ]

@NgModule({
  declarations: [],
  imports: [
      RouterModule.forRoot(routes, { 
        /*enableTracing: true,*/
        /*onSameUrlNavigation: 'reload',*/
      }),
    ],
  exports: [
      RouterModule
    ]
})
export class RoutingModule { }
