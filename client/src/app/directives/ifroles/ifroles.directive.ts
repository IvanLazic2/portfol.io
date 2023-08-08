import { Directive, Input, OnDestroy, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserroleService } from 'src/app/services/userrole/userrole.service';

@Directive({
  selector: '[ifRoles]'
})
export class IfrolesDirective implements OnInit, OnDestroy {
  private subscription: Subscription[] = []
  @Input() public ifRoles: Array<string>;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private userRoleService: UserroleService
  ) { }

  public ngOnInit(): void {
    this.subscription.push(
      this.userRoleService.GetUserRoles().subscribe(res => {
        if (!res) {
          // Remove element from DOM
          this.viewContainerRef.clear();
        }
        // user Role are checked by a Roles mention in DOM
        const idx = res.findIndex((element) => this.ifRoles.indexOf(element) !== -1);
        if (idx < 0) {
          this.viewContainerRef.clear();
        } else {
          // appends the ref element to DOM
          this.viewContainerRef.createEmbeddedView(this.templateRef);
        }
      })
    );

  }

  public ngOnDestroy(): void {
    this.subscription.forEach((subscription: Subscription) => subscription.unsubscribe());
  }
}
