import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpButtonComponent } from './help-button.component';

describe('HelpButtonComponent', () => {
  let component: HelpButtonComponent;
  let fixture: ComponentFixture<HelpButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
