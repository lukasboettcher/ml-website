import { Component, OnInit } from '@angular/core';
import * as p5 from 'p5';
import { Board } from './boardModel';
@Component({
  selector: 'app-tictactoe',
  templateUrl: './tictactoe.component.html',
  styleUrls: ['./tictactoe.component.css']
})
export class TictactoeComponent implements OnInit {

  // agent = new Agent(1, 2);
  board = new Board(1, 2);

  constructor() { }

  ngOnInit(): void {
  }

}
