import { Component, OnInit } from '@angular/core';
import * as toxicity from './toxicity';

@Component({
  selector: 'app-toxic',
  templateUrl: './toxic.component.html',
  styleUrls: ['./toxic.component.css']
})
export class ToxicComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    toxicity.load(0.85, []).then(model => {
      const sentences = ['you suck'];
      model.classify(sentences).then(predictions => {
        console.log(predictions);
      });
    });

  }

}
