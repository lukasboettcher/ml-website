import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  cardsData: Card[] = [
    {
      title: 'MNIST',
      routerLink: '/mnist',
      text: `MNIST ist eine Datenbank von handschriftlich geschriebenen Zahlen. Diese werden verwendet, um ein neuronales Netz zu trainieren, welches in der Lage ist, handgeschriebene Zahlen zu erkennen.`,
      srcPath: 'assets/home-images/MnistExamples.png',
      video: false
    }, {
      title: 'Objekterkennung',
      routerLink: '/object',
      text: `Diese Komponente demonstriert, wie bereits trainierte Modelle für verschiedene Anwendungsfälle verwendet werden können.
      Konkret werden Objekte durch eine Kamera erkannt.`,
      srcPath: 'assets/home-images/obj-detect-driving.webm',
      video: true
    }, {
      title: 'Klassifizierung',
      routerLink: '/classify',
      text: `In der Komponente „Klassifizierung“ wird außerdem die Idee des Transfer-Lernens verwendet, um ein bestehendes Modell in seiner Funktionalität zu erweitern und anzupassen. `,
      srcPath: 'assets/home-images/classify.png',
      video: false
    }, {
      title: 'Tic Tac Toe',
      routerLink: '/tictactoe',
      text: `Hier kannst du gegen den Computer TicTacToe spielen und dabei zusehen, wie dieser dazulernt und seine Entscheidungen trifft. `,
      srcPath: 'assets/home-images/tic-tac-toe.webp',
      video: false
    }, {
      title: 'Cartpole',
      routerLink: '/cartpole',
      text: `CartPole ist ein berühmtes Problem, bei dem ein beweglicher Wagen versucht, einen Stab
      so lange wie möglich zu balancieren. In dieser Komponente wird ein neuronales Netz
      trainiert, um dieses Spiel bestmöglich zu absolvieren.`,
      srcPath: 'assets/home-images/cartpole.gif',
      video: false
    }, {
      title: 'Das Perceptron',
      routerLink: '/perceptron',
      text: `Hier kannst du in einer interaktiven Umgebung schrittweise die Grundlagen eines Perceptrons erfahren. 
      Perceptrons sind die elementaren Bausteine aus denen ein neuronales Netz besteht und sind für alle Entscheidungen verantwortlich.`,
      srcPath: 'assets/home-images/perceptron.png',
      video: false
    }, {
      title: 'GAN Training',
      routerLink: '/gan-training',
      text: `Was sind GANs? Und wofür können diese verwendet werden?`,
      srcPath: 'assets/home-images/gan-training.webp',
      video: false
    }, {
      title: 'Style Transfer',
      routerLink: '/gan-transfer',
      text: `Verwende eine GAN basierte KI, um den Stil eines Bildes auf ein neues Bild zu übertragen.`,
      srcPath: 'assets/home-images/style.webp',
      video: false
    }, {
      title: 'Landschaften erzeugen',
      routerLink: '/gan-landscpe',
      text: `Zeichne einen Sketch einer Landschaft und lass den Computer die Zeichnung interpretieren.`,
      srcPath: 'assets/home-images/landscape.gif',
      video: false
    },
  ];

  constructor() { }

  ngOnInit(): void {
  }

}

interface Card {
  title: string;
  text: string;
  routerLink: string;
  srcPath?: string;
  video?: boolean;
}
