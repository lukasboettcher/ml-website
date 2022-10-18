import { Component, OnInit } from '@angular/core';
import * as qna from '@tensorflow-models/qna';

@Component({
  selector: 'app-qna',
  templateUrl: './qna.component.html',
  styleUrls: ['./qna.component.css']
})
export class QnaComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    qna.load({ modelUrl: 'assets/text/qna/model.json' }).then(model => {
      this.model = model;
      this.modelLoaded = true;
    });
  }

}
