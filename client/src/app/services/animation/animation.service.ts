import { Injectable } from '@angular/core';
import { ChildrenOutletContexts } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AnimationService {
  currentAnimation: string = "navbarAnimation";
  lastAnimation: string = "navbarAnimation";

  constructor(private contexts: ChildrenOutletContexts) { }

  GetCurrentAnimation() {
    this.currentAnimation = this.contexts.getContext("primary")?.route?.snapshot?.data?.["animation"];

    if (!this.currentAnimation)
      this.currentAnimation = this.lastAnimation;

    this.lastAnimation = this.currentAnimation;
    console.log(this.currentAnimation);
    return this.currentAnimation;


    /*
    localStorage.setItem("currentAnimation", this.contexts.getContext("primary")?.route?.snapshot?.data?.["animation"]);

    if (!localStorage.getItem("lastAnimation"))
      localStorage.setItem("lastAnimation", "navbarAnimation");

    if (!localStorage.getItem("currentAnimation"))
      localStorage.setItem("currentAnimation", localStorage.getItem("lastAnimation")!);

    localStorage.setItem("lastAnimation", localStorage.getItem("currentAnimation")!);

    console.log(localStorage.getItem("currentAnimation"));
    return localStorage.getItem("currentAnimation");
    */
  }
}
