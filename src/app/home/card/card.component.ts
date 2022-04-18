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
  @Input() srcPath = 'assets/branding/tf-norm-de-blackgreyfaku-rgb-0720.png';
  @Input() video = false;

  constructor() { }

  ngOnInit(): void {
  }

}
