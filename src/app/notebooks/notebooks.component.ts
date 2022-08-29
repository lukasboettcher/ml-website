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

  constructor() {
    if (this.webRequest) {
      fetch(`https://api.github.com/repos/${this.repoLink}/contents`)
        .then(response => response.json())
        .then(json => {
          const re = /(?:\.([^.]+))?$/;

          const notebooks = json.map(obj => obj.name).filter(fileName => re.exec(fileName)[1] === 'ipynb');

          for (const nbName of notebooks) {
          }
        });
    }
  }


}

interface NotebookDescription {
  fileName: string;
  title: string;
  description?: string;
}
