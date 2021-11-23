import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MnistBComponent } from './mnistb.component';

describe('MnistBComponent', () => {
  let component: MnistBComponent;
  let fixture: ComponentFixture<MnistBComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MnistBComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MnistBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
