import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MnistAComponent } from './mnista.component';

describe('MnistAComponent', () => {
  let component: MnistAComponent;
  let fixture: ComponentFixture<MnistAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MnistAComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MnistAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
