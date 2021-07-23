import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GanCanvasComponent } from './gan-canvas.component';

describe('GanCanvasComponent', () => {
  let component: GanCanvasComponent;
  let fixture: ComponentFixture<GanCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GanCanvasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GanCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
