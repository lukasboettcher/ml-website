import { Component } from '@angular/core';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  allTags = ['basic', 'advanced', 'supervised', 'unsupervised', 'reinforcement', 'gan', 'webcam'];
  activeTags = [];
  excludedTags = [];

  cardsData: Card[] = [
    {
      title: 'MNIST',
      routerLink: '/mnist',
      text: `MNIST ist eine Datenbank von handschriftlich geschriebenen Zahlen. Diese werden verwendet, um ein neuronales Netz zu trainieren, welches in der Lage ist, handgeschriebene Zahlen zu erkennen.`,
      srcPath: 'assets/home-images/MnistExamples.png',
      video: false,
      tags: ['basic', 'supervised']
    }, {
      title: 'Objekterkennung',
      routerLink: '/object',
      text: `Diese Komponente demonstriert, wie bereits trainierte Modelle für verschiedene Anwendungsfälle verwendet werden können.
      Konkret werden Objekte durch eine Kamera erkannt.`,
      srcPath: 'assets/home-images/obj-detect-driving.webm',
      video: true,
      tags: ['basic', 'supervised', 'webcam']
    }, {
      title: 'Klassifizierung',
      routerLink: '/classify',
      text: `In der Komponente „Klassifizierung“ wird außerdem die Idee des Transfer-Lernens verwendet, um ein bestehendes Modell in seiner Funktionalität zu erweitern und anzupassen. `,
      srcPath: 'assets/home-images/classify.png',
      video: false,
      tags: ['advanced', 'supervised', 'webcam']
    }, {
      title: 'Tic Tac Toe',
      routerLink: '/tictactoe',
      text: `Hier kannst du gegen den Computer TicTacToe spielen und dabei zusehen, wie dieser dazulernt und seine Entscheidungen trifft. `,
      srcPath: 'assets/home-images/tic-tac-toe.webp',
      video: false,
      tags: ['basic', 'reinforcement']
    }, {
      title: 'Cartpole',
      routerLink: '/cartpole',
      text: `CartPole ist ein berühmtes Problem, bei dem ein beweglicher Wagen versucht, einen Stab
      so lange wie möglich zu balancieren. In dieser Komponente wird ein neuronales Netz
      trainiert, um dieses Spiel bestmöglich zu absolvieren.`,
      srcPath: 'assets/home-images/cartpole.gif',
      video: false,
      tags: ['advanced', 'reinforcement']
    }, {
      title: 'Das Perceptron',
      routerLink: '/perceptron',
      text: `Hier kannst du in einer interaktiven Umgebung schrittweise die Grundlagen eines Perceptrons erfahren.
      Perceptrons sind die elementaren Bausteine aus denen ein neuronales Netz besteht und sind für alle Entscheidungen verantwortlich.`,
      srcPath: 'assets/home-images/perceptron.png',
      video: false,
      tags: ['basic', 'supervised']
    }, {
      title: 'GAN Training',
      routerLink: '/gan-training',
      text: `Was sind GANs? Und wofür können diese verwendet werden?`,
      srcPath: 'assets/home-images/gan-training.webp',
      video: false,
      tags: ['basic', 'gan', 'unsupervised']
    }, {
      title: 'Style Transfer',
      routerLink: '/gan-transfer',
      text: `Verwende eine GAN basierte KI, um den Stil eines Bildes auf ein neues Bild zu übertragen.`,
      srcPath: 'assets/home-images/style.webp',
      video: false,
      tags: ['advanced', 'gan', 'unsupervised', 'webcam']
    }, {
      title: 'Landschaften erzeugen',
      routerLink: '/gan-landscpe',
      text: `Zeichne einen Sketch einer Landschaft und lass den Computer die Zeichnung interpretieren.`,
      srcPath: 'assets/home-images/landscape.gif',
      video: false,
      tags: ['advanced', 'gan', 'unsupervised']
    }, {
      title: 'Übersetzen',
      routerLink: '/translate',
      text: `Übersetze Text mit Hilfe eines neuronalen Netzes. Der Text verlässt dabei niemals deinen Computer und bleibt privat.`,
      srcPath: 'assets/home-images/translate.webp',
      video: false,
      tags: ['advanced', 'supervised']
    }, {
      title: 'Python Notebooks',
      routerLink: '/notebooks',
      text: `Wenn du dich schon etwas mit Python auskennst, bieten wir dir Python Notebooks an, worin du einige Themen noch einmal bearbeiten kannst.`,
      srcPath: 'assets/home-images/jupyter.webp',
      video: false,
      tags: ['advanced']
    },
  ];

  constructor() { }

  filterCards(item: Card, activeTags, excludedTags): boolean {
    for (const tag of excludedTags) {
      if (item.tags?.includes(tag)) {
        return false;
      }
    }
    for (const tag of activeTags) {
      if (item.tags?.includes(tag)) {
        return true;
      }
    }
    if (activeTags.length === 0) {
      return true;
    }
    return false;
  }

  addOrRemove(item: string): void {
    if (this.activeTags.includes(item)) {
      this.activeTags = this.activeTags.filter(e => e !== item);
      this.excludedTags = [...this.excludedTags, item];
    } else if (this.excludedTags.includes(item)) {
      this.excludedTags = this.excludedTags.filter(e => e !== item);
    } else {
      this.activeTags = [...this.activeTags, item];
    }
  }
}

interface Card {
  title: string;
  text: string;
  routerLink?: string;
  srcPath?: string;
  video?: boolean;
  tags?: string[];
}
