import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassifyHelpComponent } from './classify-help.component';

describe('ClassifyHelpComponent', () => {
  let component: ClassifyHelpComponent;
  let fixture: ComponentFixture<ClassifyHelpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassifyHelpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassifyHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
