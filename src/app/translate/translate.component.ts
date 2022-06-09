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
  constructor() { }

  ngOnInit(): void {
}
