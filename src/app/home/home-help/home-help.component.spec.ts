import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeHelpComponent } from './home-help.component';

describe('HomeHelpComponent', () => {
  let component: HomeHelpComponent;
  let fixture: ComponentFixture<HomeHelpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeHelpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
