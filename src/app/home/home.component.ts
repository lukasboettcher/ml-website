import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  basePath = 'assets/home-images';

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
