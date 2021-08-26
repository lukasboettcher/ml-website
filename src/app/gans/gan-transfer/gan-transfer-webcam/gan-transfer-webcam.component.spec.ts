import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GanTransferWebcamComponent } from './gan-transfer-webcam.component';

describe('GanTransferWebcamComponent', () => {
  let component: GanTransferWebcamComponent;
  let fixture: ComponentFixture<GanTransferWebcamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GanTransferWebcamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GanTransferWebcamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
