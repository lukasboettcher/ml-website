import { Component, Input, OnInit } from '@angular/core';
import { input } from '@tensorflow/tfjs';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class HomeCardComponent implements OnInit {

  @Input() title = 'Undefined Title';
  @Input() text = 'Undefined Text';
  @Input() srcPath: string;
  @Input() video = false;
  @Input() routerLink: string;

  constructor() { }

  ngOnInit(): void {
  }

}
