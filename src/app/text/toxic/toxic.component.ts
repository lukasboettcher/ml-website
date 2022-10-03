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

  model: toxicity.ToxicityClassifier;
  labels: string[];
  modelLoaded = false;

  labelTranslation: { [index: string]: string } = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    identity_attack: 'Identitätsangriff',
    insult: 'Beleidigung',
    obscene: 'Obszönität',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    severe_toxicity: 'Schwere Beleidigung',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    sexual_explicit: 'Sexuell Explizit',
    threat: 'Bedrohung',
    toxicity: 'Toxisch',
  };

  tableData: TableRowData[] = [];

  useTranslation = false;
  worker: Worker;
  loadingModel = false;
  translateResolve: (value: string | PromiseLike<string>) => void = null;

  constructor() {
    if (typeof Worker !== 'undefined' && this.useTranslation) {
      this.worker = new Worker('assets/translate/worker.js');
      this.worker.addEventListener('message', ({ data }) => {
        if (data[0] === 'translate_reply' && data[1]) {
          const outputText = data[1].join('\n\n');
          this.translateResolve(outputText);
          this.translateResolve = null;
        } else if (data[0] === 'load_model_reply' && data[1]) {
          this.loadingModel = false;
          console.log('model loaded');
        } else if (data[0] === 'import_reply' && data[1]) {
          this.loadingModel = true;
          this.worker.postMessage(['load_model', 'de', 'en']);
        }
      });
      this.worker.postMessage(['import']);
    } else {
      // Web Workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
      console.warn('Web Workers not supported or Translation disabled.');
    }
  }

  ngOnInit(): void {
    toxicity.load(0.60, []).then(model => {
      this.model = model;
      this.labels = model.tfmodel.outputNodes.map(d => d.split('/')[0]);
      this.modelLoaded = true;
    });
  }

  translate(text: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.useTranslation) {
        resolve(text);
        return;
      }
      if (this.translateResolve !== null) {
        reject('Concurrent Translations not allowed!');
        return;
      }
      this.translateResolve = resolve;
      if (!text.trim().length) { return; }
      const paragraphs = text.split('\n');
      this.worker.postMessage(['translate', 'de', 'en', paragraphs]);
    });
  }

  async onTextChange(target: HTMLInputElement, table: HTMLTableElement) {
    this.evaluateText(target.value)
      .then(_ => { target.value = ''; });
  }

  async evaluateText(elText: string): Promise<void> {
    if (elText === '') {
      return;
    }
    const translatedText = await this.translate(elText);
    const inputText = [translatedText];

    this.model.classify(inputText)
      .then(predictions => {
        console.log(predictions);
        inputText.map((text, i) => {
          const res: TableRowData = predictions.reduce((obj, item) => ({ ...obj, [item.label]: item.results[i].match }), { text });
          this.tableData.push(res);
        });
      });
  }

  getTextFromResult(result: string | boolean | null): string {
    if (result === true) {
      return 'Positiv';
    } else if (result === false) {
      return 'Negativ';
    } else {
      return 'Unsicher';
    }
  }
}
