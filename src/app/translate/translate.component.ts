@Component({
  selector: 'app-translate',
  templateUrl: './translate.component.html',
  styleUrls: ['./translate.component.css']
})
export class TranslateComponent implements OnInit {

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
}
