import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CartpoleHelpComponent } from './cartpole-help.component';

describe('CartpoleHelpComponent', () => {
  let component: CartpoleHelpComponent;
  let fixture: ComponentFixture<CartpoleHelpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CartpoleHelpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartpoleHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
