import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawDigitComponent } from './draw-digit.component';

describe('DrawDigitComponent', () => {
  let component: DrawDigitComponent;
  let fixture: ComponentFixture<DrawDigitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrawDigitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawDigitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
