import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MnistEvalModelComponent } from './mnist-eval-model.component';

describe('MnistEvalModelComponent', () => {
  let component: MnistEvalModelComponent;
  let fixture: ComponentFixture<MnistEvalModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MnistEvalModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MnistEvalModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
