import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-notebook-entry',
  templateUrl: './notebook-entry.component.html',
  styleUrls: ['./notebook-entry.component.css']
})
export class NotebookEntryComponent {

  @Input()
  notebookTitle;

  @Input()
  notebookLink;

  constructor() { }

}
