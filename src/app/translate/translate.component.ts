import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-translate',
  templateUrl: './translate.component.html',
  styleUrls: ['./translate.component.css']
})
export class TranslateComponent implements OnInit {

  @ViewChild('input', { static: true }) inputElement: ElementRef;
  worker: Worker;
  langFrom = 'de';
  langTo = 'en';
  inputText = '';
  outputText = '';
  translating = false;
  loadingModel = false;

  langs = {
    bg: 'Bulgarisch',
    cs: 'Tschechisch',
    nl: 'Holländisch',
    en: 'Englisch',
    et: 'Estnisch',
    de: 'Deutsch',
    fr: 'Französisch',
    is: 'Isländisch',
    it: 'Italienisch',
    nb: 'Norwegisch Bokmål',
    nn: 'Norwegisch Nynorsk',
    fa: 'Persisch',
    pl: 'Polnisch',
    pt: 'Portugiesisch',
    ru: 'Russisch',
    es: 'Spanisch',
    uk: 'Ukrainisch'
  };

  supportedTranslations = {};

  constructor() { }

  ngOnInit(): void {
    fromEvent(this.inputElement.nativeElement, 'keyup')
      .pipe(debounceTime(500), distinctUntilChanged()).subscribe(() => { this.translateCall(); });
    if (typeof Worker !== 'undefined') {
      this.worker = new Worker('assets/translate/worker.js');
      this.worker.addEventListener('message', ({ data }) => {
        if (data[0] === 'translate_reply' && data[1]) {
          this.outputText = data[1].join('\n\n');
          this.translating = false;
        } else if (data[0] === 'load_model_reply' && data[1]) {
          this.loadingModel = false;
          this.translateCall();
        } else if (data[0] === 'import_reply' && data[1]) {
          const registry = data[1];
          Object.keys(registry).map(k => k.substring(0, 2)).forEach(a => {
            this.supportedTranslations[a] = [];
            Object.keys(this.langs).forEach(b => {
              if (this.isSupported(a, b, registry)) {
                this.supportedTranslations[a] = [...this.supportedTranslations[a], b];
              }
            });
          });
          // this.version = data[2];
          this.loadModel();
        }
      });
      this.worker.postMessage(['import']);
    } else {
      // Web Workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
    }
  }

  translateCall(): void {
    const text = this.inputText;
    if (!text.trim().length) { return; }
    const paragraphs = text.split('\n');
    this.translating = true;

    this.worker.postMessage(['translate', this.langFrom, this.langTo, paragraphs]);
  }


  isSupported(from: string, to: string, registry: any): boolean {
    if (from === to) {
      return false;
    }
    const directlySupported = `${from}${to}` in registry;
    const transitivelySupported = (`${from}en` in registry) && (`en${to}` in registry);
    return directlySupported || transitivelySupported;
  }

  loadModel(): void {
    this.loadingModel = true;
    this.worker.postMessage(['load_model', this.langFrom, this.langTo]);
  }

  findFirstSupportedTo(): string {
    return this.supportedTranslations[this.langFrom].find(l => l !== this.langFrom)[0];
  }

  swap(): void {
    const prevLangFrom = this.langFrom;

    this.langFrom = this.langTo;
    this.langTo = prevLangFrom;

    this.inputText = this.outputText;
    this.loadModel();
  }

  updateFromLang(): void {
    this.langTo = (this.langTo !== this.langFrom)
      ? this.langTo
      : this.findFirstSupportedTo();
    this.loadModel();
  }

  updateFromTo(): void {
    this.loadModel();
  }
}
