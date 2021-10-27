import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TttFieldComponent } from './ttt-field.component';

describe('TttFieldComponent', () => {
  let component: TttFieldComponent;
  let fixture: ComponentFixture<TttFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TttFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TttFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
