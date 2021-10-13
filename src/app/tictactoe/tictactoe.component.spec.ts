import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TictactoeComponent } from './tictactoe.component';

describe('TictactoeComponent', () => {
  let component: TictactoeComponent;
  let fixture: ComponentFixture<TictactoeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TictactoeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TictactoeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
