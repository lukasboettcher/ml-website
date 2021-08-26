import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GanTransferInputComponent } from './gan-transfer-input.component';

describe('GanTransferInputComponent', () => {
  let component: GanTransferInputComponent;
  let fixture: ComponentFixture<GanTransferInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GanTransferInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GanTransferInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
