import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GanTrainingComponent } from './gan-training.component';

describe('GanTrainingComponent', () => {
  let component: GanTrainingComponent;
  let fixture: ComponentFixture<GanTrainingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GanTrainingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GanTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
