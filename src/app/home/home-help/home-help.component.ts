import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-help',
  templateUrl: './home-help.component.html',
  styleUrls: ['./home-help.component.css']
})
export class HomeHelpComponent implements OnInit {

  public page = 1;
  constructor() { }

  ngOnInit(): void {
  }

}
