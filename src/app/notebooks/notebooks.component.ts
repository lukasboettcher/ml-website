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
            fetch(`https://raw.githubusercontent.com/${this.repoLink}/main/${nbName}`)
              .then(responseNB => responseNB.json())
              .then(jsonNB => {
                const description = jsonNB.cells.filter(cell => cell.cell_type === 'markdown')[0].source; // [0].source

                const ndsc: NotebookDescription = {
                  fileName: nbName,
                  title: description[0],
                  description: description[2]
                };

                this.notebookDesc.push(ndsc);
              });
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
