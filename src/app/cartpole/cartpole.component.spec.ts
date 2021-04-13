import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CartpoleComponent } from './cartpole.component';

describe('CartpoleComponent', () => {
  let component: CartpoleComponent;
  let fixture: ComponentFixture<CartpoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CartpoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartpoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
