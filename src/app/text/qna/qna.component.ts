import { Component, OnInit } from '@angular/core';
import * as qna from '@tensorflow-models/qna';

@Component({
  selector: 'app-qna',
  templateUrl: './qna.component.html',
  styleUrls: ['./qna.component.css']
})
export class QnaComponent implements OnInit {

  wikipediaURL = 'https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&prop=extracts&redirects=1&formatversion=latest&explaintext=1&exsectionformat=plain&titles=';
  model: qna.QuestionAndAnswer;
  modelLoaded = false;
  loadingWiki = false;
  answerLoading = false;
  context = '';
  question = '';
  answer = '';
  onlyIntro = true;

  constructor() { }

  ngOnInit(): void {
    qna.load({ modelUrl: 'assets/text/qna/model.json' }).then(model => {
      this.model = model;
      this.modelLoaded = true;
    });
  }


interface WikiResponse {
  batchcomplete: boolean;
  query: {
    normalized?: Array<{
      fromencoded: boolean;
      from: string;
      to: string;
    }>;
    redirects?: Array<{ from: string; to: string }>;
    pages: Array<{
      pageid: number;
      ns: number;
      title: string;
      extract: string;
    }>;
  };
}
