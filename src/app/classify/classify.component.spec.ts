import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassifyComponent } from './classify.component';

describe('ClassifyComponent', () => {
  let component: ClassifyComponent;
  let fixture: ComponentFixture<ClassifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassifyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
