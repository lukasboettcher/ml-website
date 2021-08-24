import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandscapeCanvasComponent } from './landscape-canvas.component';

describe('LandscapeCanvasComponent', () => {
  let component: LandscapeCanvasComponent;
  let fixture: ComponentFixture<LandscapeCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandscapeCanvasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandscapeCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
