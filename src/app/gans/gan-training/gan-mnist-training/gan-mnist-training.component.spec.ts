import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GanMnistTrainingComponent } from './gan-mnist-training.component';

describe('GanMnistTrainingComponent', () => {
  let component: GanMnistTrainingComponent;
  let fixture: ComponentFixture<GanMnistTrainingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GanMnistTrainingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GanMnistTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
