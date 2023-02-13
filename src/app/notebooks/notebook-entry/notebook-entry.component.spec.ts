import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotebookEntryComponent } from './notebook-entry.component';

describe('NotebookEntryComponent', () => {
  let component: NotebookEntryComponent;
  let fixture: ComponentFixture<NotebookEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotebookEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotebookEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
