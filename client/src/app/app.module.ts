import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { FooterComponent } from './components/footer/footer.component';
import { NavComponent } from './components/nav/nav.component';
import { HomeComponent } from './components/home/home.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { RoutingModule } from './routing.module';

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastsComponent } from './components/toasts/toasts.component';
import { AuthformComponent } from './components/authform/authform.component';
import { UserComponent } from './components/user/user.component';
import { AnimationService } from './services/animation/animation.service';
import { IfrolesDirective } from './directives/ifroles/ifroles.directive';
import { NewartComponent } from './components/newart/newart.component';
import { PortfolioitemComponent } from './components/portfolioitem/portfolioitem.component';
import { AnimateAfterAppearDirective } from './directives/animations/animateBeforeAppear/animate-after-appear.directive';
import { SecureImagePipe } from './pipes/secureImage/secure-image.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FooterComponent,
    NavComponent,
    UserComponent,
    ToastsComponent,
    AuthformComponent,
    NewartComponent,
    PortfolioitemComponent,
    AnimateAfterAppearDirective,
    IfrolesDirective,
    SecureImagePipe
  ],
  imports: [
    BrowserModule,
    NgbModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbProgressbarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
