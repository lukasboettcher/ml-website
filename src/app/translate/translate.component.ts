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
  constructor() { }

  ngOnInit(): void {
    fromEvent(this.inputElement.nativeElement, 'keyup')
      .pipe(debounceTime(500), distinctUntilChanged()).subscribe(() => { this.translateCall(); });
    if (typeof Worker !== 'undefined') {
      this.worker = new Worker('assets/translate/worker.js');
      this.worker.postMessage(['import']);
    } else {
      // Web Workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
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
}
