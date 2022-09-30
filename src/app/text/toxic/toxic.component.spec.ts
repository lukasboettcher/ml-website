import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToxicComponent } from './toxic.component';

describe('ToxicComponent', () => {
  let component: ToxicComponent;
  let fixture: ComponentFixture<ToxicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToxicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToxicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
