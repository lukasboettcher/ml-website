import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-classify-help',
  templateUrl: './classify-help.component.html',
  styleUrls: ['./classify-help.component.css']
})
export class ClassifyHelpComponent implements OnInit {

  public page = 1;
  basePath = 'assets/classify-images';

  constructor() { }

  ngOnInit(): void {
  }
}
