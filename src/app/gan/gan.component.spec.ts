import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GanComponent } from './gan.component';

describe('GanComponent', () => {
  let component: GanComponent;
  let fixture: ComponentFixture<GanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
