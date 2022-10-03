import { Component, OnInit } from '@angular/core';
import * as toxicity from './toxicity';

interface TableRowData {
  [index: string]: boolean | string | null;
  text: string;
}

@Component({
  selector: 'app-toxic',
  templateUrl: './toxic.component.html',
  styleUrls: ['./toxic.component.css']
})
export class ToxicComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    toxicity.load(0.60, []).then(model => {
      this.model = model;
      this.labels = model.tfmodel.outputNodes.map(d => d.split('/')[0]);
      this.modelLoaded = true;
    });
  }

  async evaluateText(elText: string): Promise<void> {
    if (elText === '') {
      return;
    }

    this.model.classify(inputText)
      .then(predictions => {
        console.log(predictions);
        inputText.map((text, i) => {
          const res: TableRowData = predictions.reduce((obj, item) => ({ ...obj, [item.label]: item.results[i].match }), { text });
          this.tableData.push(res);
        });
      });
  }

  }

}
