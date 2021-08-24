import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandscapeComponent } from './landscape.component';

describe('LandscapeComponent', () => {
  let component: LandscapeComponent;
  let fixture: ComponentFixture<LandscapeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandscapeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandscapeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
