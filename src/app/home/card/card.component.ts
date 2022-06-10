import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class HomeCardComponent {

  @Input() title = 'Undefined Title';
  @Input() text = 'Undefined Text';
  @Input() srcPath: string;
  @Input() video = false;
  @Input() routerLink: string;

  constructor() { }

}
