import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewProjectSidebarComponent } from './new-project-sidebar.component';

describe('NewProjectSidebarComponent', () => {
  let component: NewProjectSidebarComponent;
  let fixture: ComponentFixture<NewProjectSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewProjectSidebarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewProjectSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
