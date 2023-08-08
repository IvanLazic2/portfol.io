import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioitemComponent } from './portfolioitem.component';

describe('PortfolioitemComponent', () => {
  let component: PortfolioitemComponent;
  let fixture: ComponentFixture<PortfolioitemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PortfolioitemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortfolioitemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
