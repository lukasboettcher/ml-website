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

  async interpret(): Promise<void> {
    if (!this.modelLoaded) {
      console.warn('ignoring query, since model not loaded yet!');
      return;
    } else if (this.context.length < 1) {
      console.warn('ignoring query, since given context does not contain any information!');
      return;
    }
    this.answerLoading = true;
    this.model.findAnswers(this.question, this.context).then(answers => {
      console.log(answers);
      if (answers.length < 1) {
        console.warn('no answers generated from model, possibly not enough context for the query.');
        this.answer = 'ERROR: keine Antwort gefunden!';
      } else {
        this.answer = answers[0].text;
      }
      this.answerLoading = false;
    });
  }

  getWikiUrl(title: string, onlyIntro: boolean = true) {
    const encodedTitle = encodeURI(title);
    const introString = onlyIntro ? '&exintro=1' : '';
    return `${this.wikipediaURL}${encodedTitle}${introString}`;
  }

  async fetchWikiPage(title: string): Promise<string> {
    const url = this.getWikiUrl(title, this.onlyIntro);
    const response = await fetch(url);
    const parsedResponse: WikiResponse = await response.json();
    return parsedResponse.query.pages[0].extract;
  }
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
