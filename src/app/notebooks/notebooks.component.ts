import { Component } from '@angular/core';

@Component({
  selector: 'app-notebooks',
  templateUrl: './notebooks.component.html',
  styleUrls: ['./notebooks.component.css']
})
export class NotebooksComponent {

  repoLink = 'lukasboettcher/ml-website-notebooks';

  notebookDesc: NotebookDescription[] = [];

  webRequest = false;
}

interface NotebookDescription {
  fileName: string;
  title: string;
  description?: string;
}
