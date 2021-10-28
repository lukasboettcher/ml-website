import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ttt-board',
  templateUrl: './ttt-board.component.html',
  styleUrls: ['./ttt-board.component.css']
})
export class TttBoardComponent implements OnInit {

  public states: string[];
  private playerSymbol = 'cross';
  private computerSymbol = 'circle';

  constructor() {
    this.states = Array.from({ length: 9 }, () => '');
  }

  ngOnInit(): void {
  }

  reset(): void {
    this.states = Array.from({ length: 9 }, () => '');
  }

  onFieldClicked(id: number): void {
    this.states[id] = this.playerSymbol;
  }

}
