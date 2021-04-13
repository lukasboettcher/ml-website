import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cartpole-help',
  templateUrl: './cartpole-help.component.html',
  styleUrls: ['./cartpole-help.component.css']
})
export class CartpoleHelpComponent implements OnInit {

  public page = 1;
  basePath = 'assets/cartpole-images';

  constructor() { }

  ngOnInit(): void {
  }
}
