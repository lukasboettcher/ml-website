import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjDetectionComponent } from './obj-detection.component';

describe('ObjDetectionComponent', () => {
  let component: ObjDetectionComponent;
  let fixture: ComponentFixture<ObjDetectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObjDetectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjDetectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
