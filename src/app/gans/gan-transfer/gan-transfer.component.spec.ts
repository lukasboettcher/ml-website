import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GanTransferComponent } from './gan-transfer.component';

describe('GanTransferComponent', () => {
  let component: GanTransferComponent;
  let fixture: ComponentFixture<GanTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GanTransferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GanTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
